
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-demo/model/json/FlatJSONModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, JSONModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CompareFlatJson", {

    formatter: formatter,

    onInit: function() {
			// Set up json model for categories - will be populated asynchronously so
      // view can render while data is being loaded from file fetched via meteor
      // call.  This example uses a special modified copy of the standard sap
      // json model.  Our version has been 'flattened' to remove some of the
      // class hierarchy to make it easier to debug during development of our
      // Meteor model (for comparison purposes). It is intended that the flat
      // json model and this view will be removed.
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
            });
			});
    }

  });

  return CController;

});
