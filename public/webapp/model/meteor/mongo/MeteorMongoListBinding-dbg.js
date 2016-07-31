/*!

 * ${copyright}
 */


// Provides an abstraction for list bindings
sap.ui.define([
  'jquery.sap.global',
  'sap/ui/model/ListBinding',
  'sap/ui/model/Context',
  'sap/ui/model/FilterOperator',
  'sap/ui/model/ChangeReason'
], function(jQuery, ListBinding, Context, FilterOperator, ChangeReason) {
  "use strict";

  /**
   * Constructor for MeteorMongoListBinding
   *
   * @class
   * The MeteorMongoListBinding is a specific binding for lists in the model, which can be used
   * to populate Tables or ItemLists.
   *
   * @param {sap.ui.model.Model} oModel
   * @param {string} sPath
   * @param {sap.ui.model.Context} oContext
   * @param {array} [aSorters] initial sort order (can be either a sorter or an array of sorters)
   * @param {array} [aFilters] predefined filter/s (can be either a filter or an array of filters)
   * @param {object} [mParameters]
   *
   * @public
   * @alias meteor-ui5.MeteorMongoListBinding
   * @extends sap.ui.model.Binding
   */
  var MeteorMongoListBinding = ListBinding.extend("meteor-ui5.MeteorMongoListBinding", {

    constructor: function(oModel, sPath, oContext, aSorters, aFilters, mParameters) {

      ListBinding.call(this, oModel, sPath, oContext, mParameters);

      // BELOW COMMENTD CODE IS IN SUPER CLASS.  COPIED HERE AS DOCUMENTATION WHILE
      // I DEVELOP.
      // TODO: REMOVE.

      // Super:
      // this.aSorters = aSorters;
      // if (!jQuery.isArray(this.aSorters) && this.aSorters instanceof Sorter) {
      // 	this.aSorters = [this.aSorters];
      // } else if (!jQuery.isArray(this.aSorters)) {
      // 	this.aSorters = [];
      // }
      // this.aFilters = [];
      // if (!jQuery.isArray(aFilters) && aFilters instanceof Filter) {
      // 	aFilters = [aFilters];
      // } else if (!jQuery.isArray(aFilters)) {
      // 	aFilters = [];
      // }
      // this.aApplicationFilters = aFilters;
      // this.bUseExtendedChangeDetection = false;
      // this.bDetectUpdates = true;

      // Set up array for storing contexts
      this._aContexts = [];

      // Get query
      if (sPath.charAt(0) !== "/") {
        const sError = "Binding lists to anyother other than root element (Mongo Collection) not implemented yet";
        jQuery.sap.log.fatal(sError);
        oModel.fireParseError({ srcText: sError });
      }

      // Split path into components at forward slash
      var aComponents = sPath.split("/");
      if (aComponents[0] === "") {
        aComponents.shift();
      }

      // Validate components
      if (aComponents.length !== 1) {
        var sError = "Currently unsupported list bindind path: " + sPath;
        jQuery.sap.log.fatal(sError);
        oModel.fireParseError({ srcText: sError });
      }

      // Store Collection
      this._oCollection = Mongo.Collection.get(aComponents[0]);

      // Build and run query
      this._runQuery();
    }

  });

  MeteorMongoListBinding.prototype._runQuery = function() {
    // Stop observing changes in any existing query.  Will run forever otherwise.
    if (this._oQueryHandle) {
      this._oQueryHandle.stop();
    }

    // Reset existing contexts
    this._aContexts = [];
    this._fireChange(ChangeReason.remove);

    // Build mongo selector
    let selector = {};
    if (this.aFilters.length){
      selector = this._buildMongoSelector();
    }

    // Build query options
    let options = {
      limit: this.oModel.iSizeLimit
    };
    if (this.aSorters.length) {
      options.sort = this._buildMongoSortSpecifier();
    }

    // Execute query
    this._oCursor = this._oCollection.find(selector, options);

    // Create query handle so we can observe changes
    // var that = this;
    this._oQueryHandle = this._oCursor.observeChanges({
      addedBefore: (id, fields, before) => {
        const oContext = new Context(this.oModel, this.sPath + "(" + id + ")");
        this._aContexts.push(oContext);
        this.fireDataReceived();
        this._fireChange(ChangeReason.add);
      },

      changed: (id, fields) => {
        //TODO performance - only update data that has changed
        console.log("Record(s) changed - refreshing all");
        this.oModel.refresh();
      },

      removed: (id) => {
        //TODO performance - only update data that has changed
        console.log("Record(s) removed - refreshing all");
        this.oModel.refresh();
      }
    });
  }

  MeteorMongoListBinding.prototype._buildMongoSelector = function() {
    let oMongoSelector = {};
    // Build mongo selector incorporating each filter
    this.aFilters.forEach((oFilter) => {
      // Example filter object:
      // {sPath: "Country", sOperator: "EQ", oValue1: "USA", oValue2: undefined, _bMultiFilter: false}

      // Validate: We don't currently support multi-filter
      if (oFilter._bMultiFilter) {
        const sError = "MultiFilter not yet supported by ListBinding.";
        jQuery.sap.log.fatal(sError);
        this.oModel.fireParseError({ srcText: sError });
        return;
      }

      // Build selector according to filter operator
      let oPropertySelector = {};
      switch (oFilter.sOperator) {
        case FilterOperator.BT:
          oPropertySelector["$gte"] = oFilter.oValue1;
          oPropertySelector["$lte"] = oFilter.oValue2;
          break;
        case FilterOperator.Contains:
          // TODO investigate performance options. Need to also determine if
          // we can dynamically determine and use $text if a text index has been
          // created.
          oPropertySelector["$regex"] = "/" + oFilter.oValue1 + "/";
          oPropertySelector["$options"] = "i"; // case-insensitive
          break;
        case FilterOperator.EndsWith:
          oPropertySelector["$regex"] = "/" + oFilter.oValue1 + "$/";
          break;
        case FilterOperator.EQ:
          // TODO add $eq when supported in mini-mongo (version 1.4?).  Hope this
          // work around doesn't bite us in the mean time.  Refer:
          // https://github.com/meteor/meteor/issues/4142
          oPropertySelector = oFilter.oValue1;
          break;
        case FilterOperator.GE:
          oPropertySelector["$gte"] = oFilter.oValue1;
        case FilterOperator.GT:
          oPropertySelector["$gt"] = oFilter.oValue1;
          break;
        case FilterOperator.LE:
          oPropertySelector["$lte"] = oFilter.oValue1;
          break;
        case FilterOperator.LT:
          oPropertySelector["$lt"] = oFilter.oValue1;
          break;
        case FilterOperator.NE:
          //TODO: Test.  Valid in Mongo, not sure if minimongo supports - see
          // EQ FilterOperator above
          oPropertySelector["$ne"] = oFilter.oValue1;
          break;
        case FilterOperator.StartsWith:
          oPropertySelector["$regex"] = "/^" + oFilter.oValue1 + "/";
          break;
        default:
          const sError = "Filter operator " + oFilter.sOperator + " not supported.";
          jQuery.sap.log.fatal(sError);
          this.oModel.fireParseError({ srcText: sError });
          return;
      }

      // Add property selector to our overall selector
      if (!oMongoSelector[oFilter.sPath]){
        // Create empty object for this property
        oMongoSelector[oFilter.sPath] = oPropertySelector;
      // } else if (oMongoSelector.$and) {
      //
      } else {
        // TODO: How to merge these?  Not handled yet
        const sError = "Multiple filters on same property not yet supported by ListBinding.";
        jQuery.sap.log.fatal(sError);
        this.oModel.fireParseError({ srcText: sError });
        return;
      }


      // // Don't know what options need to be supported yet but currently
      // // we only support sorting based on a simple property with ascending or
      // // descending option.  Validate that this sorter seems to meet that
      // // criteria.
      // const bHasSlash = (oSorter.sPath.indexOf("/") > -1);
      // const bHasPeriod = (oSorter.sPath.indexOf(".") > -1);
      // if (bHasSlash || bHasPeriod) {
      //   const sError = "Currently unsupported list sorting path: " + oSorter.sPath;
      //   jQuery.sap.log.fatal(sError);
      //   this.oModel.fireParseError({ srcText: sError });
      //   return;
      // }

    });

    return oMongoSelector;
  };

  MeteorMongoListBinding.prototype._buildMongoSortSpecifier = function() {
    let oMongoSortSpecifier = {};
    this.aSorters.forEach((oSorter) => {
      // Don't know what options need to be supported yet but currently
      // we only support sorting based on a simple property with ascending or
      // descending option.  Validate that this sorter seems to meet that
      // criteria.
      const bHasSlash = (oSorter.sPath.indexOf("/") > -1);
      const bHasPeriod = (oSorter.sPath.indexOf(".") > -1);
      if (bHasSlash || bHasPeriod) {
        const sError = "Currently unsupported list sorting path: " + oSorter.sPath;
        jQuery.sap.log.fatal(sError);
        this.oModel.fireParseError({ srcText: sError });
        return;
      }

      // Validate that we don't have a custom comparator function (if not possible
      // with Mongo read - may be able to add it later as post query javascript
      // filtering)
      if (oSorter.fnCompare) {
        const sError = "Custom sort comparator functions currently unsupported";
        jQuery.sap.log.fatal(sError);
        this.oModel.fireParseError({ srcText: sError });
        return;
      }

      // Build mongo sort specifier
      oMongoSortSpecifier[oSorter.sPath] = oSorter.bDescending ? -1 : 1;
    });

    return oMongoSortSpecifier;
  };

  /**
   * Returns an array of binding contexts for the bound target list.
   *
   * <strong>Note:</strong>The public usage of this method is deprecated, as calls from outside of controls will lead
   * to unexpected side effects. For avoidance use {@link meteor-ui5.MeteorMongoListBinding.prototype.getCurrentContexts}
   * instead.
   *
   * @function
   * @name meteor-ui5.MeteorMongoListBinding.prototype.getContexts
   * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
   * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
   * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
   *
   * @protected
   */
  MeteorMongoListBinding.prototype.getContexts = function(iStartIndex, iLength) {
    // TODO Optimize the interplay between this method and the observeChanges.added
    // code added to the query.  It's exponentially better than it was but is still
    // being called every time dataChange is fired so if the query results
    // in say 830 records, then it is called 830 times returning 0..830 records.
    // NOTE above does not seem to impact performace with local testing of 830
    // records so may be a low priority issue or no issue at all.
    const iStart = iStartIndex === undefined ? 0 : iStartIndex;
    const iLen = iLength === undefined ? this.oModel.iSizeLimit - iStart : iLength;
    return this._aContexts.slice(iStart).splice(0, iLen);
  };

  MeteorMongoListBinding.prototype.destroy = function() {
    // Call stop on queryHandle on destroy of meteor model per docs:
    // "observeChanges returns a live query handle, which is an object with a
    // stop method. Call stop with no arguments to stop calling the callback functions
    // and tear down the query. The query will run forever until you call this. "
    if (this._oQueryHandle) {
      this._oQueryHandle.stop();
    }
  };

  /**
   * Filters the list according to the filter definitions
   *
   * @function
   * @name meteor-ui5.MeteorMongoListBinding.prototype.filter
   * @param {object[]} aFilters Array of filter objects
   * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
   * @return {meteor-ui5.MeteorMongoListBinding} returns <code>this</code> to facilitate method chaining
   *
   * @public
   */
  MeteorMongoListBinding.prototype.filter = function(aFilters, sFilterType) {
    // Replace contents of aFilters property
    this.aFilters = aFilters;

    // Re-run query
    this._runQuery();
  };

  /**
   * Sorts the list according to the sorter object
   *
   * @function
   * @name meteor-ui5.MeteorMongoListBinding.prototype.sort
   * @param {sap.ui.model.Sorter|Array} aSorters the Sorter object or an array of sorters which defines the sort order
   * @return {meteor-ui5.MeteorMongoListBinding} returns <code>this</code> to facilitate method chaining
   * @public
   */
  MeteorMongoListBinding.prototype.sort = function(aSorters) {
    // Replace contents of aSorters property
    Array.isArray(aSorters) ? this.aSorters = aSorters : this.aSorters = [aSorters];

    // Re-run query
    this._runQuery();
  };

  /**
   * Returns an array of currently used binding contexts of the bound control
   *
   * This method does not trigger any data requests from the backend or delta calculation, but just returns the context
   * array as last requested by the control. This can be used by the application to get access to the data currently
   * displayed by a list control.
   *
   * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
   * @since 1.28
   * @public
   */
  MeteorMongoListBinding.prototype.getCurrentContexts = function() {
    return this._aContexts;
  };

  /**
   * Returns the number of entries in the list. This might be an estimated or preliminary length, in case
   * the full length is not known yet, see method isLengthFinal().
   *
   * @return {int} returns the number of entries in the list
   * @since 1.24
   * @public
   */
  MeteorMongoListBinding.prototype.getLength = function() {
    return this._aContexts.length;
  };

  /**
   * Returns whether the length which can be retrieved using getLength() is a known, final length,
   * or an preliminary or estimated length which may change if further data is requested.
   *
   * @return {boolean} returns whether the length is final
   * @since 1.24
   * @public
   */
  MeteorMongoListBinding.prototype.isLengthFinal = function() {
    // TODO don't know what to do here yet.  Can't get this method
    // to trigger and in any case, the only way to calculate if queryHandle.count()
    // is final is to introduce subscriptions to the model which I've been
    // keen to avoid as it will complicate the hell out of things whereas
    // having it outside of the model is quite simple.  There's a discussion
    // on the issue here:
    // http://stackoverflow.com/questions/18744665/how-to-get-a-published-collections-total-count-regardless-of-a-specified-limit
    // In the mean time return false;
    return false;
  };

  /**
   * Returns list of distinct values for the given relative binding path
   *
   * @param {string} sPath the relative binding path
   * @return {Array} the array of distinct values.
   *
   * @public
   */
  MeteorMongoListBinding.prototype.getDistinctValues = function(sPath) {
    return null;
  };

  /**
   * Enable extended change detection
   *
   * @param {boolean} bDetectUpdates Whether changes within the same entity should cause a delete and insert command
   * @param {function|string} vKey The path of the property containing the key or a function getting the context as only parameter to calculate a key to identify an entry
   * @private
   */
  MeteorMongoListBinding.prototype.enableExtendedChangeDetection = function(bDetectUpdates, vKey) {

    // TODO: BELOW CODE HAS BEEN COPIED VERBATIM FROM 'sap/ui/model/ListBinding'
    // DON'T KNOW HOW IT WORKS AND WHAT IT IS SUPPOSED TO DO SO HOISTING INTO THIS CLASS
    // TO OBSERVE IT. REPLACE OR DELETE IT WHEN ITS UNDERSTOOD

    this.bUseExtendedChangeDetection = true;
    this.bDetectUpdates = bDetectUpdates;
    if (typeof vKey === "string") {
      this.fnGetEntryKey = function(oContext) {
        return oContext.getProperty(vKey);
      };
    } else if (typeof vKey === "function") {
      this.fnGetEntryKey = vKey;
    }
    if (this.update) {
      this.update();
    }
  };

  return MeteorMongoListBinding;

});
