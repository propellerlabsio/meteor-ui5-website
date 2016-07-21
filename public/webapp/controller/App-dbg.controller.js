		sap.ui.define([
		  'sap/ui/core/mvc/Controller'
		], function(Controller) {
		  "use strict";

		  var CController = Controller.extend("meteor-model-demo.controller.App", {

		    onDebugPress: function() {
		      debugger;
		    }
		  });


		  return CController;

		});
