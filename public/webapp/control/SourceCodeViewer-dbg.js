sap.ui.define([
	'jquery.sap.global',
	"sap/ui/core/Control"
], function (jQuery, Control) {
	"use strict";

	return Control.extend("meteor-ui5-demo.control.SourceCodeViewer", {
		metadata : {
			properties : {
				src: {type: "string"},
				hljsLanguage: {type: "string"}
			}
		},

		onAfterRendering: function(){
			// Use highlight js on code
			var sSrc = this.getProperty("src");
			var oCodeArea = jQuery('pre code').first();
			jQuery.get(sSrc, function(data) {
				oCodeArea.text(data);
				jQuery('pre code').each(function(i, block) {
			    hljs.highlightBlock(block);
			  });
			}, "text");
		},

		init : function () {
			this._sInitialCode = "Loading...";
		},

		// the part creating the HTML:
		renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance
																				 // instead of "this" in the renderer function
				var hljsLanguage = oControl.getProperty("hljsLanguage");
				oRm.write("<pre><code");
				oRm.writeControlData(oControl);  			// writes the Control ID and enables event handling - important!
				oRm.addClass(hljsLanguage);
				oRm.writeClasses();	// Writes the highlight JS language alias as a class on code tag
				oRm.write(">");
				oRm.write(oControl._sInitialCode);
				oRm.write("</code></pre>"); // end of the complete Control
		}
	});
});
