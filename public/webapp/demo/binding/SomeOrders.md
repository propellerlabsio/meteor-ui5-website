### Binding with filters
In this example our binding path is identical to the "All Orders" example, i.e. "`/Orders`".  We restrict the records shown by using [UI5 filters](https://sapui5.hana.ondemand.com/docs/api/symbols/sap.ui.model.Filter.html).

### This demo
In this demo, we use JavaScript to do the binding because writing complex bindings in JavaScript is less error prone than writing them in a single string in XML.  It's also often the case that you need to use somewhat complex logic to determine filter values dynamically and JavaScript is easier for that.  (See the alternative example code in the next section below to see how to do the same binding directly in the XML view.)  This is our binding using JavaScript:
```js
// Create filter for customer = HANAR
const oCustomerFilter = new Filter({
  path: 'CustomerID',
  operator: FilterOperator.EQ,
  value1: 'VINET'
})

// Create filter for country = Brazil
const oCountryFilter = new Filter({
  path: 'ShipCountry',
  operator: FilterOperator.EQ,
  value1: 'France'
})

// Bind table to some orders via filters
this.byId("OrdersTable").bindItems({
  path: "/Orders",
  template: this.byId("OrdersItem").clone(),
  filters: [oCustomerFilter, oCountryFilter]
});
```

### Alternative
Alternatively, the table binding could be set in the view like this:
```xml
<Table id="OrdersTable" items="{
    path: '/Orders',
    filters: [{
        path: 'CustomerID',
        operator: 'EQ',
        value1: 'VINET'
    },{
        path: 'ShipCountry',
        operator: 'EQ',
        value1: 'France'
    }]
}">
      <!-- Define columns and item template here -->
</Table>
```
Binding to individual order properties is identical regardless of whether you use XML or JavaScript to bind your table.
