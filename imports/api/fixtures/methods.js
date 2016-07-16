import { Meteor } from 'meteor/meteor';


Meteor.methods({
  'fixtures.getJSONfile'(fileName){
    var text = Assets.getText(fileName);
    var converted = [];
    JSON.parse(text).forEach((document) => {
      converted.push(Meteor.call('fixtures.cleanDocument',document));
    });
    return converted;
  },

  'fixtures.cleanDocument'(doc){
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

        // Convert microsoft images by removing proprietory OLE headers
        // per https://groups.google.com/forum/#!topic/odata4j-discuss/6amvlFgExEU
        if (propName === "Picture" || propName === "Photo"){
          doc[propName] = prop.substring(104);
        }
      }
    });

    return doc;
  }
});

// Handling of Microsoft AJAX Dates, formatted like '/Date(01238329348239)/'
function looksLikeMSDate(s) {
    return /^\/Date\(/.test(s);
}

function parseMSDate(s) {
    // Jump forward past the /Date(, parseInt handles the rest
    return new Date(parseInt(s.substr(6)));
}
