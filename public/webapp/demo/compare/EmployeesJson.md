This demo uses a UI5-standard JSON Model for all data handling.  The only effective difference between this model and the others in these examples is in the way the model is instantiated with the below code.
```js
// Create a json model with data from a file and make it our view model
var oModel = new JSONModel('/webapp/demo/compare/Employees.json');
this.getView().setModel(oModel);
```
