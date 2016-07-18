/*!
 * ${copyright}
 */

// Provides the base implementation for all model implementations
sap.ui.define([
		'jquery.sap.global',
		'sap/ui/model/Model',
		'sap/ui/model/BindingMode',
		'sap/ui/model/Context',
		'meteor-model-demo/model/MeteorListBinding'
	], function(jQuery, Model, BindingMode, Context, MeteorListBinding) {
	"use strict";


	/**
	 * The SAPUI5 Data Binding API.
	 *
	 * The default binding mode for model implementations (if not implemented otherwise) is two way and the supported binding modes by the model
	 * are one way, two way and one time. The default binding mode can be changed by the application for each model instance.
	 * A model implementation should specify its supported binding modes and set the default binding mode accordingly
	 * (e.g. if the model supports only one way binding the default binding mode should also be set to one way).
	 *
	 * The default size limit for models is 100. The size limit determines the number of entries used for the list bindings.
	 *
	 *
	 * @namespace
	 * @name sap.ui.model
	 * @public
	 */

	/**
	 * Constructor for a new MeteorModel.
	 *
	 * @extends sap.ui.model.Model
	 *
	 * @constructor
	 * @public
	 * @alias meteor-model-demo.model.MeteorModel
	 */
	var MeteorModel = Model.extend("meteor-model-demo.model.MeteorModel", /** @lends meteor-model-demo.model.MeteorModel.prototype */ {

		constructor : function () {
			Model.apply(this, arguments);

			// Delete property: All data is storage is provided by Meteor framework
			delete this.oData;

			// Overide size limit until we know how to mitigate one
			this.iSizeLimit = 10000;

			// Overwrite binding mode support property values
			this.sDefaultBindingMode = BindingMode.OneWay;
			this.mSupportedBindingModes = {"OneWay": true, "TwoWay": false, "OneTime": false};
		},

		metadata : {

			publicMethods : [
				// methods
				"bindProperty", "bindList", "bindTree", "bindContext", "createBindingContext", "destroyBindingContext", "getProperty",
				"getDefaultBindingMode", "setDefaultBindingMode", "isBindingModeSupported",
				 "setSizeLimit", "refresh", "isList", "getObject"
		  ]

		}

	});


	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name meteor-model-demo.model.MeteorModel.prototype.bindProperty
	 * @function
	 * @param {string}
	 *         sPath the path pointing to the property that should be bound
	 * @param {object}
	 *         [oContext=null] the context object for this databinding (optional)
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 * @return {sap.ui.model.PropertyBinding}
	 *
	 * @public
	 */

	/**
	 * @name meteor-model-demo.model.MeteorModel.prototype.bindList
	 * @function
	 * @param {string}
	 *         sPath the path pointing to the list / array that should be bound
	 * @param {object}
	 *         [oContext=null] the context object for this databinding (optional)
	 * @param {sap.ui.model.Sorter}
	 *         [aSorters=null] initial sort order (can be either a sorter or an array of sorters) (optional)
	 * @param {array}
	 *         [aFilters=null] predefined filter/s (can be either a filter or an array of filters) (optional)
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 * @return {sap.ui.model.ListBinding}

	 * @public
	 */
	 MeteorModel.prototype.bindList = function (sPath, oContext, aSorters, aFilters, mParameters){
		 var oBinding = new MeteorListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
		 return oBinding;
	 };

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name meteor-model-demo.model.MeteorModel.prototype.bindTree
	 * @function
	 * @param {string}
	 *         sPath the path pointing to the tree / array that should be bound
	 * @param {object}
	 *         [oContext=null] the context object for this databinding (optional)
	 * @param {array}
	 *         [aFilters=null] predefined filter/s contained in an array (optional)
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 * @param {array}
	 *         [aSorters=null] predefined sap.ui.model.sorter/s contained in an array (optional)
	 * @return {sap.ui.model.TreeBinding}

	 * @public
	 */

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name meteor-model-demo.model.MeteorModel.prototype.createBindingContext
	 * @function
	 * @param {string}
	 *         sPath the path to create the new context from
	 * @param {object}
	 *		   [oContext=null] the context which should be used to create the new binding context
	 * @param {object}
	 *		   [mParameters=null] the parameters used to create the new binding context
	 * @param {function}
	 *         [fnCallBack] the function which should be called after the binding context has been created
	 * @param {boolean}
	 *         [bReload] force reload even if data is already available. For server side models this should
	 *                   refetch the data from the server
	 * @return {sap.ui.model.Context} the binding context, if it could be created synchronously
	 *
	 * @public
	 */

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name meteor-model-demo.model.MeteorModel.prototype.destroyBindingContext
	 * @function
	 * @param {object}
	 *         oContext to destroy

	 * @public
	 */

	/**
	 * @name meteor-model-demo.model.MeteorModel.prototype.getProperty
	 * @function
	 * @param {string}
	 *         sPath the path to where to read the attribute value
	 * @param {object}
	 *		   [oContext=null] the context with which the path should be resolved
	 * @public
	 */
	 MeteorModel.prototype.getProperty = function(sPath,oContext){
	 		debugger;
	 };

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @param {string}
	 *         sPath the path to where to read the object
	 * @param {object}
	 *		   [oContext=null] the context with which the path should be resolved
	 * @public
	 */
	MeteorModel.prototype.getObject = function(sPath, oContext) {
		debugger;
		return this.getProperty(sPath, oContext);
	};


	/**
	 * Create ContextBinding
	 *
	 * @name meteor-model-demo.model.MeteorModel.prototype.bindContext
	 * @function
	 * @param {string | object}
	 *         sPath the path pointing to the property that should be bound or an object
	 *         which contains the following parameter properties: path, context, parameters
	 * @param {object}
	 *         [oContext=null] the context object for this databinding (optional)
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 * @param {object}
	 *         [oEvents=null] event handlers can be passed to the binding ({change:myHandler})
	 * @return {sap.ui.model.ContextBinding}
	 *
	 * @public
	 */
	 MeteorModel.prototype.bindContext = function(sPath, oContext, mParameters, oEvents) {
		 	debugger;
	 };

	/**
	 * Gets a binding context. If context already exists, return it from the map,
	 * otherwise create one using the context constructor.
	 *
	 * @param {string} sPath the path
	 */
	MeteorModel.prototype.getContext = function(sPath) {
		debugger;
		if (!jQuery.sap.startsWith(sPath, "/")) {
			throw new Error("Path " + sPath + " must start with a / ");
		}
		var oContext = this.mContexts[sPath];
		if (!oContext) {
			oContext = new Context(this, sPath);
			this.mContexts[sPath] = oContext;
		}
		return oContext;
	};

	/**
	 * Resolve the path relative to the given context.
	 *
	 * If a relative path is given (not starting with a '/') but no context,
	 * then the path can't be resolved and undefined is returned.
	 *
	 * For backward compatibility, the behavior of this method can be changed by
	 * setting the 'legacySyntax' property. Then an unresolvable, relative path
	 * is automatically converted into an absolute path.
	 *
	 * @param {string} sPath path to resolve
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @return {string} resolved path or undefined
	 */
	MeteorModel.prototype.resolve = function(sPath, oContext) {
		debugger;
		var bIsRelative = typeof sPath == "string" && !jQuery.sap.startsWith(sPath, "/"),
			sResolvedPath = sPath,
			sContextPath;
		if (bIsRelative) {
			if (oContext) {
				sContextPath = oContext.getPath();
				sResolvedPath = sContextPath + (jQuery.sap.endsWith(sContextPath, "/") ? "" : "/") + sPath;
			} else {
				sResolvedPath = this.isLegacySyntax() ? "/" + sPath : undefined;
			}
		}
		if (!sPath && oContext) {
			sResolvedPath = oContext.getPath();
		}
		// invariant: path never ends with a slash ... if root is requested we return /
		if (sResolvedPath && sResolvedPath !== "/" && jQuery.sap.endsWith(sResolvedPath, "/")) {
			sResolvedPath = sResolvedPath.substr(0, sResolvedPath.length - 1);
		}
		return sResolvedPath;
	};

	/**
	 * Get the default binding mode for the model
	 *
	 * @return {sap.ui.model.BindingMode} default binding mode of the model
	 *
	 * @public
	 */
	MeteorModel.prototype.getDefaultBindingMode = function() {
		debugger;
		return this.sDefaultBindingMode;
	};

	/**
	 * Set the default binding mode for the model. If the default binding mode should be changed,
	 * this method should be called directly after model instance creation and before any binding creation.
	 * Otherwise it is not guaranteed that the existing bindings will be updated with the new binding mode.
	 *
	 * @param {sap.ui.model.BindingMode} sMode the default binding mode to set for the model
	 * @returns {meteor-model-demo.model.MeteorModel} this pointer for chaining
	 * @public
	 */
	MeteorModel.prototype.setDefaultBindingMode = function(sMode) {
		debugger;
		if (this.isBindingModeSupported(sMode)) {
			this.sDefaultBindingMode = sMode;
			return this;
		}

		throw new Error("Binding mode " + sMode + " is not supported by this model.", this);
	};

	/**
	 * Check if the specified binding mode is supported by the model.
	 *
	 * @param {sap.ui.model.BindingMode} sMode the binding mode to check
	 *
	 * @public
	 */
	MeteorModel.prototype.isBindingModeSupported = function(sMode) {
		debugger;
		return (sMode in this.mSupportedBindingModes);
	};

		/**
	 * Set the maximum number of entries which are used for list bindings.
	 * @param {int} iSizeLimit collection size limit
	 * @public
	 */
	MeteorModel.prototype.setSizeLimit = function(iSizeLimit) {
		this.iSizeLimit = iSizeLimit;
	};

	/**
	 * Refresh the model.
	 * This will check all bindings for updated data and update the controls if data has been changed.
	 *
	 * @param {boolean} bForceUpdate Update controls even if data has not been changed
	 * @public
	 */
	MeteorModel.prototype.refresh = function(bForceUpdate) {
		debugger;
		this.checkUpdate(bForceUpdate);
		if (bForceUpdate) {
			this.fireMessageChange({oldMessages: this.mMessages});
		}
	};

	/**
	 * Destroys the model and clears the model data.
	 * A model implementation may override this function and perform model specific cleanup tasks e.g.
	 * abort requests, prevent new requests, etc.
	 *
	 * @see sap.ui.base.Object.prototype.destroy
	 * @public
	 */
	MeteorModel.prototype.destroy = function() {
		Model.prototype.destroy.apply(this, arguments);
	};

	/**
	 * Returns the original value for the property with the given path and context.
	 * The original value is the value that was last responded by a server if using a server model implementation.
	 *
	 * @param {string} sPath the path/name of the property
	 * @param {object} [oContext] the context if available to access the property value
	 * @returns {any} vValue the value of the property
	 * @public
	 */
	MeteorModel.prototype.getOriginalProperty = function(sPath, oContext) {
		debugger;
		return this.getProperty(sPath, oContext);
	};

	/**
	 * Returns whether a given path relative to the given contexts is in laundering state.
	 * If data is send to the server the data state becomes laundering until the
	 * data was accepted or rejected
	 *
	 * @param {string} sPath path to resolve
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @returns {boolean} true if the data in this path is laundering
	 */
	MeteorModel.prototype.isLaundering = function(sPath, oContext) {
		return false;
	};

	return MeteorModel;

});
