sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/MeteorMongoModel',
  'meteor-ui5/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.demo.binding.OneOrder", {

    formatter: formatter,

    onInit: function() {
      // TODO revert to putting model instantiation outside of subscription
      // callback as soon as we've finished building MeteorMongoContextBinding
      // Subscribe to orders
      this._subscription = Meteor.subscribe('orders', () =>{

        // Create Meteor model
        var oModel = new MeteorModel();
        this.getView().setModel(oModel);
      });
    },

    onExit: function(){
      this._subscription.stop();
    }
  });

  return CController;

});
