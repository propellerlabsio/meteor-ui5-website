
sap.ui.define([
  'meteor-model-demo/controller/ModelBaseController',
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
              Categories: result
              // Categories: result.slice(0, 2) // TODO remove slice - debugging
            });
			});
    }

  });

  return CController;

});
