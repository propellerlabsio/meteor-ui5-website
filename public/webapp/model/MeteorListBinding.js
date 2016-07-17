/*!

 * ${copyright}
 */

// Provides an abstraction for list bindings
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ListBinding', 'sap/ui/model/Filter', 'sap/ui/model/Sorter'],
  function(jQuery, ListBinding, Filter, Sorter) {
    "use strict";


    /**
     * Constructor for MeteorListBinding
     *
     * @class
     * The MeteorListBinding is a specific binding for lists in the model, which can be used
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
     * @alias meteor-model-demo.model.MeteorListBinding
     * @extends sap.ui.model.ListBinding
     */
    var MeteorListBinding = ListBinding.extend("meteor-model-demo.model.MeteorListBinding", /** @lends meteor-model-demo.model.MeteorListBinding.prototype */ {

      constructor: function(oModel, sPath, oContext, aSorters, aFilters, mParameters) {
        debugger;
        ListBinding.call(this, oModel, sPath, oContext, mParameters);
      },

      metadata: {
        publicMethods: [
          // methods
          "getContexts", "getCurrentContexts", "sort", "attachSort", "detachSort", "filter", "attachFilter", "detachFilter", "getDistinctValues", "isGrouped", "getLength", "isLengthFinal"
        ]
      }

    });


    /**
     * Returns an array of binding contexts for the bound target list.
     *
     * <strong>Note:</strong>The public usage of this method is deprecated, as calls from outside of controls will lead
     * to unexpected side effects.
     *
     * @function
     * @name meteor-model-demo.model.MeteorListBinding.prototype.getContexts
     * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
     * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
     * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
     *
     * @protected
     */
    MeteorListBinding.prototype.getContexts = function(iStartIndex, iLength) {
      if (!iStartIndex) {
        iStartIndex = 0;
      }
      if (!iLength) {
        iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
      }

      // TODO check below change - we have no aIndices calculation in our model
      // var iEndIndex = Math.min(iStartIndex + iLength, this.aIndices.length),
       var iEndIndex = Math.min(iStartIndex + iLength, this.iLength),
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
     * Filters the list according to the filter definitions
     *
     * @function
     * @name meteor-model-demo.model.MeteorListBinding.prototype.filter
     * @param {object[]} aFilters Array of filter objects
     * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
     * @return {meteor-model-demo.model.MeteorListBinding} returns <code>this</code> to facilitate method chaining
     *
     * @public
     */

    /**
     * Sorts the list according to the sorter object
     *
     * @function
     * @name meteor-model-demo.model.MeteorListBinding.prototype.sort
     * @param {sap.ui.model.Sorter|Array} aSorters the Sorter object or an array of sorters which defines the sort order
     * @return {meteor-model-demo.model.MeteorListBinding} returns <code>this</code> to facilitate method chaining
     * @public
     */

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
    MeteorListBinding.prototype.getCurrentContexts = function() {
      return this.getContexts();
    };

    /**
     * Returns the number of entries in the list. This might be an estimated or preliminary length, in case
     * the full length is not known yet, see method isLengthFinal().
     *
     * @return {int} returns the number of entries in the list
     * @since 1.24
     * @public
     */
    MeteorListBinding.prototype.getLength = function() {
      return 0;

    };

    /**
     * Returns whether the length which can be retrieved using getLength() is a known, final length,
     * or an preliminary or estimated length which may change if further data is requested.
     *
     * @return {boolean} returns whether the length is final
     * @since 1.24
     * @public
     */
    MeteorListBinding.prototype.isLengthFinal = function() {
      return true;
    };

    // base methods, may be overridden by child classes
    /**
     * Returns list of distinct values for the given relative binding path
     *
     * @param {string} sPath the relative binding path
     * @return {Array} the array of distinct values.
     *
     * @public
     */
    MeteorListBinding.prototype.getDistinctValues = function(sPath) {
      return null;
    };

    //Eventing and related
    /**
     * Attach event-handler <code>fnFunction</code> to the 'sort' event of this <code>meteor-model-demo.model.MeteorListBinding</code>.<br/>
     * @param {function} fnFunction The function to call, when the event occurs.
     * @param {object} [oListener] object on which to call the given function.
     * @protected
     * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
     */
    MeteorListBinding.prototype.attachSort = function(fnFunction, oListener) {
      this.attachEvent("sort", fnFunction, oListener);
    };

    /**
     * Detach event-handler <code>fnFunction</code> from the 'sort' event of this <code>meteor-model-demo.model.MeteorListBinding</code>.<br/>
     * @param {function} fnFunction The function to call, when the event occurs.
     * @param {object} [oListener] object on which to call the given function.
     * @protected
     * @deprecated use the change event.
     */
    MeteorListBinding.prototype.detachSort = function(fnFunction, oListener) {
      this.detachEvent("sort", fnFunction, oListener);
    };

    /**
     * Fire event _sort to attached listeners.
     * @param {Map} [mArguments] the arguments to pass along with the event.
     * @private
     * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
     */
    MeteorListBinding.prototype._fireSort = function(mArguments) {
      this.fireEvent("sort", mArguments);
    };

    /**
     * Attach event-handler <code>fnFunction</code> to the 'filter' event of this <code>meteor-model-demo.model.MeteorListBinding</code>.<br/>
     * @param {function} fnFunction The function to call, when the event occurs.
     * @param {object} [oListener] object on which to call the given function.
     * @protected
     * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
     */
    MeteorListBinding.prototype.attachFilter = function(fnFunction, oListener) {
      this.attachEvent("filter", fnFunction, oListener);
    };

    /**
     * Detach event-handler <code>fnFunction</code> from the 'filter' event of this <code>meteor-model-demo.model.MeteorListBinding</code>.<br/>
     * @param {function} fnFunction The function to call, when the event occurs.
     * @param {object} [oListener] object on which to call the given function.
     * @protected
     * @deprecated use the change event.
     */
    MeteorListBinding.prototype.detachFilter = function(fnFunction, oListener) {
      this.detachEvent("filter", fnFunction, oListener);
    };

    /**
     * Fire event _filter to attached listeners.
     * @param {Map} [mArguments] the arguments to pass along with the event.
     * @private
     * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
     */
    MeteorListBinding.prototype._fireFilter = function(mArguments) {
      this.fireEvent("filter", mArguments);
    };

    /**
     * Indicates whether grouping is enabled for the binding.
     * Grouping is enabled for a list binding, if at least one sorter exists on the binding and the first sorter
     * is a grouping sorter.
     * @public
     * @returns {boolean} whether grouping is enabled
     */
    MeteorListBinding.prototype.isGrouped = function() {
      return !!(this.aSorters && this.aSorters[0] && this.aSorters[0].fnGroup);
    };

    /**
     * Gets the group for the given context.
     * Must only be called if isGrouped() returns that grouping is enabled for this binding. The grouping will be
     * performed using the first sorter (in case multiple sorters are defined).
     * @param {sap.ui.model.Context} oContext the binding context
     * @public
     * @returns {object} the group object containing a key property and optional custom properties
     * @see sap.ui.model.Sorter.getGroup
     */
    MeteorListBinding.prototype.getGroup = function(oContext) {
      return this.aSorters[0].getGroup(oContext);
    };

    /**
     * Enable extended change detection
     *
     * @param {boolean} bDetectUpdates Whether changes within the same entity should cause a delete and insert command
     * @param {function|string} vKey The path of the property containing the key or a function getting the context as only parameter to calculate a key to identify an entry
     * @private
     */
    MeteorListBinding.prototype.enableExtendedChangeDetection = function(bDetectUpdates, vKey) {
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


    return MeteorListBinding;

  });
