sap.ui.define([
  'jquery.sap.global',
  "sap/ui/core/Control",
  "sap/ui/core/HTML"
], function(jQuery, Control, HTML) {
  "use strict";

  jQuery.sap.require('meteor-ui5.lib.remarkable');

  return Control.extend("meteor-ui5.control.MarkdownViewer", {
    metadata: {
      properties: {
        markdownFile: {
          type: "string"
        },
        markdownText: {
          type: "string"
        },
      },
      aggregations: {
        _html: {
          type: "sap.ui.core.HTML",
          multiple: false
        }

      }
    },

    init: function() {
      this._oHTML = new HTML();
      this.setAggregation("_html", this._oHTML);
      this.setBusy(true);
    },

    onBeforeRendering: function() {
      // Only load once - these are static markdown files / texts
      if (this._bMarkdownLoaded) {
        return;
      }

      // Get values/references we need
      const sMarkdownText = this.getProperty("markdownText");
      const sMarkdownFile = this.getProperty("markdownFile");

      // Instantiate new remarkable instance with syntax highlighting
      // provided by Highlight.js
      const md = new Remarkable('full', {
        html: false, // Enable HTML tags in source
        xhtmlOut: false, // Use '/' to close single tags (<br />)
        breaks: false, // Convert '\n' in paragraphs into <br>
        langPrefix: 'language-', // CSS language prefix for fenced blocks
        linkify: true, // autoconvert URL-like texts to links
        linkTarget: '', // set target to open link in

        // Enable some language-neutral replacements + quotes beautification
        typographer: true,

        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
        quotes: '“”‘’',
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (err) {}
          }

          try {
            return hljs.highlightAuto(str).value;
          } catch (err) {}

          return ''; // use external default escaping
        }
      });

      // If markdown code provided, load it into dom element directly
      if (sMarkdownText) {
        // Load code into dom element
        this._oHTML.setContent(md.render(sMarkdownText));
        this.setBusy(false);
        this._bMarkdownLoaded = true;
      } else {
        // Use jquery to load code from url in markdownFile property
        console.log("Loading " + sMarkdownFile + " into " + this.sId);
        const that = this;
        jQuery.get(sMarkdownFile, function(data) {
          // Load code into dom element
          that._oHTML.setContent(md.render(data));

          that.setBusy(false);
          that._bMarkdownLoaded = true;
        }, "text");
      }
    },

    // the part creating the HTML:
    renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance
      // instead of "this" in the renderer function
      oRm.write("<div");
      oRm.writeControlData(oControl); // writes the Control ID and enables event handling - important!
      oRm.addClass("markdown")
      oRm.writeClasses(); // Writes the highlight JS language alias as a class on code tag
      oRm.write(">");
      oRm.renderControl(oControl.getAggregation("_html"));
      oRm.write("</div>"); // end of the complete Control
    }
  });
});
