sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-demo/model/formatter'
], function(Controller, MeteorModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.Binding", {

    formatter: formatter,

    onInit: function() {
    }

  });

  return CController;

});
