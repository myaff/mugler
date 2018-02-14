/**
 * Карусель
 * @module Carousel
 */
// default
let carouselDefault = $(".owl-carousel.carousel--default");
let carouselDefaultOptions = {
  items: 1,
  nav: true,
  navText: ['<svg class="icon"><use xlink:href="#arrow-left"/></svg>', '<svg class="icon"><use xlink:href="#arrow-right"/></svg>'],
  dots: true,
  loop: true,
  mouseDrag: false,
  animateOut: 'fadeOut'
}
// mobile only
let carouselMobile = $(".owl-carousel.carousel--mobile");
let carouselMobileOptions = {
  items: 1,
  nav: true,
  dots: false,
  navText: ['<div class="prev"></div>', '<div class="next"></div>'],
  dots: false,
  mouseDrag: false
}

function carouselInitByCondition(carousel, options, condition) {
  if (condition) {
    carousel.owlCarousel(options);
  } else {
    carousel.trigger('destroy.owl.carousel');
  }
}

/**
 * Инициализация карусели
 */
function init(){
  carouselDefault.owlCarousel(carouselDefaultOptions);
  carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobile());
  
  // init on resize
  $(window).on('resizeend', function(){
    carouselInitByCondition(carouselMobile, carouselMobileOptions, Main.DeviceDetection.isMobile());
  });
}

module.exports = {init};