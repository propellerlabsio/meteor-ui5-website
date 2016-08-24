# Meteor UI5 Website

## Project folder structure
| Path | Purpose |
| ---- | ------- |
| `dist` | The website.  All `meteor` commands should be run in this folder. Note we don't build the JavaScript in this folder from source but instead rely on the meteor build tool. We have the website in this separate `dist` folder so we don't have to bundle source art assets with the distribution when we deploy it to the web server.  This structure will also allow us to incorporate grunt tasks into the build or distribution process at a later time. |
| `src` | All source files used that go through some process before arriving in the `dist` folder. |
| `src/art` | Native artwork source files from which `.png` files and other images are produced. |

## Roadmap

This is the roadmap for the Meteor UI5 website:

### Next up

1. Build tutorial around ToDo's - seems to be industry standard simple demo/tutorial app.

### v0.1

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Add Docs page with:
  * Embedded jsdocs output from model files
  * Roadmap

### v0.2+

1. Make demo site mobile friendly
