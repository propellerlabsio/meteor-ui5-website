sap.ui.define([
  'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CompareModels", {

    onInit: function() {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      var oViewModel = new JSONModel({
		    // meteorRelease: Meteor.release.split('@')[1],
		    // ui5Version: sap.ui.version,
      });
      this.getView().setModel(oViewModel, "viewModel");

			this._oRouter.attachRoutePatternMatched(this._onRoutePatterMatched, this);
    },

    onTabSelect : function (oEvent){
			this._oRouter.navTo(this._sRouteName, {
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		},

		_onRoutePatterMatched(oEvent){
      // Store current route name so we can use it for tab navigation within
      // current route
      this._sRouteName = oEvent.mParameters.name;

			// Set current tab if it doesn't agree with tab query parameter
			const oArgs = oEvent.getParameter("arguments");
			const oQueryParams = oArgs["?query"];
      if (oQueryParams && oQueryParams.tab){
        const oIconTabBar = this.byId("tabsCompare");
        if (oIconTabBar.getSelectedKey() !== oQueryParams){
          oIconTabBar.setSelectedKey(oQueryParams.tab);
        }
      }
    }

  });

  return CController;

});
