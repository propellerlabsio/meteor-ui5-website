# Meteor UI5

## Introduction

Coming soon.

## Roadmap

### Package

This is the roadmap for the `meteor-ui5` package:

#### Next up


#### v0.1

1. Clean up & complete jsdoc comments in model code.
1. Add license files and headers.
1. Extract package code into `meteor-ui5` repo.

#### v0.2

1. Add multifilter support (where single filter object is itself an array of filters with and/or conditions defined between them).
1. Filtering/sorting on list binding to array properties of single documents.
1. Add support for two-way binding (requires allow write to collections - not Meteor best practice which is update via method).
1. Add support for paging.  UI5 instantiates multiple control objects for every record in a list.  Need to limit the amount of front-end memory consumed when paging through large lists.
1. Incorporate UI5 webapp into meteor build process.
1. Build Meteor UI5 version of accounts-ui for integration with unified shell.

#### Maybe

1. Add TreeBinding model

### Website

This is the roadmap for the Meteor UI5 website:

#### Next up

1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.
1. Add intro page (Chhunly)
1. Rework as unified shell app (Chhunly)

#### v0.1

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Add license files to code. Confirm with David whether or not the demo site itself will be a public repo.
1. Add Docs page with:
  * Embedded jsdocs output from model files
  * Roadmap

#### v0.2

1. Make demo site mobile friendly
