sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	return Control.extend("meteor-ui5-demo.control.SourceCodeViewer", {
		metadata : {
			properties : {
				src: {type: "string"}
			}
		},
		onBeforeRendering: function(){
				debugger;
		},

		init : function () {
				debugger;
		},
		renderer: {}
	});
});
