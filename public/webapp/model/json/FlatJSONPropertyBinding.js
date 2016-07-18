/*!
 * ${copyright}
 */

// Provides the JSON model implementation of a property binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/PropertyBinding', 'sap/ui/model/ChangeReason'],
  function(jQuery, ChangeReason, PropertyBinding) {
    "use strict";


    /**
     *
     * @class
     * Property binding implementation for JSON format
     *
     * @param {sap.ui.model.json.JSONModel} oModel
     * @param {string} sPath
     * @param {sap.ui.model.Context} oContext
     * @param {object} [mParameters]
     * @alias meteor-model-demo.model.FlatJSONPropertyBinding
     * @extends sap.ui.model.PropertyBinding
     */
    var FlatJSONPropertyBinding = PropertyBinding.extend("meteor-model-demo.model.FlatJSONPropertyBinding", {


      constructor: function(oModel, sPath, oContext, mParameters) {
        PropertyBinding.apply(this, arguments);
        this.oValue = this._getValue();
      }

    });



    /**
     * @see sap.ui.model.PropertyBinding.prototype.getValue
     */
    FlatJSONPropertyBinding.prototype.getValue = function() {
      return this.oValue;
    };

    /**
     * Returns the current value of the bound target (incl. re-evaluation)
     * @return {object} the current value of the bound target
     */
    FlatJSONPropertyBinding.prototype._getValue = function() {
      var sProperty = this.sPath.substr(this.sPath.lastIndexOf("/") + 1);
      if (sProperty == "__name__") {
        var aPath = this.oContext.split("/");
        return aPath[aPath.length - 1];
      }
      return this.oModel.getProperty(this.sPath, this.oContext); // ensure to survive also not set model object
    };


    /**
     * Setter for context
     */
    FlatJSONPropertyBinding.prototype.setContext = function(oContext) {
      if (this.oContext != oContext) {
        sap.ui.getCore().getMessageManager().removeMessages(this.getDataState().getControlMessages(), true);
        this.oContext = oContext;
        if (this.isRelative()) {
          this.checkUpdate();
        }
      }
    };

    /**
     * @see sap.ui.model.PropertyBinding.prototype.setValue
     */
    FlatJSONPropertyBinding.prototype.setValue = function(oValue) {
      if (this.bSuspended) {
        return;
      }
      if (!jQuery.sap.equal(this.oValue, oValue)) {
        if (this.oModel.setProperty(this.sPath, oValue, this.oContext, true)) {
          this.oValue = oValue;
          this.getDataState().setValue(this.oValue);
          this.oModel.firePropertyChange({
            reason: ChangeReason.Binding,
            path: this.sPath,
            context: this.oContext,
            value: oValue
          });
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
    FlatJSONPropertyBinding.prototype.checkUpdate = function(bForceupdate) {
      if (this.bSuspended && !bForceupdate) {
        return;
      }

      var oValue = this._getValue();
      if (!jQuery.sap.equal(oValue, this.oValue) || bForceupdate) { // optimize for not firing the events when unneeded
        this.oValue = oValue;
        this.getDataState().setValue(this.oValue);
        this.checkDataState();
        this._fireChange({
          reason: ChangeReason.Change
        });
      }
    };

    return FlatJSONPropertyBinding;

  });
