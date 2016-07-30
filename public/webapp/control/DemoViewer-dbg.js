sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/IconTabBar",
  "sap/m/IconTabFilter",
  "sap/m/Text",
  "meteor-ui5-demo/control/SourceCodeViewer",
  "sap/ui/core/mvc/XMLView"
], function(Control, IconTabBar, IconTabFilter, Text, SourceCodeViewer, XMLView) {
  "use strict";
  return Control.extend("meteor-ui5-demo.control.DemoViewer", {
    metadata: {
      properties: {
        infoText: {
          type: "string"
        },
        focusCode: {
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
      // Only continue if properties we need are available
      const sDemoViewName = this.getProperty("demoViewName");
      if (!sDemoViewName) {
        return;
      }

      // // Load content into tabs via properties that are now avialable.
      // First remove all existing content - some issue with my understanding
      // of control instances because this once instance seem to be being shared
      // between all models.
      this._infoTab.removeAllContent();
      this._demoTab.removeAllContent();
      this._sourceTab.removeAllContent();

      // Add info tab content
      this._infoTab.addContent(new Text({
        text: this.getProperty("infoText")
      }));
      const sFocusCode = this.getProperty("focusCode");
      if (sFocusCode){
        this._infoTab.addContent(new SourceCodeViewer({
          sourceCode: sFocusCode,
          hljsLanguage: 'js'
        }));
      }

      // Add demo tab content
      this._demoTab.addContent(new XMLView({
        viewName: this.getProperty("demoViewName")
      }));

      // Add source tab content
      const oSourceFiles = this.getProperty("sourceFiles");
      if (oSourceFiles.length){
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
      }

    },

    renderer: function(oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.writeClasses();
      oRM.write(">");
      oRM.renderControl(oControl.getAggregation("_tabs"));
      oRM.write("</div>");
    },

    _getSourceFileType(sFileName) {
      var iLastPeriod = sFileName.lastIndexOf(".");
      return sFileName.substring(iLastPeriod + 1);
    }
  });
});
