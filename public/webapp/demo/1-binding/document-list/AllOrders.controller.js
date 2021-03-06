sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/model/Model',
  'meteor-ui5-website/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.demo.1-binding.document-list.AllOrders", {

    formatter: formatter,

    onInit: function() {
      // Create Meteor model with sizeLimit option set to 50. Since this
      // demonstration has no filters applied we want to prevent huge volumes
      // of data being sent to the front end
      var oModel = new MeteorModel(50);
      this.getView().setModel(oModel);

      // Subscribe to data.
      this._subscription = Meteor.subscribe('ordersWithCustomers');

    },

    onExit: function() {
      this._subscription.stop();
    }

  });

  return CController;

});
