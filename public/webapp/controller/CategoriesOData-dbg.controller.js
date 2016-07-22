
sap.ui.define([
  'meteor-ui5-demo/controller/ModelBaseController',
  'sap/ui/model/odata/ODataModel'
], function(Controller, ODataModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesOData", {

    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oModel = new ODataModel('/oDataProxy');
			this.getView().setModel(oModel);
    }

  });

  return CController;

});
