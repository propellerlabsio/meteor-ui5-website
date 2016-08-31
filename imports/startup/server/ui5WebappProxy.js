// Special web handlers for stuff in our public /webapp/ folder.  We need these
// to circumvent Meteor's behaviour of returning the Meteor-built
// conglomerated index.html file for every request that doesn't fit within the
// Meteor way of doing things.

import fs from 'fs';

// Get file system path to public folder
const publicFolderPath = __meteor_bootstrap__.serverDir + "/../web.browser/app";
const ui5demoFolder = "/webapp/demo/";

// Connect handlers for demo folders
WebApp.connectHandlers.use(ui5demoFolder, function(req, res, next) {
  // Return directory listing for demo folders on request (needed by DemoViewer
  // control to show all source files in directory.)
  if (req.url.substr(req.url.length - 1) === "/") {
    const dirPath = publicFolderPath + ui5demoFolder + req.url;
    fs.readdir(dirPath, (error,files) => {
      if (error){
        console.log(error);
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text' });
        res.write(files.join("\n"));
        res.end();
      }
    });
  } else {
    // Not handled by us - pass request to next handler
    next();
  }
});
