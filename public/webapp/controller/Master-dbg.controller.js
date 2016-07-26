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
					// Get custom data from list item
					const aCustomData = oEvent.getParameter("listItem").getCustomData();
					let sNavTo;
					let bPreserveQueryParams;
					aCustomData.forEach((data) => {
						const value = data.getValue();
						switch (data.getKey()){
							case "to":
								sNavTo = value;
								break;
							case "preserveQueryParams":
								bPreserveQueryParams = (value === "true");
								break;
						}
					})

					// Build route query parameters if we are preserving them - ie using
					// same parameters in target route
					let params = {}
					if (bPreserveQueryParams){
						params = {
							query: this._oQueryParams
						}
					}

					// Navigate to target route
					this._oRouter.navTo(sNavTo, params);
				},

				_onRoutePatterMatched(oEvent){
					// Remember current route for later
					this._sRouteName = oEvent.mParameters.name;

					// Store route query parameters on current route in case we need to
					// preserve them on navigation to next route
					const oArgs = oEvent.getParameter("arguments");
					this._oQueryParams = oArgs["?query"];

					// Set selected item in master list if it can be determined from route
					var oList = this.byId("masterList");
					if (oList){
						var oItem = this.byId(this._sRouteName);
						if (oItem) {
							oList.setSelectedItem(oItem);
						}
					}
				}
			});

			return CController;

		});
