sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/m/GroupHeaderListItem',
], function(Controller, JSONModel, Filter, FilterOperator, GroupHeaderListItem) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.controller.demos.Master", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

    },

    onPressBack: function() {
      window.history.back();
    },

    getGroupHeader: function(oGroup) {
      var oGroupData = Mongo.Collection.get("DemoGroups").findOne(oGroup.key);
      return new GroupHeaderListItem({
        title: oGroupData.title,
        upperCase: false
      });
    },

    onClearFilterPress: function(){
        // Nav to same route, with same parameters but no filter applied
      var oModel = this.getView().getModel("viewState");
      this._oRouter.navTo(this._sRouteName, {
        groupId: oModel.getProperty("/groupId"),
        demoId: oModel.getProperty("/demoId"),
      });
    },

    onDemoSelect: function(oEvent) {
      // Get demo data for selected item
      var oList = oEvent.getSource();
      var oDemoItem = oList.getSelectedItem();
      var oItemData = oDemoItem.getBindingContext().getObject();
      var oModel = this.getView().getModel("viewState");

      // Nav to demo selected, preserving query parameters
      // TODO adjust route replace to be conditional when adding phone support
      this._oRouter.navTo("demo", {
        groupId: oItemData.groupId,
        demoId: oItemData._id,
        "query": oModel.getProperty("/query")
      }, true);
    },

    onFilterSelected: function(oEvent){
        var oItemSelected = oEvent.getParameters().item;
        var sGroupId = oItemSelected.getBindingContext().getObject()._id;
        var oModel = this.getView().getModel("viewState");

        this._oRouter.navTo(this._sRouteName, {
          "groupId": oModel.getProperty("/groupId"),
          "demoId": oModel.getProperty("/demoId"),
          "query": {
            "groupId": sGroupId
          }
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
      var oArguments = oEvent.getParameter("arguments");
      var oModel = this.getView().getModel("viewState");

      // Store which is the currently selected demo in our viewModel
      if (this._sRouteName === "demo") {
        oModel.setProperty("/groupId", oArguments.groupId);
        oModel.setProperty("/demoId", oArguments.demoId);
      }

      // Handle filtering of demos list based on optional query parameter
      if (this._sRouteName === "demo" || this._sRouteName === "demos") {
        var oQuery = oArguments["?query"];
        oModel.setProperty("/query", oQuery);
        var aFilters = [];
        if (oQuery && oQuery.groupId) {
          aFilters.push(new Filter({
            path: "groupId",
            operator: FilterOperator.EQ,
            value1: oQuery.groupId
          }));
        }
        this.byId("demosList").getBinding("items").filter(aFilters);
      }
    }
  });

  return CController;

});
