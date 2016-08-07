
### Binding to whole collections

In this example where we want all documents, we simply bind the table to the collection.  Our binding path is therefore "`/Orders`" which consists of the following components:

| Component | Description |
| - | - |
| `/` | The root context - ie this binding is not relative to any parent context binding. |
| `Orders` | The name of the Mongo database collection. |

### This demo

We bind the table to all of the orders in the collection as follows:
```xml
<Table id="OrdersTable" items="{/Orders}">
      <!-- Define columns and item template here -->
</Table>
```

#### Property binding

Once the table has been bound, individual controls can be bound to collection properties in the usual UI5 manner, e.g. `{CustomerID}`, `{Freight}` etc.
```xml
<!-- Order Item -->
<ColumnListItem id="OrdersItem">
    <cells>
        <Text text="{CustomerID}" />
        <!-- Additional fields as required -->
    </cells>
</ColumnListItem>

```
