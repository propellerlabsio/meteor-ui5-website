### Property lookups

Our `Orders` collection has the `CustomerID` property for each document, but supposed you'd rather show the customer name instead of the number.  The UI5 standard OData model provides for this via the `$expand` keyword.  However, for each individual use case, this needs to be enabled and coded on the server.

In Meteor UI5 we provide an alternative approach called **Lookups** whereby the UI5 developer can define lookup queries on related collections directly in the property binding.

#### Syntax
In our earlier 'One Order' example, we showed the customer id value using the property binding `text="{CustomerID}"`.

Since we have the `CustomerID` field which uniquely indentifies a document in the `Customers` collection, we can instead do a lookup on that collection and return any property from the Customer document. To do that we would use the binding `{?Customers(CustomerID)/CompanyName}`.

The following table breaks down the components of this lookup:

| Component | Description |
| --------- | ----------- |
| `?` | The question mark in the first position denotes that the property value is derived from a lookup and not a property in the current context. |
| `Customers` | The name of the Mongo database collection we wish to query. |
| `(CustomerID)` | The property in the current context that has the unique id of the document that we want. |
| `/CompanyName` | The property from the the Customers collection that we want to show. |

#### Subscriptions
Note, if using Meteor publications and subscriptions, it is still necessary to ensure the front-end has the data it requires.  Querying the `Customers` collection in a lookup will not return any data if the front-end doesn't have the relevant Customer document. Refer to the [Publishing Relational Data](https://guide.meteor.com/data-loading.html#publishing-relations) section in the Meteor Guide for more information.

### This demo

The code in this demo is nearly identical to the 'One Order' demo however, now, instead of showing the `CustomerId` value from the Order, we use a lookup to get the `CompanyName` from the `Customers` collection.
```xml
<ObjectHeader binding="{/Orders(10248)}">
  <attributes>
    <ObjectAttribute title="Customer"
        text="{?Customers(CustomerID)/CompanyName}" />
    <!-- Add additional ObjectHeader attributes as required. -->
  </attributes>
</ObjectHeader>
```
