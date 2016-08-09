sap.ui.define([
  'jquery.sap.global',
  "sap/ui/core/Control"
], function(jQuery, Control) {
  "use strict";

  return Control.extend("meteor-ui5.control.SourceCodeViewer", {
    metadata: {
      properties: {
        sourceFile: {
          type: "string"
        },
        sourceCode: {
          type: "string"
        },
        hljsLanguage: {
          type: "string"
        }
      }
    },

    onAfterRendering: function() {
      // Get values/references we need
      var sSourceCode = this.getProperty("sourceCode");
      var sSourceFile = this.getProperty("sourceFile");
      var oSourceViewer = this.getDomRef();
      var that = this;

      // If source code provided, load it into dom element directly
      if (sSourceCode) {
        // Load code into dom element
        oSourceViewer.innerText = sSourceCode;

        // Ask hljs to highlight code
        hljs.highlightBlock(oSourceViewer);

        this.setBusy(false);
      } else {
        // Use jquery to load code from url in sourceFile property
        jQuery.get(sSourceFile, function(data) {
          // Load code into dom element
          oSourceViewer.innerText = data;

          // Ask hljs to highlight code
          hljs.highlightBlock(oSourceViewer);

          that.setBusy(false);
        }, "text");
      }
    },

    init: function() {
      this.setBusy(true);
    },

    // the part creating the HTML:
    renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance
      // instead of "this" in the renderer function
      var hljsLanguage = oControl.getProperty("hljsLanguage");
      oRm.write("<pre><code");
      oRm.writeControlData(oControl); // writes the Control ID and enables event handling - important!
      oRm.addClass(hljsLanguage);
      oRm.writeClasses(); // Writes the highlight JS language alias as a class on code tag
      oRm.write(">");
      // oRm.write(oControl._sInitialCode);
      oRm.write("</code></pre>"); // end of the complete Control
    }
  });
});
