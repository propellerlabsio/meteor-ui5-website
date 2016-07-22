/*!
 * ${copyright}
 */

/**
 * JSON-based DataBinding
 *
 * @namespace
 * @name meteor-ui5-demo.model
 * @public
 */

// Provides the JSON object based model implementation
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', 'sap/ui/model/Context', './FlatJSONListBinding', './FlatJSONPropertyBinding', './FlatJSONTreeBinding'],
	function(jQuery, Model, Context, FlatJSONListBinding, FlatJSONPropertyBinding, FlatJSONTreeBinding) {
	"use strict";


	/**
	 * Constructor for a new FlatJSONModel.
	 *
	 * @class
	 * Model implementation for JSON format
	 *
	 * The observation feature is experimental! When observation is activated, the application can directly change the
	 * JS objects without the need to call setData, setProperty or refresh. Observation does only work for existing
	 * properties in the JSON, it can not detect new properties or new array entries.
	 *
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @param {object} oData either the URL where to load the JSON from or a JS object
	 * @param {boolean} bObserve whether to observe the JSON data for property changes (experimental)
	 * @constructor
	 * @public
	 * @alias meteor-ui5-demo.model.FlatJSONModel
	 */
	var FlatJSONModel = Model.extend("meteor-ui5-demo.model.FlatJSONModel", /** @lends meteor-ui5-demo.model.FlatJSONModel.prototype */ {

		constructor : function(oData, bObserve) {
			this.pSequentialImportCompleted = Promise.resolve();
			Model.apply(this, arguments);

			this.bCache = true;
			this.aPendingRequestHandles = [];

			if (typeof oData == "string") {
				this.loadData(oData);
			}

			this.bObserve = bObserve;
			if (oData && typeof oData == "object") {
				this.setData(oData);
			}
		},

		metadata : {
			publicMethods : ["setJSON", "getJSON", "loadData", "setData", "getData", "setProperty", "forceNoCache"]
		}

	});
	/**

	 * Returns the current data of the model.
	 * Be aware that the returned object is a reference to the model data so all changes to that data will also change the model data.
	 *
	 * @return the data object
	 * @public
	 */
	FlatJSONModel.prototype.getData = function(){
		return this.oData;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindElement
	 *
	 */
	/**
	 * @see sap.ui.model.Model.prototype.createBindingContext
	 *
	 */
	FlatJSONModel.prototype.createBindingContext = function(sPath, oContext, mParameters, fnCallBack) {
		// optional parameter handling
		if (typeof oContext == "function") {
			fnCallBack = oContext;
			oContext = null;
		}
		if (typeof mParameters == "function") {
			fnCallBack = mParameters;
			mParameters = null;
		}
		// resolve path and create context
		var sContextPath = this.resolve(sPath, oContext),
			oNewContext = (sContextPath == undefined) ? undefined : this.getContext(sContextPath ? sContextPath : "/");
		if (!oNewContext) {
			oNewContext = null;
		}
		if (fnCallBack) {
			fnCallBack(oNewContext);
		}
		return oNewContext;
	};

	/**
	 * Sets the JSON encoded data to the model.
	 *
	 * @param {object} oData the data to set on the model
	 * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
	 *
	 * @public
	 */
	FlatJSONModel.prototype.setData = function(oData, bMerge){
		if (bMerge) {
			// do a deep copy
			this.oData = jQuery.extend(true, jQuery.isArray(this.oData) ? [] : {}, this.oData, oData);
		} else {
			this.oData = oData;
		}
		if (this.bObserve) {
			this.observeData();
		}
		this.checkUpdate();
	};

	/**
	 * Recursively iterates the JSON data and adds setter functions for the properties
	 *
	 * @private
	 */
	FlatJSONModel.prototype.observeData = function(){
		var that = this;
		function createGetter(vValue) {
			return function() {
				return vValue;
			};
		}
		function createSetter(oObject, sName) {
			return function(vValue) {
				// Newly added data needs to be observed to be included
				observeRecursive(vValue, oObject, sName);
				that.checkUpdate();
			};
		}
		function createProperty(oObject, sName, vValue) {
			// Do not create getter/setter for function references
			if (typeof vValue == "function"){
				oObject[sName] = vValue;
			} else {
				Object.defineProperty(oObject, sName, {
					get: createGetter(vValue),
					set: createSetter(oObject, sName)
				});
			}
		}
		function observeRecursive(oObject, oParentObject, sName) {
			if (jQuery.isArray(oObject)) {
				for (var i = 0; i < oObject.length; i++) {
					observeRecursive(oObject[i], oObject, i);
				}
			} else if (jQuery.isPlainObject(oObject)) {
				for (var i in oObject) {
					observeRecursive(oObject[i], oObject, i);
				}
			}
			if (oParentObject) {
				createProperty(oParentObject, sName, oObject);
			}
		}
		observeRecursive(this.oData);
	};

	/**
	 * Sets the JSON encoded string data to the model.
	 *
	 * @param {string} sJSONText the string data to set on the model
	 * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
	 *
	 * @public
	 */
	FlatJSONModel.prototype.setJSON = function(sJSONText, bMerge){
		var oJSONData;
		try {
			oJSONData = jQuery.parseJSON(sJSONText);
			this.setData(oJSONData, bMerge);
		} catch (e) {
			jQuery.sap.log.fatal("The following problem occurred: JSON parse Error: " + e);
			this.fireParseError({url : "", errorCode : -1,
				reason : "", srcText : e, line : -1, linepos : -1, filepos : -1});
		}
	};

	/**
	 * Serializes the current JSON data of the model into a string.
	 * Note: May not work in Internet Explorer 8 because of lacking JSON support (works only if IE 8 mode is enabled)
	 *
	 * @return {string} sJSON the JSON data serialized as string
	 * @public
	 */
	FlatJSONModel.prototype.getJSON = function(){
		return JSON.stringify(this.oData);
	};

	/**
	 * Force no caching.
	 * @param {boolean} [bForceNoCache=false] whether to force not to cache
	 * @public
	 */
	FlatJSONModel.prototype.forceNoCache = function(bForceNoCache) {
		this.bCache = !bForceNoCache;
	};

	FlatJSONModel.prototype._ajax = function(oParameters){
		var that = this;

		if (this.bDestroyed) {
			return;
		}

		function wrapHandler(fn) {
			return function() {
				// request finished, remove request handle from pending request array
				var iIndex = jQuery.inArray(oRequestHandle, that.aPendingRequestHandles);
				if (iIndex > -1) {
					that.aPendingRequestHandles.splice(iIndex, 1);
				}

				// call original handler method
				if (!(oRequestHandle && oRequestHandle.bSuppressErrorHandlerCall)) {
					fn.apply(this, arguments);
				}
			};
		}

		oParameters.success = wrapHandler(oParameters.success);
		oParameters.error = wrapHandler(oParameters.error);

		var oRequestHandle = jQuery.ajax(oParameters);

		// add request handle to array and return it (only for async requests)
		if (oParameters.async) {
			this.aPendingRequestHandles.push(oRequestHandle);
		}

	};

	/**
	 * @see sap.ui.model.Model.prototype.destroy
	 * @public
	 */
	FlatJSONModel.prototype.destroy = function() {
		Model.prototype.destroy.apply(this, arguments);
		// Abort pending requests
		if (this.aPendingRequestHandles) {
			for (var i = this.aPendingRequestHandles.length - 1; i >= 0; i--) {
				var oRequestHandle = this.aPendingRequestHandles[i];
				if (oRequestHandle && oRequestHandle.abort) {
					oRequestHandle.bSuppressErrorHandlerCall = true;
					oRequestHandle.abort();
				}
			}
			delete this.aPendingRequestHandles;
		}
	};

	/**
	 * @see sap.ui.model.Model.prototype.destroyBindingContext
	 *
	 */
	FlatJSONModel.prototype.destroyBindingContext = function(oContext) {
		// TODO: what todo here?
	};

	/**
	 * update all bindings
	 * @param {boolean} bForceUpdate true/false: Default = false. If set to false an update
	 * 					will only be done when the value of a binding changed.
	 * @public
	 */
	FlatJSONModel.prototype.updateBindings = function(bForceUpdate) {
		this.checkUpdate(bForceUpdate);
	};

		/**
		 * @see sap.ui.model.Model.prototype.bindContext
		 */
		FlatJSONModel.prototype.bindContext = function(sPath, oContext, mParameters) {
			var oBinding = new ClientContextBinding(this, sPath, oContext, mParameters);
			return oBinding;
		};

	/**
	 * Load JSON-encoded data from the server using a GET HTTP request and store the resulting JSON data in the model.
	 * Note: Due to browser security restrictions, most "Ajax" requests are subject to the same origin policy,
	 * the request can not successfully retrieve data from a different domain, subdomain, or protocol.
	 *
	 * @param {string} sURL A string containing the URL to which the request is sent.
	 * @param {object | string} [oParameters] A map or string that is sent to the server with the request.
	 * Data that is sent to the server is appended to the URL as a query string.
	 * If the value of the data parameter is an object (map), it is converted to a string and
	 * url-encoded before it is appended to the URL.
	 * @param {boolean} [bAsync=true] By default, all requests are sent asynchronous
	 * (i.e. this is set to true by default). If you need synchronous requests, set this option to false.
	 * Cross-domain requests do not support synchronous operation. Note that synchronous requests may
	 * temporarily lock the browser, disabling any actions while the request is active.
	 * @param {string} [sType=GET] The type of request to make ("POST" or "GET"), default is "GET".
	 * Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but
	 * they are not supported by all browsers.
	 * @param {boolean} [bMerge=false] whether the data should be merged instead of replaced
	 * @param {string} [bCache=false] force no caching if false. Default is false
	 * @param {object} [mHeaders] An object of additional header key/value pairs to send along with the request
	 *
	 * @public
	 */
	FlatJSONModel.prototype.loadData = function(sURL, oParameters, bAsync, sType, bMerge, bCache, mHeaders){
		var pImportCompleted;

		bAsync = (bAsync !== false);
		sType = sType || "GET";
		bCache = bCache === undefined ? this.bCache : bCache;

		this.fireRequestSent({url : sURL, type : sType, async : bAsync, headers: mHeaders,
			info : "cache=" + bCache + ";bMerge=" + bMerge, infoObject: {cache : bCache, merge : bMerge}});

		var fnSuccess = function(oData) {
			if (!oData) {
				jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + sURL);
			}
			this.setData(oData, bMerge);
			this.fireRequestCompleted({url : sURL, type : sType, async : bAsync, headers: mHeaders,
				info : "cache=" + bCache + ";bMerge=" + bMerge, infoObject: {cache : bCache, merge : bMerge}, success: true});
		}.bind(this);

		var fnError = function(oParams){
			var oError = { message : oParams.textStatus, statusCode : oParams.request.status, statusText : oParams.request.statusText, responseText : oParams.request.responseText};
			jQuery.sap.log.fatal("The following problem occurred: " + oParams.textStatus, oParams.request.responseText + ","
						+ oParams.request.status + "," + oParams.request.statusText);

			this.fireRequestCompleted({url : sURL, type : sType, async : bAsync, headers: mHeaders,
				info : "cache=" + bCache + ";bMerge=" + bMerge, infoObject: {cache : bCache, merge : bMerge}, success: false, errorobject: oError});
			this.fireRequestFailed(oError);
		}.bind(this);

		var _loadData = function(fnSuccess, fnError) {
			this._ajax({
				url: sURL,
				async: bAsync,
				dataType: 'json',
				cache: bCache,
				data: oParameters,
				headers: mHeaders,
				type: sType,
				success: fnSuccess,
				error: fnError
			});
		}.bind(this);

		if (bAsync) {
			pImportCompleted = new Promise(function(resolve, reject) {
				var fnReject =  function(oXMLHttpRequest, sTextStatus, oError) {
					reject({request: oXMLHttpRequest, textStatus: sTextStatus, error: oError});
				};
				_loadData(resolve, fnReject);
			});

			this.pSequentialImportCompleted = this.pSequentialImportCompleted.then(function() {
				return pImportCompleted.then(fnSuccess, fnError);
			});
		} else {
			_loadData(fnSuccess, fnError);
		}
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindProperty
	 *
	 */
	FlatJSONModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
		var oBinding = new FlatJSONPropertyBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindList
	 *
	 */
	FlatJSONModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
		var oBinding = new FlatJSONListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindTree
	 *
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 *         If the mParameter <code>arrayNames</code> is specified with an array of string names this names will be checked against the tree data structure
	 *         and the found data in this array is included in the tree but only if also the parent array is included.
	 *         If this parameter is not specified then all found arrays in the data structure are bound.
	 *         If the tree data structure doesn't contain an array you don't have to specify this parameter.
	 *
	 */
	FlatJSONModel.prototype.bindTree = function(sPath, oContext, aFilters, mParameters, aSorters) {
		var oBinding = new FlatJSONTreeBinding(this, sPath, oContext, aFilters, mParameters, aSorters);
		return oBinding;
	};

	/**
	 * Sets a new value for the given property <code>sPropertyName</code> in the model.
	 * If the model value changed all interested parties are informed.
	 *
	 * @param {string}  sPath path of the property to set
	 * @param {any}     oValue value to set the property to
	 * @param {object} [oContext=null] the context which will be used to set the property
	 * @param {boolean} [bAsyncUpdate] whether to update other bindings dependent on this property asynchronously
	 * @return {boolean} true if the value was set correctly and false if errors occurred like the entry was not found.
	 * @public
	 */
	FlatJSONModel.prototype.setProperty = function(sPath, oValue, oContext, bAsyncUpdate) {
		var sResolvedPath = this.resolve(sPath, oContext),
			iLastSlash, sObjectPath, sProperty;

		// return if path / context is invalid
		if (!sResolvedPath) {
			return false;
		}

		// If data is set on root, call setData instead
		if (sResolvedPath == "/") {
			this.setData(oValue);
			return true;
		}

		iLastSlash = sResolvedPath.lastIndexOf("/");
		// In case there is only one slash at the beginning, sObjectPath must contain this slash
		sObjectPath = sResolvedPath.substring(0, iLastSlash || 1);
		sProperty = sResolvedPath.substr(iLastSlash + 1);

		var oObject = this._getObject(sObjectPath);
		if (oObject) {
			oObject[sProperty] = oValue;
			this.checkUpdate(false, bAsyncUpdate);
			return true;
		}
		return false;
	};

	/**
	* Returns the value for the property with the given <code>sPropertyName</code>
	*
	* @param {string} sPath the path to the property
	* @param {object} [oContext=null] the context which will be used to retrieve the property
	* @type any
	* @return the value of the property
	* @public
	*/
	FlatJSONModel.prototype.getProperty = function(sPath, oContext) {
		return this._getObject(sPath, oContext);

	};

	/**
	 * @param {string} sPath
	 * @param {object} [oContext]
	 * @returns {any} the node of the specified path/context
	 */
	FlatJSONModel.prototype._getObject = function (sPath, oContext) {
		var oNode = this.isLegacySyntax() ? this.oData : null;
		if (oContext instanceof Context) {
			oNode = this._getObject(oContext.getPath());
		} else if (oContext) {
			oNode = oContext;
		}
		if (!sPath) {
			return oNode;
		}
		var aParts = sPath.split("/"),
			iIndex = 0;
		if (!aParts[0]) {
			// absolute path starting with slash
			oNode = this.oData;
			iIndex++;
		}
		while (oNode && aParts[iIndex]) {
			oNode = oNode[aParts[iIndex]];
			iIndex++;
		}
		return oNode;
	};

	FlatJSONModel.prototype.isList = function(sPath, oContext) {
		var sAbsolutePath = this.resolve(sPath, oContext);
		return jQuery.isArray(this._getObject(sAbsolutePath));
	};


	return FlatJSONModel;

});
