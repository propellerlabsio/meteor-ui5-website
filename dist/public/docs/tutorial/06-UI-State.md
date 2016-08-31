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

## Next
Further tutorial steps are still being written.  In these steps we will cover:
* Adding sign in/out with the standard Meteor Accounts packages and the `meteor-ui5-accounts` package.
* Securing your app with Meteor server methods 
* Securing your app with collection publications and subscriptions.

Bookmark this page and check back soon for these new tutorial steps.  In the mean time, the following resources might be useful for learning more about Meteor and/or UI5:

| Resource | Description |
| -------- | ----------- |
| [Meteor Guide](https://guide.meteor.com/) | Best-practice meteor guide.  Although targetted to the MDG supported view layers (Blaze, React and Angular) there is a wealth of information that will be applicable to your meteor-UI5 projects. |
| [Meteor Docs](http://docs.meteor.com/) | API docs. See note re relevance above. |
| [UI5 Development toolkit](https://openui5.hana.ondemand.com/#docs/guide/95d113be50ae40d5b0b562b84d715227.html) | If you are relatively new to UI5 then the Walkthrough Tutorial is an excellent resource and highly recommended.  Note that 99.9% of this tutorials is directly relevant to Meteor-UI5 projects however you should bootstrap UI5 and launch your app or view using the file structure outlined in the Quickstart guide. | 