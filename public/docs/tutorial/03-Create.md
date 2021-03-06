# Create
In the [previous step](/#/tutorial/mongo/step/02) we set our ToDos list to source the the data from a Mongo Collection but the user still doesn't have any way to add tasks themeselves.  We will fix that in this step.

## Add task control
Add a new toolbar to the existing List with an input field in the `webapp/Tasks.view.xml` file as follows:
```xml
  <!-- Tasks list -->
  <List items="{/Tasks}">
      <!-- List toolbar -->
      <headerToolbar>
        <Toolbar>
          <Label text="Add:" />
          <Input change="onAddTask" placeholder="Task text" />
        </Toolbar>
      </headerToolbar>
```

## Get a reference to the Tasks collection
In the `webapp/Tasks.controller.js` file, create a reference to the `Tasks` collection and store it in an instance attribute just above the `onInit` method:
```js
  oTasks: Mongo.Collection.get("Tasks"),

  onInit: function() {
```
We will reuse this reference in this and future steps so we don't have to repeat the `Mongo.Collection.get()` call in several places.

## Add task code
Add the `onAddTask` method to the same file as follows:
```js
    },

    onAddTask: function(oEvent){
        var oInput = oEvent.getSource();
        this.oTasks.insert({
            text: oInput.getValue(),
            createdAt: new Date()
        });
        oInput.setValue();
  }
```

## Sort our tasks
Finally, lets sort the tasks so the newest ones are on top.  Modify the `<List>` element in `webapp/Tasks.view.xml` as follows:
```xml
  <!-- Tasks list -->
  <List items="{
    path: '/Tasks',
    sorter: {
      path: 'createdAt',
      descending: true
    }}">

```

## Testing
If all is well, you should see a page like the below when you run your app:

![Step 03 Completed](/docs/tutorial/03-Create.png "Step 03 Completed")

Confirm that you can add tasks and that new tasks are added to the top of the list.

## Next
In the [next step](/#/tutorial/mongo/step/04) we will add a way to mark tasks as completed.
