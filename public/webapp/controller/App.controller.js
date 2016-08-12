sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/m/MessageBox',
], function(Controller, MessageBox) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.controller.App", {

    onInit: function() {
      // Set up route handling
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
    },


    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;
    },

    handlePressHome: function(){
        this._oRouter.navTo("home")
    },

    onhandleUserItemPressed: function(){
        MessageBox.information("This feature is still under construction.");
    }

  });

  return CController;

});
