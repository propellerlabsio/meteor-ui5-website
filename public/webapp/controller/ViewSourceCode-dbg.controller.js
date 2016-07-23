sap.ui.define([
  'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.ViewSourceCode", {

    onInit: function() {

      var oViewModel = new JSONModel({
		    // meteorRelease: Meteor.release.split('@')[1],
		    // ui5Version: sap.ui.version,
      });
      this.getView().setModel(oViewModel, "viewModel");
    },

		onPressBack : function() {
			this._oRouter.navTo("home");
		}

  });


  return CController;

});
