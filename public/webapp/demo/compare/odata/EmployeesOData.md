This demo uses a UI5-standard OData Model for all data handling.  The only effective difference between this model and the others in these examples is in the way the model is instantiated with the below code.

```js
// Set up Odata model for Employees - will be populated via Northwind
// odata service.  We use a proxy due to CORS issues.  Calls to the proxy
// are redirected to http://services.odata.org/V2/Northwind/Northwind.svc
var oModel = new ODataModel('/oDataProxy');
this.getView().setModel(oModel);
```
