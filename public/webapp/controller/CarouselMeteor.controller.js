
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-model-demo/model/MeteorModel'
], function(Controller, MeteorModel) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.CarouselMeteor", {

    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oJsonData = [];
			var oModel = new MeteorModel();
			this.getView().setModel(oModel);
    }
    
  });

  return CController;

});
