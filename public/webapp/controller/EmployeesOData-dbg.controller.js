sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/odata/ODataModel',
  'meteor-ui5-demo/model/formatter'
], function(Controller, ODataModel, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-demo.controller.EmployeesOData", {

    formatter: formatter,

    onInit: function() {
      // Set up Odata model for Employees - will be populated via Northwind
      // odata service.  We use a proxy due to CORS issues with service being
      // at different URL.  Calls to URL '/oDataProxy' are redirected to
      // http://services.odata.org/V2/Northwind/Northwind.svc
      var oModel = new ODataModel('/oDataProxy');
      this.getView().setModel(oModel);
    }

  });

  return CController;

});
