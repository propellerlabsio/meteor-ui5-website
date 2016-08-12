sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.controller.Home", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      var oViewModel = new JSONModel({
        meteorRelease: Meteor.release.split('@')[1],
        ui5Version: sap.ui.version,
      });
      this.getView().setModel(oViewModel, "viewModel");
    },

    onPressGotoUi5: function() {
      var win = window.open('http://openui5.org/', '_blank');
      win.focus();
    },

    onPressGotoMeteor: function() {
      var win = window.open('https://www.meteor.com/', '_blank');
      win.focus();

    },

    onTiledemosPress: function(oEvent) {
      // Navigate to target route
      this._oRouter.navTo("demos");
    },
    onTiletutorialPress: function(oEvent) {
      // Navigate to target route
      this._oRouter.navTo("tutorial");
    },
    onTiledocsPress: function(oEvent) {
      // Navigate to target route
      this._oRouter.navTo("docs");
    },
    onTilerepositoryPress: function(oEvent) {
      // Navigate to target route
      this._oRouter.navTo("repository");
    }
  
  });

  return CController;

});
