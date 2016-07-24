sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5/MeteorMongoModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.EmployeesMeteor", {

    formatter: formatter,

    onInit: function() {
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to Employees data.  That's it!
      Meteor.subscribe('employees');
    },

    onViewSettingsButtonPressed: function(){
      this.byId("ViewSettingsDialog").open();

    },

    onConfirmViewSettings: function(){
        debugger;
    }

  });

  return CController;

});
