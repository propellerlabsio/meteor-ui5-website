sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5/MeteorMongoModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.demo.binding.AllOrders", {

    formatter: formatter,

    onInit: function() {
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to Employees data.  That's it!
      Meteor.subscribe('orders');

      // Bind table to all Orders
      this.byId("OrdersTable").bindItems({
        path: "/Orders",
        template: this.byId("OrdersItem").clone()
      });
    }

  });

  return CController;

});
