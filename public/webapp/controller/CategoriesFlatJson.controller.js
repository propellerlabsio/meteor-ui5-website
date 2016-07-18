
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-model-demo/model/json/FlatJSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.CategoriesFlatJson", {

    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oJsonData = [];
			var oModel = new JSONModel(oJsonData);
			this.getView().setModel(oModel);

			// Call meteor method to populate JSON model with data
			Meteor.call(
				'fixtures.getJSONfile',
				'fixtures/Categories.json',
				(error, result) => {
					oModel.setData(
            {
              Categories: result.slice(0, 2) // TODO remove slice - debugging
            });
			});
    },

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
