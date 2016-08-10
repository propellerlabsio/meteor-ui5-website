// Special web handlers for stuff in our public /webapp/ folder.  We need these
// to circumvent Meteor's behaviour of returning the Meteor-built
// conglomerated index.html file for every request that doesn't fit within the
// Meteor way of doing things.

import fs from 'fs';

// Get file system path to public folder
const ui5appFolder = "/webapp/";
const publicFolderPath = __meteor_bootstrap__.serverDir + "/../web.browser/app";

WebApp.connectHandlers.use(ui5appFolder, function(req, res, next) {
  if (req.url.indexOf("-dbg") > -1) {
    // Serve requests for debug versions of our UI5 files (contains "-dbg") by
    // returning regular file.  This is a tempoary workaround for issue #2
    // https://github.com/propellerlabsio/meteor-ui5-experimental/issues/2
    // Return regular verson of javascript file if debug version requested
    const substituteURL = req.url.replace("-dbg", "");
    const fileStream = fs.createReadStream(
      publicFolderPath +
      ui5appFolder +
      substituteURL
    );
    fileStream.on('begin', function(data){
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
    });
    fileStream.on('data', function (data) {
        res.write(data);
    });
    fileStream.on('end', function() {
        res.end();
    });
    fileStream.on('error', function(err) {
      res.writeHead(404);
      res.end();
    });
  } else if (req.url.substr(req.url.length - 1) === "/") {
    // Return directory listing
    const dirPath = publicFolderPath + ui5appFolder + req.url;
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
