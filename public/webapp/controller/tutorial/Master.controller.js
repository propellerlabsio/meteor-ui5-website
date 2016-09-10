sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/GroupHeaderListItem',
], function (Controller, JSONModel, Filter, FilterOperator, GroupHeaderListItem) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.controller.tutorial.Master", {

    onInit: function () {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

    },

    onPressBack: function () {
      window.history.back();
    },

    onStepPress: function (oEvent) {
      // Get tutorial data for selected item
      var oList = oEvent.getSource();
      var oItem = oList.getSelectedItem();
      var oItemData = oItem.getBindingContext().getObject();
      var oModel = this.getView().getModel("viewState");

      // Nav to selected step
      this._oRouter.navTo("tutorial", {
        tutorial: oItemData.tutorial,
        step: oItemData.step
      }, true);
    },

    _onRoutePatternMatched: function (oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;
      var oArguments = oEvent.getParameter("arguments");
      var oModel = this.getView().getModel("viewState");

      // Store which is the currently selected step in our viewModel
      if (this._sRouteName === "tutorial") {
        oModel.setProperty("/step", oArguments.step);
      }
    }
  });

  return CController;

});
