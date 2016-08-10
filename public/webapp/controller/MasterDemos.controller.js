sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5.controller.MasterDemos", {

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

    onExit: function(){
      this._subscription.stop();
    },

    onPressBack : function() {
      this._oRouter.navTo("home");
    },

    onGroupSelect: function(oEvent) {
      // Convenience: automatically expand groups when they are pressed
      // without requiring user to click the icon on the right
      // Get group pressed
      var oGroup = oEvent.getSource();
      oGroup.setExpanded(!oGroup.getExpanded());
    },

    onDemoSelect: function(oEvent) {
      // Get item selected
      var oDemoItem = oEvent.getSource();
      var oItem = oDemoItem.getBindingContext().getObject();

      // Get group selected (parent)
      var oDemoGroup = oDemoItem.getParent();
      var oGroup = oDemoGroup.getBindingContext().getObject();

      // Nav to demo selected
			this._oRouter.navTo("demo", {
          groupId: oGroup.groupId,
          demoId: oItem.demoId
      });
    },

    _onRoutePatternMatched: function(oEvent) {
      // Store current route name and view state model
      this._sRouteName = oEvent.mParameters.name;

      // Store which is the currently selected group and demo in our viewModel
      if (this._sRouteName === "demo"){
        var oModel = this.getView().getModel("viewState");
        var oArguments = oEvent.getParameters().arguments;
        oModel.setProperty("/groupId", oArguments.groupId);
        oModel.setProperty("/demoId", oArguments.demoId);

        // Focus on selected demo.  This is necessary if coming to this page
        // via a bookmark as the control is not shown as selected.  Unforunately
        // NavigationListItems have no active or selected state to otherwise
        // visibly highlight which demo is being displayed.  I might not have
        // used the NavigationList if I had known earlier.
        // TODO
      }
    }
  });

  return CController;

});
