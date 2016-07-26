sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5/MeteorMongoModel',
], function(Controller, MeteorModel) {
  var cController = Controller.extend('meteor-ui5-demo.controller.BindingExamples', {

    onInit: function() {
      // Store router reference
  	 	this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Subscribe to binding examples (Component model)
      Meteor.subscribe('bindingExamples');
    },

    onListItemPress: function(oEvent) {
      const oItem = oEvent.getSource();
			const aCustomData = oItem.getCustomData();
			let sExampleId = aCustomData[0].getValue();
			this._oRouter.navTo("bindingExample", {
        id: sExampleId
      });
    }

  });

  return cController;

});
