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
    jsonFile.forEach((doc) => {
      if (doc.hasOwnProperty("_id")){
        // Convert id's to strings
        if (typeof doc._id !== "string"){
          doc._id = doc._id.toString();
        }
      }

      // Delete metadata property
      delete doc.__metadata;

      // Sub-object Property sepecific conversions
      Object.getOwnPropertyNames(doc).forEach((propName) => {
        var prop = doc[propName];

        // Ignore nulls
        if (prop) {
          // Convert dates
          if (looksLikeMSDate(prop)){
            doc[propName] = parseMSDate(prop);
          }

          // Remove navigation properties
          if (typeof prop === "object"){
            if (prop.hasOwnProperty('__deferred')) {
              delete doc[propName];
            }
          }
        }

      });

      // Insert converted document
      collection.insert(doc);
    });
  }
}

// Handling of Microsoft AJAX Dates, formatted like '/Date(01238329348239)/'
function looksLikeMSDate(s) {
    return /^\/Date\(/.test(s);
}

function parseMSDate(s) {
    // Jump forward past the /Date(, parseInt handles the rest
    return new Date(parseInt(s.substr(6)));
}
