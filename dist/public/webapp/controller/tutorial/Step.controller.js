sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("webapp.controller.tutorial.Step", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

    },

    onPressShowSourceOnGithub: function(){
      var stepData = this.getView().getModel("viewState").getProperty("/");
      var url = "https://github.com/propellerlabsio/meteor-ui5-mongo-tutorial/tree/" +
        stepData.step + "-" + stepData.title;
      var win = window.open(url, '_blank');
      win.focus();
    },

    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;
      if (this._sRouteName !== "tutorial"){
        return;
      }

      // Set which view and source files to display in our view state model
      var oArguments = oEvent.getParameters().arguments;
      this._loadStepForCurrentRoute(oArguments.tutorial, oArguments.step);
    },

    _loadStepForCurrentRoute(sTutorial, sStep) {
      // Get tutorial step
      var oStep = Mongo.Collection.get("Tutorials").findOne({
        tutorial: sTutorial,
        step: sStep
      });
      if (!oStep){
        // Subscription may not be ready, try again later
        return;
      }

      // Store in view model for view property binding
      const oModel = this.getView().getModel("viewState");
      oModel.setProperty("/", oStep);
    }

  });

  return CController;

});
