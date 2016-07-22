
sap.ui.define([
  'meteor-ui5-demo/controller/ModelBaseController',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesJson", {

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
