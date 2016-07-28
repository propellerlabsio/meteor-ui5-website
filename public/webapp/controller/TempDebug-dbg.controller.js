sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5/MeteorMongoModel'
], function(Controller, MeteorModel) {
  var cController = Controller.extend('meteor-ui5-demo.controller.TempDebug', {

    onInit: function() {
      // Subscribe to binding examples (Component model)
      Meteor.subscribe('orders');
    },

  });

  return cController;

});
