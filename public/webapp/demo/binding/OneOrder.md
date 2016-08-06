
## Binding paths for individual documents

In this example we want a single, specific document. Documents in Mongo collections are uniquely identified by the value in the `_id` field and we add this after the collection name in parenthesis, e.g. "`/Orders(10248)`".

| Component | Description |
| --------- | ----------- |
| `/` | The root context - ie this binding is not relative to any parent control binding. |
| `Orders` | The name of the Mongo database collection. |
| `(10248)` | The unique id of the document we want. |

## Binding path used in this demo

We bind to the single order in the view as follows:
```xml
  <VBox id="Order" binding="{/Orders(10248)}">
      <!-- Define controls for displaying order properties here -->
  </VBox>
```
