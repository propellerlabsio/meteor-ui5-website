		sap.ui.define([
		  'jquery.sap.global',
		  'sap/m/MessageToast',
		  'sap/ui/core/Fragment',
		  'sap/ui/core/mvc/Controller',
		  'sap/ui/model/Filter',
		  'sap/ui/model/json/JSONModel'
		], function(jQuery, MessageToast, Fragment, Controller, Filter, JSONModel) {
		  "use strict";

		  var CController = Controller.extend("meteor-model-demo.controller.App", {

		    onDebugPress: function() {
		      debugger;
		    }
		  });


		  return CController;

		});
