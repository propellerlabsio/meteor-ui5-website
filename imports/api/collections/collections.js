import { Meteor } from 'meteor/meteor';
import SafeCollection from './SafeCollection.js';

export const categories = new SafeCollection('Categories');
export const customers = new SafeCollection('Customers');
export const employees = new SafeCollection('Employees');
export const orderDetails = new SafeCollection('Order_details');
export const orders = new SafeCollection('Orders');
export const products = new SafeCollection('Products');
export const shippers = new SafeCollection('Shippers');
export const suppliers = new SafeCollection('Suppliers');

// Publish
if (Meteor.isServer) {
  // Publish all categories
  Meteor.publish('categories', () => categories.find());

  // Publish all employees
  Meteor.publish('employees', () => employees.find());
}
