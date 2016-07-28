sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5/MeteorMongoModel',
  'sap/ui/model/json/JSONModel'
], function(Controller, MeteorModel, JSONModel) {
  var cController = Controller.extend('meteor-ui5-demo.controller.BindingExamples', {

    onInit: function() {
      // Store router reference
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Create local JSON model for view state
      const viewState = {
        expandedPanelId: ""
      }
      const oViewModel = new JSONModel(viewState);
      this.getView().setModel(oViewModel, "viewState");

      // Subscribe to binding examples (Component model)
      Meteor.subscribe('bindingExamples');
      Meteor.subscribe('orders');
    },

    onExampleExpand: function(oEvent) {
      const oModel = this.getView().getModel("viewState");
      const oPanel = oEvent.getSource();

      // This event gets called even for panels that are being collapsed
      // programmatically - we don't want to process these so return
      if (!oPanel.getExpanded()){
        return;
      };

      // Collapse previously expanded panel
      const sPreviouslyExpandedId = oModel.getProperty("/expandedId");
      if (sPreviouslyExpandedId){
        const oPreviousPanel = this.byId(sPreviouslyExpandedId);
        oPreviousPanel.setExpanded(false);
      }

      // Store the id of the currently expanded item in our view state model
      oModel.setProperty("/expandedId", oPanel.sId);

      // If  example code and output has not been set up yet,
      // do it now.
      const oExample = oPanel.getBindingContext().getObject();
      const oBindingFunction = this[oExample.bindingFunction].bind(this);
      oBindingFunction();
    },

    bindOrdersTableToAllOrders: function(){
      const oTable = this.byId("OrdersTable");
      // oTable.bindItems("/Orders");
    },

    bindOrdersTableToSomeOrders: function(){
      debugger;

    },

    bindOrdersFormToOneOrder: function(){
      debugger;
    },

    functionSourceCode: function(sFunctionName){
      debugger;
      const oFunction = this[sFunctionName];
      return oFunction.toString();
    }

  });

  return cController;

});
