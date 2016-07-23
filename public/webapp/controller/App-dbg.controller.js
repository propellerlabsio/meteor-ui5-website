sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/m/Button'
], function(Controller, Button) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.App", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
    },

    onDebugPress: function(oEvent) {
      var oModel = oEvent.getSource().getEventingParent().getModel();
      var aOutput = [];
      oModel.aBindings.forEach((oBinding) => {
        var oOutput = {};
        oOutput.bRelative = oBinding.bRelative;
        oOutput.sPath = oBinding.sPath;
        if (oBinding.oContext) {
          oOutput['oContext.sPath'] = oBinding.oContext.sPath;
        }
        aOutput.push(oOutput);
      });

      console.table(oModel.aBindings);
      console.table(aOutput);
      debugger;
    },

    onShowSourceCodePress: function(oEvent) {
      // var oModel = oEvent.getSource().getEventingParent().getModel();
      // var aOutput = [];
      // oModel.aBindings.forEach((oBinding) => {
      //   var oOutput = {};
      //   oOutput.bRelative = oBinding.bRelative;
      //   oOutput.sPath = oBinding.sPath;
      //   if (oBinding.oContext) {
      //     oOutput['oContext.sPath'] = oBinding.oContext.sPath;
      //   }
      //   aOutput.push(oOutput);
      // });
      //
      // console.table(oModel.aBindings);
      // console.table(aOutput);
      // debugger;
    },

    _getCurrentDetailPage: function() {
      var oSplitApp = this.byId("SplitApp");
      var oDetailPageView = oSplitApp.getCurrentDetailPage();
      var oDetailPage = oDetailPageView.getContent()[0];
      return oDetailPage;
    },

    _onRoutePatternMatched: function(oEvent) {
      var sRouteName = oEvent.mParameters.name;
      switch (sRouteName) {
        case "compareMeteor":
        case "compareJson":
        case "compareOData":
        case "compareFlatJson":
          // Programmatically add demo code buttons to current detail page title.
          // Don't want to do this in the XML template because the user will
          // see that template code and these buttons have nothing to do with
          // the working of the example which we want to keep clean and simple.
          var oDetailPage = this._getCurrentDetailPage();
          if (!oDetailPage.getHeaderContent().length){
            var oDebugButton = new Button({
              icon: "sap-icon://it-system",
              tooltip: "Show debug info in javascript console",
              press: this.onDebugPress
            })
            oDetailPage.addHeaderContent(oDebugButton);
            var oShowCodeButton = new Button({
              icon: "sap-icon://source-code",
              tooltip: "Show source code",
              press: this.onShowSourceCodePress
            })
            oDetailPage.addHeaderContent(oShowCodeButton);
          }

          break;
      }
    }
  });

  return CController;

});
