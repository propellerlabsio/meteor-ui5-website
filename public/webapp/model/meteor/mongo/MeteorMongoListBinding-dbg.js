/*!

 * ${copyright}
 */


// Provides an abstraction for list bindings
sap.ui.define([
  'jquery.sap.global',
  'sap/ui/model/ListBinding',
  'sap/ui/model/Filter',
  'sap/ui/model/Sorter',
  'sap/ui/model/Context'
], function(jQuery, ListBinding, Filter, Sorter, Context) {
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

      // Get query
      if (sPath.charAt(0) !== "/"){
        console.error("Binding lists to anyother other than root element (Mongo Collection) not implemented yet");
        return;
      }

    	var components = sPath.split("/");
      this._oCollection = Mongo.Collection.get(components[1]);
      this._oCursor = this._oCollection.find();
      this._oQueryHandle = this._oCursor.observeChanges({
				added: (id, fields) => {
					//TODO performance - only update data that has changed
					this.oModel.refresh();
				},

				changed: (id, fields) => {
					//TODO performance - only update data that has changed
					this.oModel.refresh();
				},

				removed: (id) => {
					//TODO performance - only update data that has changed
					this.oModel.refresh();
				}
			});
    }

  });


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
    var aContexts = [];
    this._oCursor.forEach(function(doc){
      //TODO Allow list binding for arrays
      const context = new Context(this.oModel, this.sPath + "(" + doc._id + ")");
      aContexts.push(context);
    }, this);
    return aContexts;
  };

  MeteorMongoListBinding.prototype.destroy = function(){
    // Call stop on queryHandle on destroy of meteor model per docs:
    // "observeChanges returns a live query handle, which is an object with a
    // stop method. Call stop with no arguments to stop calling the callback functions
    // and tear down the query. The query will run forever until you call this. "
    if (this._oQueryHandle){
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

  /**
   * Sorts the list according to the sorter object
   *
   * @function
   * @name meteor-ui5.MeteorMongoListBinding.prototype.sort
   * @param {sap.ui.model.Sorter|Array} aSorters the Sorter object or an array of sorters which defines the sort order
   * @return {meteor-ui5.MeteorMongoListBinding} returns <code>this</code> to facilitate method chaining
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
  MeteorMongoListBinding.prototype.getCurrentContexts = function() {
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
  MeteorMongoListBinding.prototype.getLength = function() {
    // TODO handle subscription finished/records loaded
    if (this._oCursor) {
      return this._oCursor.count();
    }
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
    // TODO handle subscription finished/records loaded
    if (this._oCursor) {
      return true;
    } else {
      return false;
    }
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
  MeteorMongoListBinding.prototype.getDistinctValues = function(sPath) {
    return null;
  };

  //Eventing and related
  /**
   * Attach event-handler <code>fnFunction</code> to the 'sort' event of this <code>meteor-ui5.MeteorMongoListBinding</code>.<br/>
   * @param {function} fnFunction The function to call, when the event occurs.
   * @param {object} [oListener] object on which to call the given function.
   * @protected
   * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
   */
  MeteorMongoListBinding.prototype.attachSort = function(fnFunction, oListener) {
    this.attachEvent("sort", fnFunction, oListener);
  };

  /**
   * Detach event-handler <code>fnFunction</code> from the 'sort' event of this <code>meteor-ui5.MeteorMongoListBinding</code>.<br/>
   * @param {function} fnFunction The function to call, when the event occurs.
   * @param {object} [oListener] object on which to call the given function.
   * @protected
   * @deprecated use the change event.
   */
  MeteorMongoListBinding.prototype.detachSort = function(fnFunction, oListener) {
    this.detachEvent("sort", fnFunction, oListener);
  };

  /**
   * Fire event _sort to attached listeners.
   * @param {Map} [mArguments] the arguments to pass along with the event.
   * @private
   * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
   */
  MeteorMongoListBinding.prototype._fireSort = function(mArguments) {
    this.fireEvent("sort", mArguments);
  };

  /**
   * Attach event-handler <code>fnFunction</code> to the 'filter' event of this <code>meteor-ui5.MeteorMongoListBinding</code>.<br/>
   * @param {function} fnFunction The function to call, when the event occurs.
   * @param {object} [oListener] object on which to call the given function.
   * @protected
   * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
   */
  MeteorMongoListBinding.prototype.attachFilter = function(fnFunction, oListener) {
    this.attachEvent("filter", fnFunction, oListener);
  };

  /**
   * Detach event-handler <code>fnFunction</code> from the 'filter' event of this <code>meteor-ui5.MeteorMongoListBinding</code>.<br/>
   * @param {function} fnFunction The function to call, when the event occurs.
   * @param {object} [oListener] object on which to call the given function.
   * @protected
   * @deprecated use the change event.
   */
  MeteorMongoListBinding.prototype.detachFilter = function(fnFunction, oListener) {
    this.detachEvent("filter", fnFunction, oListener);
  };

  /**
   * Fire event _filter to attached listeners.
   * @param {Map} [mArguments] the arguments to pass along with the event.
   * @private
   * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
   */
  MeteorMongoListBinding.prototype._fireFilter = function(mArguments) {
    this.fireEvent("filter", mArguments);
  };

  /**
   * Indicates whether grouping is enabled for the binding.
   * Grouping is enabled for a list binding, if at least one sorter exists on the binding and the first sorter
   * is a grouping sorter.
   * @public
   * @returns {boolean} whether grouping is enabled
   */
  MeteorMongoListBinding.prototype.isGrouped = function() {
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
  MeteorMongoListBinding.prototype.getGroup = function(oContext) {
    return this.aSorters[0].getGroup(oContext);
  };

  /**
   * Enable extended change detection
   *
   * @param {boolean} bDetectUpdates Whether changes within the same entity should cause a delete and insert command
   * @param {function|string} vKey The path of the property containing the key or a function getting the context as only parameter to calculate a key to identify an entry
   * @private
   */
  MeteorMongoListBinding.prototype.enableExtendedChangeDetection = function(bDetectUpdates, vKey) {
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
