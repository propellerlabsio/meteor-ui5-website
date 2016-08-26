sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/GroupHeaderListItem',
], function(Controller, JSONModel, Filter, FilterOperator, GroupHeaderListItem) {
  "use strict";

  var CController = Controller.extend("webapp.controller.tutorial.Master", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

      // Subscribe to all tutorials TODO test bookmarked link to tutorial page
      this._subscription = Meteor.subscribe("tutorials");
    },

    onExit: function() {
      this._subscription.stop();
    },

    onPressBack: function() {
      this._oRouter.navTo("home");
    },

		onFixedItemPress: function(oEvent) {
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

  onStepPress: function(oEvent) {
      // Get tutorial data for selected item
      var oList = oEvent.getSource();
      var oItem = oList.getSelectedItem();
      var oItemData = oItem.getBindingContext().getObject();
      var oModel = this.getView().getModel("viewState");

      // Nav to demo selected, preserving query parameters
      this._oRouter.navTo("tutorialStep", {
        tutorial: oItemData.tutorial,
        step: oItemData.step
      });
    },

    _onRoutePatternMatched: function(oEvent) {
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
