sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'meteor-ui5/MeteorMongoModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, Filter, FilterOperator, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.demo.binding.SomeOrders", {

    formatter: formatter,

    onInit: function() {
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to Employees data.  That's it!
      Meteor.subscribe('orders');

      // Create filter for customer = HANAR
      const oCustomerFilter = new Filter({
        path: 'CustomerID',
        operator: FilterOperator.EQ,
        value1: 'HANAR'
      })

      // Bind table to some orders
      this.byId("OrdersTable").bindItems({
        path: "/Orders",
        template: this.byId("OrdersItem").clone(),
        filters: [oCustomerFilter]
      });
    }

  });

  return CController;

});
