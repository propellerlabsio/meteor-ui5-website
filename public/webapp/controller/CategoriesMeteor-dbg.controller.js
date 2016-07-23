sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-demo/model/meteor/mongo/MeteorMongoModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CategoriesMeteor", {

    formatter: formatter,
    
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
