sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/model/Model',
  'webapp/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("webapp.demo.binding.one-order.OneOrder", {

    formatter: formatter,

    onInit: function() {

      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

      // Subscribe to orders
      this._subscription = Meteor.subscribe('ordersWithCustomers');
    },

    onExit: function(){
      this._subscription.stop();
    }
  });

  return CController;

});
