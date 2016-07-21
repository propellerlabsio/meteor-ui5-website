		sap.ui.define([
				'sap/ui/core/mvc/Controller'
			], function(Controller) {
			"use strict";

			var CController = Controller.extend("meteor-model-demo.controller.MasterCategories", {
				onInit: function(){
					this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				},

				onPressBack : function() {
					this._oRouter.navTo("home");
				},

				onItemPress : function(oEvent) {
					var sNavTo = oEvent.getParameter("listItem").getCustomData()[0].getValue();
					this._oRouter.navTo(sNavTo);
				},

			});


			return CController;

		});
