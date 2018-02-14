let DeviceDetection = require("./components/device-detection");
let Helpers = require("./components/helpers");
//let Carousel = require("./components/carousel");
//let Modal = require("./components/modal");
//let Anchor = require("./components/anchor");
let Test = require("./components/test");
let Animation = require("./components/animation");

$(document).ready(function(){
  
  DeviceDetection.run();
  Helpers.init();
  //Carousel.init();
  //Modal.init();
  //Anchor.init();
  Test.init();
  Animation.init();
  
});


/**
 * Список экспортируемых модулей, чтобы иметь к ним доступ извне
 * @example
 * Main.Form.isFormValid();
 */
module.exports = {
  DeviceDetection,
  Helpers,
  //Carousel,
  //Modal,
  //Anchor,
  Test,
  Animation
};