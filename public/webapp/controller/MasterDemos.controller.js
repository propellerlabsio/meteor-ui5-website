sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/GroupHeaderListItem',
], function(Controller, JSONModel, Filter, FilterOperator, GroupHeaderListItem) {
  "use strict";

  var CController = Controller.extend("webapp.controller.MasterDemos", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

      // Subscribe to all demos TODO test bookmarked link to demo page
      this._subscription = Meteor.subscribe("demos"); // , this._loadDemoForCurrentRoute.bind(this));
    },

    onExit: function() {
      this._subscription.stop();
    },

    onPressBack: function() {
      this._oRouter.navTo("home");
    },

    getGroupHeader: function(oGroup) {
      var oGroupData = Mongo.Collection.get("DemoGroups").findOne(oGroup.key);
      return new GroupHeaderListItem({
        title: oGroupData.title,
        upperCase: false
      });
    },

    onDemoSelect: function(oEvent) {
      // Get demo data for selected item
      var oList = oEvent.getSource();
      var oDemoItem = oList.getSelectedItem();
      var oItemData = oDemoItem.getBindingContext().getObject();

      // Nav to demo selected
      this._oRouter.navTo("demo", {
        groupId: oItemData.groupId,
        demoId: oItemData._id
      });
    },

    onSearch: function(oEvent) {
      // Get list binding
      var oList = this.byId("demosList");
      var oBinding = oList.getBinding("items");

      // Build filter with search term
      var oSearchField = oEvent.getSource();
      if (oSearchField){
        var oFilter = new Filter({
          path: 'title',
          operator: FilterOperator.Contains,
          value1: oSearchField.getValue()
        });

        // Apply filter to list binding
        oBinding.filter(oFilter);
      } else {
        // Clear filter
        oBinding.filter();
      }

    },

    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;

      // Store which is the currently selected demo in our viewModel
      if (this._sRouteName === "demo") {
        var oModel = this.getView().getModel("viewState");
        var oArguments = oEvent.getParameters().arguments;
        oModel.setProperty("/demoId", oArguments.demoId);
      }
    }
  });

  return CController;

});
