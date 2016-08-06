sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.controller.Demo", {

    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Set up local model for view state
      const viewState = {Demo: {}};
      var oViewStateModel = new JSONModel(viewState);
      this.getView().setModel(oViewStateModel, "viewState");

      // Set up route handling
      this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);

      // Subscribe to Demos for getting content of selected demo
      this._subscription = Meteor.subscribe("demos", this._loadDemoForCurrentRoute.bind(this));
    },

    onExit: function(){
      this._subscription.stop();
    },
    
    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;

      // Set which view and source files to display in our view state model
      this._loadDemoForCurrentRoute();
    },

    _loadDemoForCurrentRoute() {

      // If route known, load
      if (this._sRouteName){
        const oModel = this.getView().getModel("viewState");
        const oDemo = Mongo.Collection.get("Demos").findOne({routeName: this._sRouteName});
        oModel.setProperty("/Demo", oDemo);
      }
    }

  });

  return CController;

});
