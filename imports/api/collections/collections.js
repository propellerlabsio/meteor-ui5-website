import { Meteor } from 'meteor/meteor';
import SafeCollection from './SafeCollection.js';

// Sample Northwind data from oData service
export const categories = new SafeCollection('Categories');
export const customers = new SafeCollection('Customers');
export const employees = new SafeCollection('Employees');
export const orders = new SafeCollection('Orders');
export const products = new SafeCollection('Products');
export const shippers = new SafeCollection('Shippers');
export const suppliers = new SafeCollection('Suppliers');

// Internal collections
export const bindingExamples = new SafeCollection('BindingExamples');

// Publish
if (Meteor.isServer) {
  // Publish all employees
  Meteor.publish('employees', () => employees.find());

  // Publish all binding examples
  Meteor.publish('bindingExamples', () => bindingExamples.find());

}
