sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  var cController = Controller.extend('meteor-ui5-demo.controller.TempDebugJSON', {

    onInit: function() {

      // Subscribe to binding examples (Component model)
      var oJsonData = [];
      var oModel = new JSONModel(oJsonData);
      this.getView().setModel(oModel);

      // Call meteor method to populate JSON model with data
      Meteor.call(
        'fixtures.getJSONfile',
        'fixtures/Orders.json',
        (error, result) => {
          debugger;
          oModel.setData({
            Orders: result
          });
        });
    }

  });

  return cController;

});
