
# Roadmap

## Model
This is the roadmap for the MeteorModel package:

### Next up
1. Fix MeteorModel to handle multiple filters with proper AND/OR conditions (in progress).

### Backlog

1. Package model into meteor-ui5 repo.
1. List binding to array properties of single documents.

### Planned

1. Add support for two-way binding (requires allow write to collections - not Meteor best practice which is update via method).
2. Add TreeBinding model (I think that controls that can use this might be deprecated - check first.)
3. Add multifilter support (where single filter object is itself an array of filters with and/or conditions defined between them).

### Maybe

1. See if Meteor Simple schema can be used to automatically produce metadata for smart controls.

## Demo
This is the roadmap for this demo website:

### Next up

1. Add binding demos page with results (in progress).  This is useful for users but also as a test page for us.

### Backlog
1. Abstract away identical filter / sorter building code from different controllers into one place to better highlight what's actually different.
1. Write Compare Models intro page explaining demos and highlighting just the differences.
1. Fix filter and sorter not working with ODataModel. (EmployeesOData-dbg.controller.js)
1. Remove debugging version in UI5 bootstrap and/or make our code work with debugging on / off.

### Planned
1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.
1. ~~Add comprehensive demo app that showcases many features of UI5 and shows source code for how to do it.~~ (Not sure cost is justified given many UI5 examples available in the UI5 Explored page.  Maybe this website can function as the planned demo if we publish it to a public repo.)
