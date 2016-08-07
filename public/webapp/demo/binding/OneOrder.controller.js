sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/MeteorMongoModel',
  'meteor-ui5/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.demo.binding.OneOrder", {

    formatter: formatter,

    onInit: function() {

      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to orders
      this._subscription = Meteor.subscribe('orders',() =>{
        const sPath = "/Orders(10248)/CustomerID";
        const sCompanyName = oModel.getProperty(sPath);
        debugger;
      });
    },

    onExit: function(){
      this._subscription.stop();
    }
  });

  return CController;

});
