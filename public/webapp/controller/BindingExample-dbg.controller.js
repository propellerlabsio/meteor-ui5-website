sap.ui.define([
  'sap/ui/core/mvc/Controller',
], function(Controller) {
  var cController = Controller.extend('meteor-ui5-demo.controller.BindingExample', {

    onInit: function() {
      // Store router reference
  	 	this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      // Subscribe to binding examples (Component model).  Should already have
      // this example if navigating her from Examples list page but not if
      // via browser bookmark.
      Meteor.subscribe('bindingExamples');
    },

		onPressBack : function() {
			this._oRouter.navTo("bindingExamples");
		}

  });

  return cController;

});
