# Meteor UI5

## Introduction

Coming soon.

## Roadmap

### Model

This is the roadmap for the MeteorModel package:

#### Next up

1. ~~Fix MeteorModel to handle multiple filters with proper AND/OR conditions (in progress).~~ (Basic support coded to mimic OData/JSON models - confirm approach with David before closing issue.) See [Issue 1](https://github.com/propellerlabsio/meteor-ui5-experimental/issues/1)

#### Backlog

1. Package model into meteor-ui5 repo.
1. Optimize performance of observe changes (records ~~added~~, changed & removed )- current hack of refreshing all for every change is killing apps on anything more than 50 or so records. (NOTE: added fixed 31/7.)
1. List binding to array properties of single documents.
1. Add support for paging.  UI5 instantiates multiple control objects for every record in a list.  Need to limit the amount of front-end memory consumed when paging through large lists.
1. Document standard model setSizeLimit method and our default size limit (currently 1000). This affects list bindings.  Not even sure if we need a size limit but the other models have it - even JSON  - so felt safer to do it but just make it very big.  In principle, once we introduce paging, we shouldn't be showing any more than 100 bindings at a time in a list page.
1. Document meteor version requirements (Meteor ie v1.4) - restriction is caused by support for later Mongo version in v1.4 and query operators such as $eq.  Also add error checking in Model to test this.


#### Planned

1. Add support for two-way binding (requires allow write to collections - not Meteor best practice which is update via method).
2. Add TreeBinding model (I think that controls that can use this might be deprecated - check first.)
3. Add multifilter support (where single filter object is itself an array of filters with and/or conditions defined between them).

#### Maybe

1. See if we can't add the equivalent of OData navigation URLs to our Meteor Model concept.  This would be useful for example where an `/Orders` record stores only the `EmployeeID` of the employee who took the order but we'd like to show the Employee name in a list of orders.   We may be able to make use of query parameters for this purpose - e.g. `/Employees/FirstName?_id=EmployeeID`.  Although the context binding is to the `/Orders` collection it would decipher the request and return the data from the `/Employees` collection.
1. Allow mongo selectors and option.sorts to be specified directly in list binding path instead of using UI5 sorters and filters.  E.g. path could be "\Employees({FirstName: 'Peter'})".  This would likely only appeal to people coming to UI5 from Meteor (questionable there'd be that many given how entrenched Blaze/React are) and would lose many of the benefits of consistency between the different UI5 models.

### Demo

This is the roadmap for this demo website:

#### Next up

1. Add binding demos page with results (in progress).  This is useful for users but also as a test page for us.

#### Backlog

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Make our code work with UI5 debug sources turned on or off.  Currently if on it fails looking for "-dbg" versions of our source files  [Issue 2](https://github.com/propellerlabsio/meteor-ui5-experimental/issues/2).
1. Automatically incorporate this README into the demo site.

#### Planned

1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.
1. ~~Add comprehensive demo app that showcases many features of UI5 and shows source code for how to do it.~~ (Not sure cost is justified given many UI5 examples available in the UI5 Explored page.  Maybe this website can function as the planned demo if we publish it to a public repo.)
