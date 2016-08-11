sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/Fragment',
  'sap/m/MessageToast',
  'sap/ui/model/json/JSONModel'
], function(Controller, Fragment, MessageToast, JSONModel) {
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
    },
    onhandleUserItemPressed: function() {
      MessageToast.show("Users temp to press");
    },
    onhandlePressConfiguration: function(oEvent) {
      // MessageToast.show("Text HeaderItem");
			var oItem = oEvent.getSource();
			var oShell = this.getView().byId("myShell");
			var bState = oShell.getShowPane();
			oShell.setShowPane(!bState);
			oItem.setShowMarker(!bState);
			oItem.setSelected(!bState);
    }


  });

  return CController;

});
