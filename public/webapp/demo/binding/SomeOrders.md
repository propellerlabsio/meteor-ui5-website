# Binding paths: Collections
In this example where we want all documents, we simply bind the table to the collection.  Our binding path is therefore "`/Orders`" which consists of the following components:

| | |
| --------- | ----------- |
| `/` | The root context - ie this binding is not relative to any parent control binding. |
| `Orders` | The name of the Mongo database collection. |

# Setting the binding in the controller
In our example, we set the binding in the controller as follows:
```js
// Bind table to all Orders
this.byId("OrdersTable").bindItems({
  path: "/Orders",
  template: this.byId("OrdersItem").clone()
});
```

# Alternative: Setting the binding in the view
Alternatively, the binding could be set in the view like this:
```xml
<Table id="OrdersTable" items="{/Orders}">
      <!-- Define columns and item template here -->
</Table>
```
