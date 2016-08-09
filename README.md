# Meteor UI5

## Introduction

Coming soon.

## Roadmap

### Model

This is the roadmap for the MeteorModel package:

#### Next up

1. List binding to array properties of single documents.

#### v0.1

1. Add multifilter support (where single filter object is itself an array of filters with and/or conditions defined between them).
1. Clean up & complete jsdoc comments in model code.
1. Add license files and headers.
1. Package model into meteor-ui5 repo.
1. Add support for paging.  UI5 instantiates multiple control objects for every record in a list.  Need to limit the amount of front-end memory consumed when paging through large lists.

#### v0.2

1. Add support for two-way binding (requires allow write to collections - not Meteor best practice which is update via method).

#### Maybe

1. Add TreeBinding model (I think that controls that can use this might be deprecated - check first.)

### Demo

This is the roadmap for this demo website:

#### Next up

1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.
1. Add intro page (Chhunly)

#### v0.1

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Automatically incorporate this README into the demo site.
1. Add license files to code. Confirm with David whether or not the demo site itself will be a public repo.
1. Add Docs page with embedded jsdocs output for model files

#### v0.2

1. Make demo site mobile friendly
