
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'jquery.sap.global'
], function(Controller, jQuery) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.ModelDebugController", {

    onDebugPress: function() {
      var oModel = this.getView().getModel();
      var aOutput = [];
      oModel.aBindings.forEach((oBinding) => {
        var oOutput = {};
        oOutput.bRelative = oBinding.bRelative;
        oOutput.sPath = oBinding.sPath;
        if (oBinding.oContext) {
          oOutput['oContext.sPath'] = oBinding.oContext.sPath;
        }
        aOutput.push(oOutput);
      });

      console.table(oModel.aBindings);
      console.table(aOutput);
      debugger;
    }
  });

  return CController;

});
