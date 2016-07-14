import { Meteor } from 'meteor/meteor';
import SafeCollection from './SafeCollection.js';

export const categories = new SafeCollection('categories');
export const customers = new SafeCollection('customers');
export const employees = new SafeCollection('employees');
export const orderDetails = new SafeCollection('order_details');
export const orders = new SafeCollection('orders');
export const products = new SafeCollection('products');
export const shippers = new SafeCollection('shippers');
export const suppliers = new SafeCollection('suppliers');

// Publish
if (Meteor.isServer) {
  // Publish all languages
  Meteor.publish('employees', () => employees.find());
}
