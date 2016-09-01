/**
 * Show loading screen while UI5 is being loaded 
 * 
 * File contents copied from http://openui5.blogspot.com/2014/04/splash-screen.html?m=1
 */
function appInit() {
  if (window.cordova) {
    // cordova specific launch code

  } else {
    new sap.m.Page("page", {
      title: "Custom Splash Screen",
    });
  }
}


function appReady() {
  // remove splash screen from DOM
  // placeAt('content','only') only removes,
  // but does not destroy elements!
  $("#splash-screen").remove();
  // launch application
  appInit();
}


// need to be executed in the onload event to
// ensure all libraries are properly loaded
window.onload = function () {
  if (window.cordova) {
    document.addEventListener("deviceready", appReady, false);
  } else {
    // uncomment next line to enable app start
    // appReady();
  }
}