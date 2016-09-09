# Update
In the [previous step](/#/tutorial/mongo/step/03) we added a way for the user to add tasks to their ToDos list.  In this step, we'll add a way for them to mark tasks as completed.

## Showing a checkbox in the list
Add the `mode` and `selectionChange` attributes to the list in `webapp/Tasks.view.xml` as follows:
```xml
  <!-- Tasks list -->
  <List id="TaskList"
        items="{
    path: '/Tasks',
    sorter: {
      path: 'createdAt',
      descending: true
    }}"
    mode="MultiSelect"
    selectionChange="onSelectionChange">
```

## Updating the database
Add the following method to `webapp/Tasks.controller.js`:
```js
    },

    onSelectionChange: function(oEvent){
      var oListItem = oEvent.getParameters().listItem;
      var oTaskData = oListItem.getBindingContext().getObject();

      // Set the checked property in the database to match the current selection
      this.oTasks.update(oTaskData._id, {
        $set: { checked: oListItem.getSelected() },
      });
    }
```

## Create a style sheet
Create a new file in the `webapp` folder called `style.css` with the following contents:

```css
  .completedTask {
    font-style: italic;
    text-decoration: line-through;
    color: #888;
  }
```

## Include the style sheet in your view controller
Modify the definition section of your `webapp/Tasks.controller.js` file to include JQuery so that it looks like this:
```js
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'jquery.sap.global',
  'meteor-ui5-mongo/model/Model'
], function(Controller, jQuery, MongoModel) {
```

Add the following line to the top of the `onInit` callback function:
```js
  onInit: function() {
    // Include our custom style sheet
    jQuery.sap.includeStyleSheet("webapp/style.css");
```

## Setting our completed tasks to use the new style
At this point it would be easy to style **every** task with our custom `completedTask` style.  We could just add a `class="completedTask"` in the view.  Dynamically applying a style within a list in UI5 is a little more involved however.  There are several ways to do it but we will use a formatter function and a `FormattedText` control.

### Change the list item
Replace the `<StandardListItem>` in `webapp/Tasks.view.xml` with the following:
```xml
  <!-- Task list item -->
  <CustomListItem
    selected="{checked}">
    <FormattedText htmlText="{
        parts:[{path:'checked'},{path:'text'}],
        formatter:'.getTaskTextAsHtml'
      }"/>
  </CustomListItem>
```

### Add the formatter function
Add the following new method in `webapp/Tasks.controller.js`:
```js
  },

  getTaskTextAsHtml: function(bChecked, sText){
    if (bChecked){
      return "<span class='completedTask'>" + sText + "</span>";
    } else {
      return sText;
    }
  }
```

## Testing
If all is well, you should see a page like the below when you run your app:

![Step 04 Completed](/docs/tutorial/04-Update.png "Step 04 Completed")

Confirm that you can mark tasks as complete (and the reverse) and that completed tasks are styled differently.

## Next
In the [next step](/#/tutorial/mongo/step/05) we will add a way to delete tasks.
