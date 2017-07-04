# Meteor UI5 Website
This is the code for the [Meteor UI5 Website](http://meteor-ui5.propellerlabs.com), a website for demonstrating and documenting various Meteor UI5 packages.  The packages themselves are published in separate repositories:
* [Mongo Model](https://github.com/propellerlabsio/meteor-ui5-mongo)
* [Debug Helper](https://github.com/propellerlabsio/meteor-ui5-debug)
* [Tutorial (Source)](https://github.com/propellerlabsio/meteor-ui5-mongo-tutorial)
* Accounts UI (under construction)
* Apollo Model (Planned)

## Cloning
Clone this repo with `git clone https://github.com/propellerlabsio/meteor-ui5-website.git`

## Running
1. Change to the project root directory and run `meteor`.
2. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing


## Deploying

### Build Component-preload.js
This file will speed up access to the website when it exists in the `public/webapp` folder.  Note: this file is not desirable while developing and should be:

1. deleted in your developent branch while you are developing, and
1. rebuilt using the below grunt task prior to deploying.

To automatically create this file with grunt, run the following commands from the project root folder:

1. `npm install` 
2. `npm run-script build`.

### Deploying to Scalingo
1. Confirm you have a public `ssh` key configured on your computer and added to your [Scalingo account](https://my.scalingo.com/keys).  
2. Confirm you have Scalingo configured as a remote by entering `git remote --v` in the project root folder.
3. If Scalingo isn't showing in the above, follow [these steps](https://my.scalingo.com/apps/meteor-ui5-website/code) to add it.
4. From the project root, enter `git push scalingo`.

## Roadmap

1. Abstract away identical filter / sorter building code from different Compare Model controllers into utility class to better highlight what's actually different and relevant to the model code.
1. Add packages jsdoc output to website
1. Add roadmap to website
1. Make demo site mobile friendly
