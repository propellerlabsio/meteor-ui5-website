# UI Accounts

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
 Add registration form to your view in `webapp/Tasks.view.xml`
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
## Hide or Show the Task list whether user is logged in or not
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
## Add a function to get input value from user to your view controller 
Add a function to get input value in `webapp/Tasks.controller.js`
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
## Create a function to handle user logs in
Use `Meteor.loginWithPassword(user, password, [callback])` method and call 2 functions of show or hide account buttons and filter the Task list from different places if log in has no error
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
## Store user Id against the tasks 
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
## Filter the Task list by user Id
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
## Create a function to handle creating user accounts
Use `Accounts.createUser(options, [callback])` method and call 3 functions from different places 
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