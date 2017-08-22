# UI State
In the [previous step](/#/tutorial/mongo/step/05) we added a way for the user to delete their tasks.  In this step, we'll add a way for them to show or hide completed tasks.

## Add a toggle button to the view
Add a toggle button to the toolbar right after the input field in `webapp/Tasks.view.xml` with the following code:
```xml
    <ToolbarSpacer />
    <ToggleButton tooltip="Show completed tasks"
      pressed="{ViewState>/showCompleted}"
      icon="sap-icon://complete"
      press="onPressShowCompleted" />
  </Toolbar>
```

## Add id to TaskList
In the same file, add the `id` attribute to the list so that we can reference it from the controller:
```js
  <!-- Tasks list -->
  <List id="TaskList"
    items="{
```

## Add new imports to your view controller
For this step, we will need to add the following modules:
* JSON Model
* Filter
* Filter Operator

Adjust the top of your `webapp/Tasks.controller.js` file so it looks like the following:

```js
  sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'jquery.sap.global',
    'meteor-ui5-mongo/model/Model',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox'
  ], function(Controller, jQuery, MongoModel, JSONModel, Filter, FilterOperator, MessageBox) {
    // ...
  });

```

## Add a JSON model to store local view state 
Add the following code to the end of the `onInit` callback method:
```js
    // Our local view state model
    var oViewState = {
      showCompleted: true
    };
    var oViewModel = new JSONModel(oViewState);
    this.getView().setModel(oViewModel, "ViewState");
  },
```

## Add a new event handler for toggle button
```js
  onPressShowCompleted: function(){
    // Get current state of "show completed" toggle button
    var oViewState = this.getView().getModel('ViewState');
    var bShowCompleted = oViewState.getProperty('/showCompleted');

    // Build task filter according to current state
    var aFilters = [];
    if (!bShowCompleted){
      aFilters.push(new Filter({
          path: 'checked',
          operator: FilterOperator.NE,
          value1: true
      }));
    }

    // Set filter
    var oTaskList = this.byId("TaskList");
    oTaskList.getBinding('items').filter(aFilters);
  },
```

## Testing
If all is well, you should see the below when you run your app:

### Toggle on
![Step 06 Completed - Toggle On](/docs/tutorial/06-UI-StateA.png "Step 06 Completed - Toggle On")

### Toggle off
![Step 06 Completed - Toggle Off](/docs/tutorial/06-UI-StateB.png "Step 06 Completed - Toggle Off")

Notice the new button on the right in the top toolbar.  Clicking on the button should show or hide the completed tasks.  Confirm that this is working before proceeding. 