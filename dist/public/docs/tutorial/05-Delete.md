# Delete
In the [previous step](/#/tutorial/mongo/step/04) we added a way for the user to mark their tasks as completed.  In this step, we'll add a way for them to delete tasks from the database altogether.

## Add MessageBox module 
Before we delete a task, it would be good to ask the user to confirm that that's what they want to do.  We'll use the UI5 MessageBox for this.  Change the definition section at the top of the `webapp/Tasks.controller.js` file so that it looks like this:
```js
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'jquery.sap.global',
  'meteor-ui5-mongo/model/Model',
  'sap/m/MessageBox'
], function(Controller, jQuery, MongoModel, MessageBox) {
```

## Add method to delete a task to the view controller
In the same file, add the method that will remove the task:
```js
  },

  onPressDeleteTask: function(oEvent){
    var oListItem = oEvent.getSource();
    var oTaskData = oListItem.getBindingContext().getObject();

    // Ask user to confirm delete
    var that = this;
    MessageBox.confirm("Permanently remove task?", {
      onClose: function(oAction){
        if (oAction === MessageBox.Action.OK){
          // Remove the task
          that.oTasks.remove(oTaskData._id);
        }
      }
    });
  }
```

## Add delete button to the view
Now modify the view so that the `CustomListItem` looks like the below:
```xml
  <!-- Task list item -->
  <CustomListItem selected="{checked}">
    <Toolbar>
      <FormattedText htmlText="{
          parts:[{path:'checked'},{path:'text'}],
          formatter:'.getTaskTextAsHtml'
        }" />
      <ToolbarSpacer />
      <Button type="Transparent"
              press="onPressDeleteTask"
              text="X" />
    </Toolbar>
  </CustomListItem>
```
The main new component in the above is the `Button` which calls the method we added earlier when it is pressed.  We've also wrapped the contents of the list item in a `ToolBar` for spacing.

## Testing
If all is well, you should see a page like the below when you run your app:

![Step 05 Completed](/docs/tutorial/05-Delete.png "Step 05 Completed")

Notice the new button on the right of each list item.  Clicking on the button should show you the above confirmation dialog.

Confirm that you can delete tasks before continuing.

## Next
In the [next step](/#/tutorial/mongo/step/06) we will add a way to hide or show completed tasks.

