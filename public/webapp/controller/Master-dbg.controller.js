		sap.ui.define([
				'sap/ui/core/mvc/Controller'
			], function(Controller) {
			"use strict";

			var CController = Controller.extend("meteor-ui5-demo.controller.Master", {

				onMasterLevel1ItemPress : function(oEvent) {
					var sNavTo = oEvent.getParameter("listItem").getCustomData()[0].getValue();
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo(sNavTo);
				},

			});


			return CController;

		});
