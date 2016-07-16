import { Meteor } from 'meteor/meteor';
import { categories, customers, employees, orderDetails, orders, products, shippers, suppliers } from '../../api/collections/collections.js';


Meteor.startup(() => {
  // code to run on server at startup
  loadFileIntoCollection('fixtures/Categories.json', categories);
  loadFileIntoCollection('fixtures/Customers.json', customers);
  loadFileIntoCollection('fixtures/Employees.json', employees);
  loadFileIntoCollection('fixtures/Order_Details.json', orderDetails);
  loadFileIntoCollection('fixtures/Orders.json', orders);
  loadFileIntoCollection('fixtures/Products.json', products);
  loadFileIntoCollection('fixtures/Shippers.json', shippers);
  loadFileIntoCollection('fixtures/Suppliers.json', suppliers);
});

function loadFileIntoCollection(file, collection) {
  // TODO Remove
  // collection.remove({});

  if (!collection.find().count()) {
    console.log(`loading ${file}...`);
    const jsonFile = JSON.parse(Assets.getText(file));

    // Clean up data
    jsonFile.forEach((doc, index) => {
      if (index === 1) {
        // Insert converted document
        const converted = Meteor.call('fixtures.cleanDocument', doc, (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            collection.insert(cleaned);
          }
        });
      }
    });
  }
}
