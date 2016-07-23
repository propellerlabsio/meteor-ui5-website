
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/odata/ODataModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, ODataModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesOData", {

    formatter: formatter,
    
    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oModel = new ODataModel('/oDataProxy');
			this.getView().setModel(oModel);
    }

  });

  return CController;

});
