sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  'sap/ui/model/Filter',
  'sap/ui/model/FilterOperator',
  'sap/ui/model/Sorter',
  'meteor-ui5-website/model/formatter'
], function(Controller, JSONModel, Filter, FilterOperator, Sorter, formatter) {
  "use strict";

  var CController = Controller.extend("meteor-ui5-website.demo.3-compare.json.EmployeesJson", {

    formatter: formatter,

    onInit: function() {
      // Create a json model with data from a file and make it our view model
      var oModel = new JSONModel('/webapp/demo/3-compare/json/Employees.json');
      this.getView().setModel(oModel);
    },

    /**
    * The following code is the same for all models but repeated in each
    * controller rather than in some shared parent controller for clarity.
    */
    onSortButtonPressed: function() {
      // Show view settings dialog - sort page
      this.byId("ViewSettingsDialog").open("sort");
    },

    onFilterButtonPressed: function() {
      // Show view settings dialog - filter page
      this.byId("ViewSettingsDialog").open("filter");
    },

    onConfirmViewSettings: function(oEvent) {
      // Get references we need
      var oView = this.getView();
      var oTable = oView.byId("EmployeesTable");
      var mParams = oEvent.getParameters();
      var oBinding = oTable.getBinding("items");

      // Build and apply sorter to binding
      var aSorters = [];
      var sPath = mParams.sortItem.getKey();
      var bDescending = mParams.sortDescending;
      aSorters.push(new Sorter(sPath, bDescending));
      oBinding.sort(aSorters);

      // Build and apply filters to binding
      var aFilters = [];
      jQuery.each(mParams.filterItems, function(i, oItem) {
        // Create filter and apply it
        var sPath = oItem.getParent().getKey();
        var sValue = oItem.getKey();
        var oFilter = new Filter(sPath, FilterOperator.EQ, sValue);
        aFilters.push(oFilter);
      });
      oBinding.filter(aFilters);

      // Update filter label and show/hide filter bar
			oView.byId("EmployeesFilterLabel").setText(mParams.filterString);
			oView.byId("EmployeesFilterBar").setVisible(aFilters.length > 0);
    }

  });

  return CController;

});
