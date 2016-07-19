
sap.ui.define([
  'meteor-model-demo/controller/ModelDebugController',
  'sap/ui/model/odata/ODataModel'
], function(Controller, ODataModel) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.CategoriesOData", {

    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oModel = new ODataModel('http://services.odata.org/V2/Northwind/Northwind.svc/');
			this.getView().setModel(oModel);
    }

  });

  return CController;

});
