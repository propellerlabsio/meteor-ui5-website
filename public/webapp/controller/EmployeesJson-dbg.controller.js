sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, JSONModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.EmployeesJson", {

    formatter: formatter,

    onInit: function() {
      // Create a json model and load it with a file containing Employees
      // demo data.
      var oJsonData = [];
      var oModel = new JSONModel(oJsonData);
      this.getView().setModel(oModel);

      // Call meteor method to populate JSON model with data
      Meteor.call(
        'fixtures.getJSONfile',
        'fixtures/Employees.json',
        (error, result) => {
          oModel.setData({
            Employees: result
          });
        });
    }

  });

  return CController;

});
