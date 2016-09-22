sap.ui.define([
  'jquery.sap.global',
  "sap/ui/core/Control",
  "sap/ui/core/HTML"
], function(jQuery, Control, HTML) {
  "use strict";

  jQuery.sap.require('meteor-ui5-website.lib.remarkable');
  jQuery.sap.require('meteor-ui5-website.lib.highlight.highlight');

  return Control.extend("meteor-ui5-website.control.MarkdownViewer", {
    metadata: {
      properties: {
        markdownFile: {
          type: "string"
        },
        markdownText: {
          type: "string"
        },
        markdownModule: {
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
    },

    onBeforeRendering: function() {

      // Get values/references we need
      let sMarkdownText = this.getProperty("markdownText");
      const sMarkdownFile = this.getProperty("markdownFile");
      const sMarkdownModule = this.getProperty("markdownModule");
      const sRequestedMarkdown = sMarkdownText || sMarkdownFile || sMarkdownModule;
      
      if (!sMarkdownText && !sMarkdownFile && !sMarkdownModule) {
        // Nothing to load
        this._oHTML.setContent();
        return;
      } else if (this._sLoadedMarkdown === sRequestedMarkdown) {
        // Already loaded
        return;
      }

      // Remember what we are loading so we don't try to load it again
      this.setBusy(true);
      this._sLoadedMarkdown = sRequestedMarkdown;

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

      // If markdown module provided, load it into string.  Although "jQuery.sap.loadResource" is 
      // not documented in the API jsdocs, it appears to be the only way to load a non-javascript or 
      // non-XML module in such a way that it will get it from Component-preload.js if it is available
      // there (and from the server if not).
      if (sMarkdownModule) {
        var modulePath =jQuery.sap.getModulePath(sMarkdownModule, ".md");
        sMarkdownText = jQuery.sap.loadResource({
          url: modulePath,
          dataType: 'text'
        });
      }

      // If markdown code provided, load it into dom element directly
      if (sMarkdownText) {
        // Load code into dom element
        this._oHTML.setContent("<div>" + md.render(sMarkdownText) + "</div>");
        this.setBusy(false);
      } else {
        // Use jquery to load code from url in markdownFile property
        const that = this;
        jQuery.get(sMarkdownFile, function(data) {
          if (data.substring(0, 15) === "<!DOCTYPE html>") {
            // Equivalent of 404 - not found.  Meteor returns the whole client
            // html.  Since this may be a subscription/timing issue, dont'
            // treat it as an error.  Message will appear only in debug mode.
            jQuery.sap.log.warning("Unable to load markdown file: " + sMarkdownFile );
            return;
          }

          // Load code into dom element
          that._oHTML.setContent("<div>" + md.render(data) + "</div>");

          that.setBusy(false);
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
