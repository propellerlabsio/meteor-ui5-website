# Meteor UI5 Website
This is the code for the [Meteor UI5 Website](http://meteor-ui5.propellerlabs.io) a website for demonstrating and documenting various Meteor UI5 packages.  The packages themselves are published in separate repositories.

## Project folder structure
| Path | Purpose |
| ---- | ------- |
| `dist` | The website.  All `meteor` commands should be run in this folder. Note we don't build the JavaScript in this folder from source but instead rely on the meteor build tool. We have the website in this separate `dist` folder so we don't have to bundle source art assets with the distribution when we deploy it to the web server.  This structure will also allow us to incorporate grunt tasks into the build or distribution process at a later time. |
| `src` | All source files used that go through some process before arriving in the `dist` folder. |
| `src/art` | Native artwork source files from which `.png` files and other images are produced. |

## Roadmap

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Add Docs page with:
  * Embedded jsdocs output from model files
  * Roadmap
1. Make demo site mobile friendly
