import {
  Meteor
} from 'meteor/meteor';
import {
  categories,
  customers,
  employees,
  orderDetails,
  orders,
  products,
  shippers,
  suppliers
} from '../../api/collections/collections.js';


Meteor.startup(() => {
  // code to run on server at startup
  loadFileIntoCollection('fixtures/Categories.json', categories, "CategoryID");
  loadFileIntoCollection('fixtures/Customers.json', customers, "CustomerID");
  loadFileIntoCollection('fixtures/Employees.json', employees, "EmployeeID");
  loadFileIntoCollection('fixtures/Order_Details.json', orderDetails);
  loadFileIntoCollection('fixtures/Orders.json', orders, "OrderID");
  loadFileIntoCollection('fixtures/Products.json', products, "ProductID");
  loadFileIntoCollection('fixtures/Shippers.json', shippers, "ShipperID");
  loadFileIntoCollection('fixtures/Suppliers.json', suppliers, "SupplierID");
});

function loadFileIntoCollection(file, collection, idProperty) {
  // TODO Remove
  // collection.remove({});

  if (!collection.find().count()) {
    console.log(`loading ${file}...`);
    const jsonFile = JSON.parse(Assets.getText(file));

    // Clean up data
    jsonFile.forEach((doc, index) => {
      // Insert converted document
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        idProperty,
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            collection.insert(cleaned);
          }
        }
      );
    });
  }
}
