		sap.ui.define([
				'sap/ui/core/mvc/Controller'
			], function(Controller) {
			"use strict";

			var CController = Controller.extend("meteor-model-demo.controller.MasterCompare", {

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
					var oList = this.byId("masterCompareList");
					switch (oEvent.mParameters.name){
						case "compareMeteor":
						case "compareJson":
						case "compareOData":
						case "compareFlatJson":
							var oItem = this.byId(oEvent.mParameters.name);
							oList.setSelectedItem(oItem);
							break;
					}


				}

			});


			return CController;

		});
