		sap.ui.define([
				'sap/ui/core/mvc/Controller'
			], function(Controller) {
			"use strict";

			var CController = Controller.extend("meteor-ui5-demo.controller.Master", {

				onInit: function(){
					this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					this._oRouter.attachRoutePatternMatched(this._onRoutePatterMatched, this);
				},

				onPressBack : function() {
					this._oRouter.navTo("home");
				},

				onItemPress : function(oEvent) {
					var sNavTo = oEvent.getParameter("listItem").getCustomData()[0].getValue();
					this._oRouter.navTo(sNavTo);
				},

				_onRoutePatterMatched(oEvent){
					var sRouteName = oEvent.mParameters.name;
					var oList = this.byId("masterList");
					if (oList){
						var oItem = this.byId(sRouteName);
						if (oItem) {
							oList.setSelectedItem(oItem);
						}
					}
				}

			});


			return CController;

		});
