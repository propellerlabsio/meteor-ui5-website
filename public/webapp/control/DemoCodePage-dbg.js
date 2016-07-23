sap.ui.define([
	"sap/m/Page"
], function (Page) {
	"use strict";
	return Page.extend("meteor-ui5-demo.control.DemoCodePage", {
		metadata : {
			properties : {
				demoView: 	{type : "string"},
				// sourceFiles: {type: "array"}
				// aggregations: {
        //     content: {singularName: "content"} // default type is "sap.ui.core.Control", multiple is "true"
        //  }
			}
		},
		// init : function () {
		// }
		renderer: {}
	});
});
