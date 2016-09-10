sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function (Controller) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.controller.Master", {

    onInit: function () {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRoutePatternMatched(this._onRoutePatterMatched, this);
    },

    onPressBack: function () {
      window.history.back();
    },

    onItemPress: function (oEvent) {
      // Get custom data from list item
      const aCustomData = oEvent.getParameter("listItem").getCustomData();
      let sNavTo;
      aCustomData.forEach((data) => {
        const value = data.getValue();
        switch (data.getKey()) {
          case "to":
            sNavTo = value;
            break;
        }
      })

      // Navigate to target route
      if (sNavTo === 'tutorial') {
        this._oRouter.navTo(sNavTo, {
          tutorial: 'mongo',
          step: '00'
        });

      } else {
        this._oRouter.navTo(sNavTo);
      }
    },

    _onRoutePatterMatched(oEvent) {
      // Remember current route for later
      this._sRouteName = oEvent.mParameters.name;

      // Set selected item in master list if it can be determined from route
      var oList = this.byId("masterList");
      if (oList) {
        var oItem = this.byId(this._sRouteName);
        if (oItem) {
          oList.setSelectedItem(oItem);
        }
      }
    }
  });

  return CController;

});
