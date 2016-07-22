sap.ui.define([
  'meteor-ui5-demo/controller/ModelBaseController',
  'meteor-ui5-demo/model/meteor/mongo/MeteorMongoModel'
], function(Controller, MeteorModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesMeteor", {

    onInit: function() {
      Meteor.subscribe('categories', this._onSubscriptionStop, this._onSubscriptionReady);
    },

    _onSubscriptionReady: function() {
      var oModel = sap.ui.getCore().getComponent("meteor-ui5-demo").getModel();
      oModel.refresh();
    },

    _onSubscriptionStop: function(oError) {
      // TODO add error handling
      debugger;
    }
  });

  return CController;

});
