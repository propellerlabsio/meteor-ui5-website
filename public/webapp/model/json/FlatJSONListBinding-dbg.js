/*!
 * ${copyright}
 */

// Provides the JSON model implementation of a list binding
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/model/ListBinding',
	'sap/ui/model/ChangeReason',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterType',
	'sap/ui/model/FilterProcessor',
	'sap/ui/model/Sorter',
	'sap/ui/model/SorterProcessor'],
	function(jQuery, ListBinding, ChangeReason, Filter, FilterType, FilterProcessor, Sorter, SorterProcessor) {
	"use strict";



	/**
	 *
	 * @class
	 * List binding implementation for JSON format
	 *
	 * @param {meteor-ui5-demo.model.JSONModel} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {sap.ui.model.Sorter|sap.ui.model.Sorter[]} [aSorters] initial sort order (can be either a sorter or an array of sorters)
	 * @param {sap.ui.model|sap.ui.model.Filter[]} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 * @alias meteor-ui5-demo.model.FlatJSONListBinding
	 * @extends sap.ui.model.ListBinding
	 */
	var FlatJSONListBinding = ListBinding.extend("meteor-ui5-demo.model.FlatJSONListBinding", {


  		constructor : function(oModel, sPath, oContext, aSorters, aFilters, mParameters){
  			ListBinding.apply(this, arguments);
  			this.bIgnoreSuspend = false;
  			this.update();
  		},

  		metadata : {
  			publicMethods : [
  				"getLength"
  			]
  		}
    });

    /**
  	 * Filters the list.
  	 *
  	 * Filters are first grouped according to their binding path.
  	 * All filters belonging to a group are ORed and after that the
  	 * results of all groups are ANDed.
  	 * Usually this means, all filters applied to a single table column
  	 * are ORed, while filters on different table columns are ANDed.
  	 *
  	 * @param {sap.ui.model.Filter[]} aFilters Array of filter objects
  	 * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
  	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining
  	 *
  	 * @public
  	 */
  	FlatJSONListBinding.prototype.filter = function(aFilters, sFilterType){
  		if (this.bSuspended) {
  			this.checkUpdate(true);
  		}
  		this.updateIndices();
  		if (aFilters instanceof Filter) {
  			aFilters = [aFilters];
  		}
  		if (sFilterType == FilterType.Application) {
  			this.aApplicationFilters = aFilters || [];
  		} else if (sFilterType == FilterType.Control) {
  			this.aFilters = aFilters || [];
  		} else {
  			//Previous behaviour
  			this.aFilters = aFilters || [];
  			this.aApplicationFilters = [];
  		}
  		aFilters = this.aFilters.concat(this.aApplicationFilters);
  		if (aFilters.length == 0) {
  			this.iLength = this._getLength();
  		} else {
  			this.applyFilter();
  		}
  		this.applySort();

  		this.bIgnoreSuspend = true;

  		this._fireChange({reason: ChangeReason.Filter});
  		// TODO remove this if the filter event gets removed which is deprecated
  		if (sFilterType == FilterType.Application) {
  			this._fireFilter({filters: this.aApplicationFilters});
  		} else {
  			this._fireFilter({filters: this.aFilters});
  		}
  		this.bIgnoreSuspend = false;

  		return this;
  	};

    /**
  	 * Filters the list
  	 * Filters are first grouped according to their binding path.
  	 * All filters belonging to a group are ORed and after that the
  	 * results of all groups are ANDed.
  	 * Usually this means, all filters applied to a single table column
  	 * are ORed, while filters on different table columns are ANDed.
  	 * Multiple MultiFilters are ORed.
  	 *
  	 * @private
  	 */
  	FlatJSONListBinding.prototype.applyFilter = function(){
  		if (!this.aFilters) {
  			return;
  		}

  		var aFilters = this.aFilters.concat(this.aApplicationFilters),
  			that = this;

  		this.aIndices = FilterProcessor.apply(this.aIndices, aFilters, function(vRef, sPath) {
  			return that.oModel.getProperty(sPath, that.oList[vRef]);
  		});

  		this.iLength = this.aIndices.length;
  	};

    /**
  	 * Get distinct values
  	 *
  	 * @param {String} sPath
  	 *
  	 * @protected
  	 */
  	FlatJSONListBinding.prototype.getDistinctValues = function(sPath){
  		var aResult = [],
  			oMap = {},
  			sValue,
  			that = this;
  		jQuery.each(this.oList, function(i, oContext) {
  			sValue = that.oModel.getProperty(sPath, oContext);
  			if (!oMap[sValue]) {
  				oMap[sValue] = true;
  				aResult.push(sValue);
  			}
  		});
  		return aResult;
  	};

    /**
  	 * @see sap.ui.model.ListBinding.prototype.sort
  	 */
  	FlatJSONListBinding.prototype.sort = function(aSorters){
  		if (this.bSuspended) {
  			this.checkUpdate(true);
  		}
  		if (!aSorters) {
  			this.aSorters = null;
  			this.updateIndices();
  			this.applyFilter();
  		} else {
  			if (aSorters instanceof Sorter) {
  				aSorters = [aSorters];
  			}
  			this.aSorters = aSorters;
  			this.applySort();
  		}

  		this.bIgnoreSuspend = true;

  		this._fireChange({reason: ChangeReason.Sort});
  		// TODO remove this if the sorter event gets removed which is deprecated
  		this._fireSort({sorter: aSorters});
  		this.bIgnoreSuspend = false;

  		return this;
  	};

    /**
  	 * Sorts the list
  	 * @private
  	 */
  	FlatJSONListBinding.prototype.applySort = function(){
  		var that = this;

  		if (!this.aSorters || this.aSorters.length == 0) {
  			return;
  		}

  		this.aIndices = SorterProcessor.apply(this.aIndices, this.aSorters, function(vRef, sPath) {
  			return that.oModel.getProperty(sPath, that.oList[vRef]);
  		});
  	};

    /**
  	 * @see sap.ui.model.ListBinding.prototype.getLength
  	 *
  	 */
  	FlatJSONListBinding.prototype.getLength = function() {
  		return this.iLength;
  	};

    /**
  	 * Return the length of the list
  	 *
  	 * @return {int} the length
  	 */
  	FlatJSONListBinding.prototype._getLength = function() {
  		return this.aIndices.length;
  	};


	/**
	 * Return contexts for the list or a specified subset of contexts
	 * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
	 * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
	 * Default is the whole list length.
	 *
	 * @return {Array} the contexts array
	 * @protected
	 */
	FlatJSONListBinding.prototype.getContexts = function(iStartIndex, iLength) {
		this.iLastStartIndex = iStartIndex;
		this.iLastLength = iLength;

		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
		}

		var aContexts = this._getContexts(iStartIndex, iLength),
			aContextData = [];

		if (this.bUseExtendedChangeDetection) {
			// Use try/catch to detect issues with cyclic references in JS objects,
			// in this case diff will be disabled.
			try {
				for (var i = 0; i < aContexts.length; i++) {
					aContextData.push(this.getContextData(aContexts[i]));
				}

				//Check diff
				if (this.aLastContextData && iStartIndex < this.iLastEndIndex) {
					aContexts.diff = jQuery.sap.arraySymbolDiff(this.aLastContextData, aContextData);
				}

				this.iLastEndIndex = iStartIndex + iLength;
				this.aLastContexts = aContexts.slice(0);
				this.aLastContextData = aContextData.slice(0);
			} catch (oError) {
				this.bUseExtendedChangeDetection = false;
				jQuery.sap.log.warning("FlatJSONListBinding: Extended change detection has been disabled as JSON data could not be serialized.");
			}
		}

		return aContexts;
	};

	FlatJSONListBinding.prototype.getCurrentContexts = function() {
		if (this.bUseExtendedChangeDetection) {
			return this.aLastContexts || [];
		} else {
			return this.getContexts(this.iLastStartIndex, this.iLastLength);
		}
	};

	/**
	 * Returns the context data as required for change detection/diff. This may not contain
	 * all of the data, but just the key property
	 *
	 * @private
	 */
	FlatJSONListBinding.prototype.getContextData = function(oContext) {
		if (this.fnGetEntryKey && !this.bDetectUpdates) {
			return this.fnGetEntryKey(oContext);
		} else {
			return JSON.stringify(oContext.getObject());
		}
	};

	/**
	 * Get indices of the list
	 */
	FlatJSONListBinding.prototype.updateIndices = function() {
		var i;

		this.aIndices = [];
		if (jQuery.isArray(this.oList)) {
			for (i = 0; i < this.oList.length; i++) {
				this.aIndices.push(i);
			}
		} else {
			for (i in this.oList) {
				this.aIndices.push(i);
			}
		}
	};

	/**
	 * Update the list, indices array and apply sorting and filtering
	 * @private
	 */
	FlatJSONListBinding.prototype.update = function(){
		var oList = this.oModel._getObject(this.sPath, this.oContext);
		if (oList) {
			if (jQuery.isArray(oList)) {
				if (this.bUseExtendedChangeDetection) {
					this.oList = jQuery.extend(true, [], oList);
				} else {
					this.oList = oList.slice(0);
				}
			} else {
				this.oList = jQuery.extend(this.bUseExtendedChangeDetection, {}, oList);
			}
			this.updateIndices();
			this.applyFilter();
			this.applySort();
			this.iLength = this._getLength();
		} else {
			this.oList = [];
			this.aIndices = [];
			this.iLength = 0;
		}
	};

  /**
	 * Return contexts for the list or a specified subset of contexts
	 * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
	 * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
	 * Default is the whole list length.
	 *
	 * @return {Array} the contexts array
	 * @private
	 */
	FlatJSONListBinding.prototype._getContexts = function(iStartIndex, iLength) {
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
		}

		var iEndIndex = Math.min(iStartIndex + iLength, this.aIndices.length),
		oContext,
		aContexts = [],
		sPrefix = this.oModel.resolve(this.sPath, this.oContext);

		if (sPrefix && !jQuery.sap.endsWith(sPrefix, "/")) {
			sPrefix += "/";
		}

		for (var i = iStartIndex; i < iEndIndex; i++) {
			oContext = this.oModel.getContext(sPrefix + this.aIndices[i]);
			aContexts.push(oContext);
		}

		return aContexts;
	};

  /**
	 * Setter for context
	 * @param {Object} oContext the new context object
	 */
	FlatJSONListBinding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				this.update();
				this._fireChange({reason: ChangeReason.Context});
			}
		}
	};


	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 *
	 * @param {boolean} bForceupdate
	 *
	 */
	FlatJSONListBinding.prototype.checkUpdate = function(bForceupdate){

		if (this.bSuspended && !this.bIgnoreSuspend && !bForceupdate) {
			return;
		}

		if (!this.bUseExtendedChangeDetection) {
			var oList = this.oModel._getObject(this.sPath, this.oContext);
			if (!jQuery.sap.equal(this.oList, oList) || bForceupdate) {
				this.update();
				this._fireChange({reason: ChangeReason.Change});
			}
		} else {
			var bChangeDetected = false;
			var that = this;

			//If the list has changed we need to update the indices first
			var oList = this.oModel._getObject(this.sPath, this.oContext);
			if (oList && this.oList.length != oList.length) {
				bChangeDetected = true;
			}
			if (!jQuery.sap.equal(this.oList, oList)) {
				this.update();
			}

			//Get contexts for visible area and compare with stored contexts
			var aContexts = this._getContexts(this.iLastStartIndex, this.iLastLength);
			if (this.aLastContexts) {
				if (this.aLastContexts.length != aContexts.length) {
					bChangeDetected = true;
				} else {
					jQuery.each(this.aLastContextData, function(iIndex, oLastData) {
						var oCurrentData = that.getContextData(aContexts[iIndex]);
						if (oCurrentData !== oLastData) {
							bChangeDetected = true;
							return false;
						}
					});
				}
			} else {
				bChangeDetected = true;
			}
			if (bChangeDetected || bForceupdate) {
				this._fireChange({reason: ChangeReason.Change});
			}
		}
	};


	return FlatJSONListBinding;

});
