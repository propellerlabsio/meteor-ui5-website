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

      // Subscribe to Demos for getting content of selected demo
      this._subscription = Meteor.subscribe("tutorials", this._loadStepForCurrentRoute.bind(this));
    },

    onExit: function(){
      this._subscription.stop();
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

      // Set which view and source files to display in our view state model
      if (this._sRouteName === "tutorialStep"){
        var oArguments = oEvent.getParameters().arguments;
        this._sTutorial = oArguments.tutorial;
        this._sStep = oArguments.step;
        this._loadStepForCurrentRoute();
      }
    },

    _loadStepForCurrentRoute() {
      // Only cotinue if we have parameters from route already (subscription
      // may have finished before _onRoutePatterMatched.)
      if (!this._sTutorial || !this._sStep){
        // Route may not have been called. Try again later
        return;
      }

      // Get tutorial step
      var oStep = Mongo.Collection.get("Tutorials").findOne({
        tutorial: this._sTutorial,
        step: this._sStep
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
