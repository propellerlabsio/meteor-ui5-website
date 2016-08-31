sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/model/Model',
  'webapp/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("webapp.demo.binding.property-lookup.PropertyLookup", {

    formatter: formatter,

    onInit: function() {

      // Subscribe to orders
      this._subscription = Meteor.subscribe('ordersWithCustomers');
      
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);

    },

    onExit: function(){
      this._subscription.stop();
    }
  });

  return CController;

});
