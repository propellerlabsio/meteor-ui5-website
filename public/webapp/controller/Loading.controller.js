		sap.ui.define([
		  'sap/ui/core/mvc/Controller',
		], function(Controller) {
		  "use strict";

		  var CController = Controller.extend("meteor-model-demo.controller.Loading", {
		    onInit: function() {
		      // TODO move subscriptions into oModel
		      // Subscribe to all collections we will use
		      Meteor.subscribe('categories', this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('customers', this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('employees'), this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('orderDetails'), this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('orders'), this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('products'), this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('shippers'), this._onSubscriptionStop, this._onSubscriptionReady);
		      // Meteor.subscribe('suppliers'), this._onSubscriptionStop, this._onSubscriptionReady);
		    },

		    _onSubscriptionReady: function(x, y, z) {
		      // TODO Handle multiple subs ready before navigating ('this' has
					// reference to subscription)
					const oComponent = sap.ui.getCore().getComponent("meteor-model-demo");
					const oRouter = oComponent.getRouter();
					oRouter.navTo("home");
		    },

		    _onSubscriptionStop: function(oError) {
					// TODO add error handling
		      debugger;
		    }
		  });

		  return CController;

		});
