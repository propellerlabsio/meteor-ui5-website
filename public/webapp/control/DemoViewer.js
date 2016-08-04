sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/IconTabBar",
  "sap/m/IconTabFilter",
  "sap/m/Text",
  "sap/m/MessageStrip",
  "meteor-ui5-demo/control/SourceCodeViewer",
  "meteor-ui5-demo/control/MarkdownViewer",
  "sap/ui/core/mvc/XMLView"
], function(Control, IconTabBar, IconTabFilter, Text, MessageStrip, SourceCodeViewer, MarkdownViewer, XMLView) {
  "use strict";
  return Control.extend("meteor-ui5-demo.control.DemoViewer", {
    metadata: {
      properties: {
        infoText: {
          type: "string"
        },
        infoFile: {
          type: "string"
        },
        demoViewName: {
          type: "string"
        },
        sourceFiles: {
          type: "object[]"
        }
      },
      aggregations: {
        _tabs: {
          type: "sap.m.IconTabBar",
          multiple: false,
          visibility: "hidden"
        }
      }
    },

    init: function() {
      // Create icon tab bar.  Note: we add the four tabs now but the actual
      // content of those tabs will be added when we can access the properties
      // demoViewName, sourceFileView etc.
      const oIconTabBar = new IconTabBar({
        id: "tabs",
        expanded: true,
        expandable: false
      });

      // Create info tab
      this._infoTab = new IconTabFilter({
        key: "info",
        icon: "sap-icon://hint"
      });
      oIconTabBar.addItem(this._infoTab);

      // Create demo tab
      this._demoTab = new IconTabFilter({
        key: "demo",
        icon: "sap-icon://play"
      });
      oIconTabBar.addItem(this._demoTab);

      // Create source code tab
      this._sourceTab = new IconTabFilter({
        key: "source",
        icon: "sap-icon://source-code"
      });
      oIconTabBar.addItem(this._sourceTab);

      // Add all controls to our control
      this.setAggregation("_tabs", oIconTabBar);
    },

    onBeforeRendering: function() {
      // // Load content into tabs via properties that are now avialable.
      // First remove all existing content - some issue with my understanding
      // of control instances because this once instance seem to be being shared
      // between all models.
      this._infoTab.removeAllContent();
      this._demoTab.removeAllContent();
      this._sourceTab.removeAllContent();

      // Add content
      this._addInfoTabContent();
      this._addDemoTabContent();
      this._addSourceTabContent();

    },

    renderer: function(oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.writeClasses();
      oRM.write(">");
      oRM.renderControl(oControl.getAggregation("_tabs"));
      oRM.write("</div>");
    },

    _addInfoTabContent: function(){
      const markdownText = this.getProperty("infoText");
      const markdownFile = this.getProperty("infoFile");

      // Add info tab content
      if (markdownFile || markdownText ) {
        this._infoTab.addContent(new MarkdownViewer({
          markdownText: this.getProperty("infoText"),
          markdownFile: this.getProperty("infoFile")
        }));
      } else {
        this._infoTab.addContent(new MessageStrip({
          text:"Info text not configured.",
  				type:"Error",
  				showIcon: true,
  				showCloseButton: false
        }));
      }
    },

    _addDemoTabContent: function(){
      // Add demo tab content
      const demoViewName = this.getProperty("demoViewName");
      if (demoViewName){
        this._demoTab.addContent(new XMLView({
          viewName: demoViewName
        }));
      } else {
        this._demoTab.addContent(new MessageStrip({
          text:"Demo view not configured.",
  				type:"Error",
  				showIcon: true,
  				showCloseButton: false
        }));
      }
    },

    _addSourceTabContent: function(){
      // Add source tab content
      const oSourceFiles = this.getProperty("sourceFiles");
      if (oSourceFiles && oSourceFiles.length){
        // Create tab bar for multiple source code files
        const oCodeTabs = new IconTabBar({
          expanded: true,
          expandable: false
        });

        // Add each source code file to its own tab
        oSourceFiles.forEach((sourceFile) => {
          var newTab = new IconTabFilter({
            text: sourceFile.title,
          });
          newTab.addContent(new SourceCodeViewer({
            sourceFile: sourceFile.file,
            hljsLanguage: this._getSourceFileType(sourceFile.file)
          }));
          oCodeTabs.addItem(newTab);
        });

        // Add code tabs to source tab
        this._sourceTab.addContent(oCodeTabs);
      } else {
        this._sourceTab.addContent(new MessageStrip({
          text:"Source files not configured.",
  				type:"Error",
  				showIcon: true,
  				showCloseButton: false
        }));
      }
    },

    _getSourceFileType(sFileName) {
      var iLastPeriod = sFileName.lastIndexOf(".");
      return sFileName.substring(iLastPeriod + 1);
    }
  });
});
