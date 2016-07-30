import { Meteor } from 'meteor/meteor';
import SafeCollection from './SafeCollection.js';

// Sample Northwind data from oData service.  May not need all of these but
// leaving in at present.
export const categories = new SafeCollection('Categories');
export const customers = new SafeCollection('Customers');
export const employees = new SafeCollection('Employees');
export const orders = new SafeCollection('Orders');
export const products = new SafeCollection('Products');
export const shippers = new SafeCollection('Shippers');
export const suppliers = new SafeCollection('Suppliers');
export const demos = new SafeCollection('Demos');

// Publish
if (Meteor.isServer) {
  // Publish all demos
  Meteor.publish('demos', () => demos.find());

  // Publish all employees
  Meteor.publish('employees', () => employees.find());

  // Publish  orders
  Meteor.publish('orders', () => {
    var cursor = orders.find();
    // TODO work out why below message is showing in meteor server console - ie
    // publication seems to be running even though it should never be called
    // on the server?
    console.log("Publishing " + cursor.count() + " orders.");
    return cursor;
  });

}
