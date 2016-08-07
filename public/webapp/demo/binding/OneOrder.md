
### Binding to individual documents

In this example we want a single, specific document. Documents in Mongo collections are uniquely identified by the value in the `_id` field and we add this after the collection name in parenthesis, e.g. "`/Orders(10248)`".

| Component | Description |
| --------- | ----------- |
| `/` | The root context - ie this binding is not relative to any parent context binding. |
| `Orders` | The name of the Mongo database collection. |
| `(10248)` | The unique id of the document we want. |

### This demo

We bind to the single order in the view as follows:
```xml
<ObjectHeader binding="{/Orders(10248)}">
  <attributes>
    <ObjectAttribute title="Customer" text="{CustomerID}" />
    <!-- Add additional ObjectHeader attributes as required. -->
  </attributes>
</ObjectHeader>
```
