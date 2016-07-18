
sap.ui.define([
  'meteor-model-demo/controller/ModelDebugController',
  'meteor-model-demo/model/meteor/mongo/MeteorMongoModel'
], function(Controller, MeteorModel) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.CategoriesMeteor", {

    onInit: function() {
			// Set up json model for categories - will be populated asynchrnously later
			var oJsonData = [];
			var oModel = new MeteorModel();
			this.getView().setModel(oModel);
    }
  });

  return CController;

});
