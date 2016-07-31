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

      // Since this demonstration has no filters applied, set the standard UI5
      // model sizeLimit property to prevent huge volumes of data being sent to
      // to the front end
      oModel.setSizeLimit(100)

      // Subscribe to data.
      this._subscription = Meteor.subscribe('orders');

      // Bind table to all Orders
      this.byId("OrdersTable").bindItems({
        path: "/Orders",
        template: this.byId("OrdersItem").clone()
      });
    },

    onExit: function(){
      this._subscription.stop();
    }

  });

  return CController;

});
