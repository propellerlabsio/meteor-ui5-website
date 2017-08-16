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
  }
```
## Add Meteor.loginWithPassword to your view controller
Create log in function and add Meteor.loginWithPassword into it in `webapp/Tasks.controller.js`
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
        } 
      });
    }
```
