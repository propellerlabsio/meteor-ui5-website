// https://github.com/meteor/meteor/issues/6630
import fs from 'fs';

// Get file system path to public folder
const ui5appFolder = "/webapp/";
const publicFolderPath = __meteor_bootstrap__.serverDir + "/../web.browser/app";

// Serve requests for debug versions of our UI5 files (contains "-dbg" by returning
// regular file.  This is a tempoary workaround for issue #2
// https://github.com/propellerlabsio/meteor-ui5-experimental/issues/2
WebApp.connectHandlers.use(ui5appFolder, function(req, res, next) {
  if (req.url.indexOf("-dbg") > -1) {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    const substituteURL = req.url.replace("-dbg", "");
    const fileStream = fs.createReadStream(
      publicFolderPath +
      ui5appFolder +
      substituteURL
    );
    fileStream.on('data', function (data) {
        res.write(data);
    });
    fileStream.on('end', function() {
        res.end();
    });
  } else {
    // Not handled by us - pass request to next handler
    next();
  }
});
