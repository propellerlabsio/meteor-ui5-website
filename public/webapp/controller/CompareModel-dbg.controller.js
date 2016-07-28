sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.CompareModel", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      const viewState = this._getViewStateForRoute();
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      this._oRouter.attachRoutePatternMatched(this._onRoutePatterMatched, this);
    },

    _onRoutePatterMatched: function(oEvent) {
      // Store current route name so we can use it for tab navigation within
      // current route
      this._sRouteName = oEvent.mParameters.name;
      const oModel = this.getView().getModel("viewState");

      // Set which view and source files to display in our view state model
      const viewState = this._getViewStateForRoute(this._sRouteName);
      debugger;
      oModel.setData(viewState);
    },

    _getViewStateForRoute(sRouteName) {
      let viewState = {
        demoViewName: "",
        sourceFileView: "",
        sourceFileController: "",
        sourceFileTable: "webapp/view/EmployeesTable.fragment.xml"
      }
      switch (sRouteName) {
        case "compareMeteor":
          viewState.pageTitle = "Meteor Model";
          viewState.demoViewName = "meteor-ui5-demo.view.EmployeesMeteor";
          viewState.sourceFileView = "webapp/view/EmployeesMeteor.view.xml";
          viewState.sourceFileController = "webapp/controller/EmployeesMeteor-dbg.controller.js";
          break;
        case "compareJson":
          viewState.pageTitle = "JSON Model";
          viewState.demoViewName = "meteor-ui5-demo.view.EmployeesJson";
          viewState.sourceFileView = "webapp/view/EmployeesJson.view.xml";
          viewState.sourceFileController = "webapp/controller/EmployeesJson-dbg.controller.js";
          break;
        case "compareOData":
          viewState.pageTitle = "OData Model";
          viewState.demoViewName = "meteor-ui5-demo.view.EmployeesOData";
          viewState.sourceFileView = "webapp/view/EmployeesOData.view.xml";
          viewState.sourceFileController = "webapp/controller/EmployeesOData-dbg.controller.js";
          break;
      }
      return viewState;
    }

  });

  return CController;

});
