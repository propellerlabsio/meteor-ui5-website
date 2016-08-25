sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function(Controller) {
  "use strict";

  var CController = Controller.extend("webapp.controller.MasterTutorial", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
    },

    onPressBack: function() {
      this._oRouter.navTo("home");
    },

    onItemPress: function(oEvent) {
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
      this._oRouter.navTo(sNavTo);
    },

    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;
    }
  });

  return CController;

});
