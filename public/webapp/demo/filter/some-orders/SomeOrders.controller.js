sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'meteor-ui5-mongo/model/Model',
  'meteor-ui5-website/model/formatter'
], function(Controller, Filter, FilterOperator, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.demo.filter.some-orders.SomeOrders", {

    formatter: formatter,

    onInit: function() {
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to data
      this._subscription = Meteor.subscribe('ordersWithCustomers');

      // Create filter for customer = HANAR
      const oCustomerFilter = new Filter({
        path: 'CustomerID',
        operator: FilterOperator.EQ,
        value1: 'VINET'
      })

      // Create filter for country = Brazil
      const oCountryFilter = new Filter({
        path: 'ShipCountry',
        operator: FilterOperator.EQ,
        value1: 'France'
      })

      // Bind table to some orders via filters
      this.byId("OrdersTable").bindItems({
        path: "/Orders",
        template: this.byId("OrdersItem").clone(),
        filters: [oCustomerFilter, oCountryFilter]
      });

      // Update filter label and show/hide filter bar
      this.byId("OrdersFilterLabel").setText("Filtered by: Customer (VINET), Country (France)");
      this.byId("OrdersFilterBar").setVisible(true);
    },

    onExit: function() {
      this._subscription.stop();
    }

  });

  return CController;

});
