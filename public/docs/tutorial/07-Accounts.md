# Accounts

In the [previous step](/#/tutorial/mongo/step/06) we added a way for the user to show or hide their completed tasks.  In this step, we'll add a way for them to create their accounts.

## Add accounts password package to your project directory 
 Go to your project folder and type `meteor add accounts-password`
## Add SAPUI5 namespace to the view
 Add namespace `xmlns:form="sap.ui.layout.form` in `webapp/Tasks.view.xml`
```xml
  <mvc:View controllerName="webapp.Tasks"
		height="100%"
		xmlns:mvc="sap.ui.core.mvc"
        xmlns:form="sap.ui.layout.form"
		xmlns:l="sap.ui.layout"
		xmlns="sap.m">
```
## Add the registration form to the view 
 Add registration form at the top of the page. Only show if user is logged in to your view in `webapp/Tasks.view.xml`
```xml
  	<!-- Login form -->
	<form:SimpleForm editable="true" id="formId"
        maxContainerCols="2"
        layout="ResponsiveGridLayout"
        labelSpanL="4"
        labelSpanM="4"
        emptySpanL="4"
        emptySpanM="4">
        <Label text="Email"/>
        <Input id="inputEmail" type="Email"/>
        <Label text="Password"/>
        <Input id="inputPassword" type="Password"/>
    </form:SimpleForm>
```
## Add account buttons to the view
```xml
   <Toolbar>
		<ToolbarSpacer/>
		<Button id="idConfirmSignOut" text="Sign out" press="onSignOutAccount"></Button>
		<Button id="idConfirmCreate" text="Create account" press="onCreateAccount"></Button>
		<Button id="idConfirmLogin" text="Log in" press="onLogInAccount"></Button>
  </Toolbar>
```
## Hide or show the task list whether user is logged in or not
Add a function to hide or show the Task list in `webapp/Tasks.controller.js`
```js
    hideOrShowTaskList: function(){
      if (!Meteor.user()){
        var oTasks = this.byId('TaskList');
        oTasks.setVisible(false);
      } else {
        var oTasks = this.byId('TaskList');
        oTasks.setVisible(true);
      }
    },
```
## Add function and set sign out button to invisible to onInit 
Call `hideOrShowTaskList` function and set sign out button to invisible when the app runs initially
```js
    onInit: function() {
      // Show or Hide the Task list whether user loggs in or not
      this.hideOrShowTaskList();

      // Include our custom style sheet
      jQuery.sap.includeStyleSheet("webapp/style.css");
      // Instantiate Mongo Model
      var oModel = new MongoModel();
      this.getView().setModel(oModel);

      // Our local view state model
      var oViewState = {
        showCompleted: true
      };
      var oViewModel = new JSONModel(oViewState);
      this.getView().setModel(oViewModel, "ViewState");

      // Set sign out button to invisible when the app runs initially
      var oBtnSignOut = this.byId("idConfirmSignOut");
      oBtnSignOut.setVisible(false);
    },
```
## Change the state of the buttons depending on whether the user is logged in or not
```js
   showOrHideAccountButtons: function(){
      if (Meteor.user()){
        var oSimpleForm = this.byId("formId");
        oSimpleForm.setVisible(false);
        var oBtnSignOut = this.byId("idConfirmSignOut");
        oBtnSignOut.setVisible(true);
        var oBtnCreateAccount = this.byId("idConfirmCreate");
        oBtnCreateAccount.setVisible(false);
        var oBtnLogInAccount = this.byId("idConfirmLogin");
        oBtnLogInAccount.setVisible(false);
      }
    },
```
## Add a function to get input value from user registration form to your view controller 
```js
     getInputValues: function(){
      var oInputEmail = this.byId("inputEmail");
      var oInputPassword = this.byId("inputPassword");
      return {
        email: oInputEmail.getValue(),
        password: oInputPassword.getValue()
    }
  },
```
## Create a function to handle creating user accounts
Use `Accounts.createUser(options, [callback])` method and call 3 functions to handle show or hide buttons and filter The Task list  
```js
   onCreateAccount: function(){
      var input = this.getInputValues();
      Accounts.createUser({ email: input.email, password: input.password }, (oError) => {
        if (oError){
          if (oError.message === "Email already exists. [403]") {
            MessageBox.information("Email already exists. Please log in with your password");
          } else if (oError.message === "Need to set a username or email [400]") {
            MessageBox.information("Need to provide email address");
          } else {
            MessageBox.error('Error Create Account', {
              details: oError.toString()
            });
          }
        } else {
          // call these functions to hide or show buttons and filter the Task list 
          this.showOrHideAccountButtons();
          this.hideOrShowTaskList();
          this.onFilterTasks();
        }
      });
    },
```
## Create a function to handle user logs in
Use `Meteor.loginWithPassword(user, password, [callback])` method and call 2 functions of show or hide account buttons and filter the Task list from different places if there is no error
```js
    // Users can log in if they already created account
    onLogInAccount: function(){
      Meteor.loginWithPassword(input.email, input.password, (oError) => {
        if(oError){
          if(oError.message === "User not found [403]"){
            MessageBox.information("User not found. Please check your entries or create new account");
          } else if (oError.message === "Incorrect password [403]"){
            MessageBox.information("Incorrect password. Please try again");
          } else {
            MessageBox.error('Error Log In', {
              details: oError.toString()
            });
          }
          // call these functions if no error log in 
        } else if (Meteor.user()){
          var oTasks = this.byId('TaskList');
          oTasks.setVisible(true);
          this.showOrHideAccountButtons();
          this.onFilterTasks();
        }
      });
    },
```
## Filter show completed task against user id 
Create variable `var oUser = Meteor.user()` to get user object and use `oUser._id` to print user Id
```js
    onPressShowCompleted: function(){
      var oUser = Meteor.user();
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
      // if user logs in, show the Task list against user id 
      if (oUser._id){
        aFilters.push(new Filter({
          path: 'userId',
          operator: FilterOperator.EQ,
          value1: oUser._id
        }));
      }
     // Set filter
      var oTaskList = this.byId("TaskList");
      oTaskList.getBinding('items').filter(aFilters);
    }
```
## When creating a task, store the user id of the whoever is logged in against the task 
```js
    onAddTask: function(oEvent){
      var oUser = Meteor.user();
      if (oUser._id){
        var oInput = oEvent.getSource();
        this.oTasks.insert({
          userId: oUser._id,
          text: oInput.getValue(),
          createdAt: new Date()
        });
        oInput.setValue();
      }
    },
```
## Filter the tasks list by the currently signed in user
Add a filter to your view controller
```js
   onFilterTasks: function(){
      var oUser = Meteor.user();
      if (oUser._id) {
        var aFilter = new Filter({
          path: 'userId',
          operator: FilterOperator.EQ,
          value1: oUser._id
        });
        // Apply for filter 
        var oList = this.byId('TaskList');
        oList.getBinding('items').filter(aFilter);
      }
    },
``` 
## Create a function to handle user signs out
Use `Meteor.logout([callback])` method to handle user log out and change state of the form and buttons whether user is logged in or not
```js
    onSignOutAccount: function(){
      Meteor.logout((oError) => {
        if (oError){
          MessageBox.error("Error Logout", {
            details: oError.toString()
          })
        } else {
          //change state of the form and buttons whether user logged in or not
          var oSimpleForm = this.byId("formId");
          oSimpleForm.setVisible(true);
          var oBtnSignOut = this.byId("idConfirmSignOut");
          oBtnSignOut.setVisible(false);
          var oBtnCreateAccount = this.byId("idConfirmCreate");
          oBtnCreateAccount.setVisible(true);
          var oBtnLogInAccount = this.byId("idConfirmLogin");
          oBtnLogInAccount.setVisible(true);
          this.hideOrShowTaskList();
        }
      });
    }
```
## Testing

If all is well, you should see the below when you run your app:
### Log in
Note, if you don't have any accounts yet. Please create new account
![Step 07 Show - Log In](/docs/tutorial/07-AccountsA.png "Step 07 Show - Log In") 

### Log in results 
![Step 07 Show - Log in result](/docs/tutorial/07-AccountsB.png "Step 07 Show - Log in result")

## Next
Further tutorial steps are still being written.  In these steps we will cover:
* Securing your app with Meteor server methods 
* Securing your app with collection publications and subscriptions.

Bookmark this page and check back soon for these new tutorial steps.  In the mean time, the following resources might be useful for learning more about Meteor and/or UI5:

| Resource | Description |
| -------- | ----------- |
| [Meteor Guide](https://guide.meteor.com/) | Best-practice meteor guide.  Although targetted to the MDG supported view layers (Blaze, React and Angular) there is a wealth of information that will be applicable to your meteor-UI5 projects. |
| [Meteor Docs](http://docs.meteor.com/) | API docs. See note re relevance above. |
| [UI5 Development toolkit](https://openui5.hana.ondemand.com/#docs/guide/95d113be50ae40d5b0b562b84d715227.html) | If you are relatively new to UI5 then the Walkthrough Tutorial is an excellent resource and highly recommended.  Note that 99.9% of this tutorials is directly relevant to Meteor-UI5 projects however you should bootstrap UI5 and launch your app or view using the file structure outlined in the Quickstart guide. |