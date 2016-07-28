sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/IconTabBar",
  "sap/m/IconTabFilter",
  "meteor-ui5-demo/control/SourceCodeViewer",
  "sap/ui/core/mvc/XMLView"
], function(Control, IconTabBar, IconTabFilter, SourceCodeViewer, XMLView) {
  "use strict";
  return Control.extend("meteor-ui5-demo.control.CompareModelControl", {
    metadata: {
      properties: {
        demoViewName: {
          type: "string"
        },
        sourceFileView: {
          type: "string"
        },
        sourceFileController: {
          type: "string"
        },
        sourceFileTable: {
          type: "string"
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
        select: this._onTabSelect.bind(this),
        expanded: true,
        expandable: false
			});

      // Create demo tab
      this._demoTab = new IconTabFilter({
          key: "demo",
          text: "Demo"
      });
      oIconTabBar.addItem(this._demoTab);

      // Create controller code tab
      this._controllerTab = new IconTabFilter({
          key: "controller",
          text: "Controller"
      });
      oIconTabBar.addItem(this._controllerTab);

      // Create view code tab
      this._viewTab = new IconTabFilter({
          key: "view",
          text: "View"
      });
      oIconTabBar.addItem(this._viewTab);

      // Create table code tab
      this._tableTab = new IconTabFilter({
          key: "table",
          text: "Table"
      });
      oIconTabBar.addItem(this._tableTab);

      // Add all controls to our control
      this.setAggregation("_tabs", oIconTabBar);
    },

    onAfterRendering: function(){
      debugger;

    },

    onBeforeRendering: function(){
      // Only continue if properties we need are available
			const sDemoViewName = this.getProperty("demoViewName");
      if (!sDemoViewName){
        return;
      }

      // // Load content into tabs via properties that are now avialable.
      // First remove all existing content - some issue with my understanding
      // of control instances because this once instance seem to be being shared
      // between all models.
      this._demoTab.removeAllContent();
      this._viewTab.removeAllContent();
      this._controllerTab.removeAllContent();
      this._tableTab.removeAllContent();

      // Add demo view
      this._demoTab.addContent(new XMLView({
          viewName: this.getProperty("demoViewName")
      }));

      // Add view source code
      this._viewTab.addContent(new SourceCodeViewer({
          sourceFile: this.getProperty("sourceFileView"),
          hljsLanguage: "xml"
      }));

      // Add controller source code
      this._controllerTab.addContent(new SourceCodeViewer({
          sourceFile: this.getProperty("sourceFileController"),
          hljsLanguage: "js"
      }));

      // Add table source code
      this._tableTab.addContent(new SourceCodeViewer({
          sourceFile: this.getProperty("sourceFileTable"),
          hljsLanguage: "xml"
      }));

    },

    renderer: function(oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.writeClasses();
      oRM.write(">");
      oRM.renderControl(oControl.getAggregation("_tabs"));
      oRM.write("</div>");
    },

    _onTabSelect: function(oEvent){

    }
  });
});
