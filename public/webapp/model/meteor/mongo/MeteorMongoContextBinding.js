// Provides an abstraction for list bindings
sap.ui.define(['sap/ui/model/ContextBinding'],
  function(ContextBinding) {
    "use strict";

    /**
     * Constructor for MeteorMongoContextBinding
     *
     * @class
     * The ContextBinding is a specific binding for a setting context for the model
     *
     * @param {sap.ui.model.Model} oModel
     * @param {String} sPath
     * @param {Object} oContext
     * @param {Object} [mParameters]
     * @abstract
     * @public
     * @alias meteor-ui5-mongo.MeteorMongoContextBinding
     * @extends sap.ui.model.ContextBinding
     */
    var MeteorMongoContextBinding = ContextBinding.extend("meteor-ui5-mongo.MeteorMongoContextBinding", /** @lends meteor-ui5-mongo.MeteorMongoContextBinding.prototype */ {

      constructor: function(oModel, sPath, oContext, mParameters, oEvents) {
        ContextBinding.call(this, oModel, sPath, oContext, mParameters, oEvents);
        var that = this;
        oModel.createBindingContext(sPath, oContext, mParameters, function(oContext) {
          that.bInitial = false;
          that.oElementContext = oContext;
        });
      }
    });

    /**
     * @see sap.ui.model.ContextBinding.prototype.refresh
     */
    MeteorMongoContextBinding.prototype.refresh = function(bForceUpdate) {
      var that = this;
      //recreate Context: force update
      this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
        if (that.oElementContext === oContext && !bForceUpdate) {
          that.oModel.checkUpdate(true, oContext);
        } else {
          that.oElementContext = oContext;
          that._fireChange();
        }
      }, true);
    };

    /**
     * @see sap.ui.model.ContextBinding.prototype.refresh
     */
    MeteorMongoContextBinding.prototype.initialize = function() {
      var that = this;
      //recreate Context: force update
      this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
        that.oElementContext = oContext;
        that._fireChange();
      }, true);
    };

    /**
     * @see sap.ui.model.ContextBinding.prototype.setContext
     */
    MeteorMongoContextBinding.prototype.setContext = function(oContext) {
      var that = this;
      if (this.oContext != oContext) {
        this.oContext = oContext;
        this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
          that.oElementContext = oContext;
          that._fireChange();
        });
      }
    };

    return MeteorMongoContextBinding;

  });
