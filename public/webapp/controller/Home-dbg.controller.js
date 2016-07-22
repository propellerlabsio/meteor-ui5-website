sap.ui.define([
  'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.Home", {

    onInit: function() {

      var oViewModel = new JSONModel({
		    meteorRelease: Meteor.release.split('@')[1],
		    ui5Version: sap.ui.version,
      });
      this.getView().setModel(oViewModel, "viewModel");
    },

    onPressGotoUi5: function() {
      var win = window.open('http://openui5.org/', '_blank');
      win.focus();
    },

    onPressGotoMeteor: function() {
      var win = window.open('https://www.meteor.com/', '_blank');
      win.focus();
    },

  });


  return CController;

});
