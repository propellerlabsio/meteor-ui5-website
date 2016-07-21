sap.ui.define([
  'meteor-model-demo/controller/ModelDebugController',
  'meteor-model-demo/model/meteor/mongo/MeteorMongoModel'
], function(Controller, MeteorModel) {
  "use strict";

  var CController = Controller.extend("meteor-model-demo.controller.CategoriesMeteor", {

    onInit: function() {
      Meteor.subscribe('categories', this._onSubscriptionStop, this._onSubscriptionReady);
    },

    _onSubscriptionReady: function() {
      var oModel = sap.ui.getCore().getComponent("meteor-model-demo").getModel();
      oModel.refresh();
    },

    _onSubscriptionStop: function(oError) {
      // TODO add error handling
      debugger;
    }
  });

  return CController;

});
