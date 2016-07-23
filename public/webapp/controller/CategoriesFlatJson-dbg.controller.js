
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-demo/model/json/FlatJSONModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, JSONModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesFlatJson", {

    formatter: formatter,
    
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
