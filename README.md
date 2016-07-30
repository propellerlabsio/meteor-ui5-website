# Meteor UI5

## Introduction
Coming soon.

## Roadmap

### Model
This is the roadmap for the MeteorModel package:

#### Next up
1. Fix MeteorModel to handle multiple filters with proper AND/OR conditions (in progress).

#### Backlog

1. Package model into meteor-ui5 repo.
1. Optimize performance of observe changes (records ~~added~~, changed & removed )- current hack of refreshing all for every change is killing apps on anything more than 50 or so records. (NOTE: added fixed 31/7.)
1. List binding to array properties of single documents.
1. Add support for paging.  UI5 instantiates multiple control objects for every record in a list.  Need to limit the amount of front-end memory consumed when paging through large lists.

#### Planned

1. Add support for two-way binding (requires allow write to collections - not Meteor best practice which is update via method).
2. Add TreeBinding model (I think that controls that can use this might be deprecated - check first.)
3. Add multifilter support (where single filter object is itself an array of filters with and/or conditions defined between them).

#### Maybe

1. See if Meteor Simple schema can be used to automatically produce metadata for smart controls.
1. Allow mongo selectors and option.sorts to be specified directly in list binding path instead of using UI5 sorters and filters.  E.g. path could be "\Employees({FirstName: 'Peter'})".  This would likely only appeal to people coming to UI5 from Meteor (questionable there'd be that many given how entrenched Blaze/React are) and would lose many of the benefits of consistency between the different UI5 models.

### Demo
This is the roadmap for this demo website:

#### Next up

1. Add binding demos page with results (in progress).  This is useful for users but also as a test page for us.

#### Backlog
1. Abstract away identical filter / sorter building code from different controllers into one place to better highlight what's actually different.
1. Write Compare Models intro page explaining demos and highlighting just the differences.
1. Fix filter and sorter not working with ODataModel. (EmployeesOData-dbg.controller.js)
1. Remove debugging version in UI5 bootstrap and/or make our code work with debugging on / off.
1. Automatically incorporate this README into the welcome page.

#### Planned
1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.
1. ~~Add comprehensive demo app that showcases many features of UI5 and shows source code for how to do it.~~ (Not sure cost is justified given many UI5 examples available in the UI5 Explored page.  Maybe this website can function as the planned demo if we publish it to a public repo.)
