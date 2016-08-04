This demo uses the Meteor Model for all data handling.  

Meteor Models require no arguments on instantiation but provide access to all Meteor collections by default:

```js
// Create Meteor model
var oModel = new MeteorModel();
this.getView().setModel(oModel);
```

It is usual practice in Meteor to provide data from the server to the client via [publications and subscriptions](https://guide.meteor.com/data-loading.html).  To subscribe to data in your view you do it in the usual way:
```js
// Subscribe to Employees data.
this._subscription = Meteor.subscribe('employees');
```

When using subscriptions, you should store the subscription reference and call the `.stop()` method on it when the view is destroyed:
```js
onExit: function(){
  this._subscription.stop();
},
```
