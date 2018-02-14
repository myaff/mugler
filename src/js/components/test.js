/**
 * Тест
 * @module Test
 */

let result = {
  "a": 0,
  "b": 0,
  "c": 0,
  "d": 0
};
let carousel = $(".owl-carousel.carousel--test");
let testCtrl = $('.js-test-ctrl');
let test = $('.js-test');
let testStart = $('.js-test-welcome');
let testResults = $('.js-test-results');
let testStartBtn = $('.js-test-start');
let testRestartBtn = $('.js-test-restart');

function clearResult () {
  result = {
    "a": 0,
    "b": 0,
    "c": 0,
    "d": 0
  };
}

function isLastSlide() {
  return carousel.find('.owl-item').filter(':last').hasClass('active');
}

function processTest(el, isLastSlide = false) {
  let key = $(el).attr('data-key');
  result[key] += 1;
  if (!isLastSlide) {
    showNext(el);
  } else {
    showResult(result);
  }
}
function showNext(el) {
  setTimeout(function() {
    carousel.trigger('next.owl.carousel');
  }, 300);
}

function extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

function calculateResult(result) {
  let arr = Object.values(result);
  let max = Math.max(...arr);
  let maxKey = extractKeyValue(result, max);
  return maxKey;
}

function showResult(result) {
  let answer = calculateResult(result);
  testResults.find('#result-' + answer).show();
  test.fadeOut(300);
  setTimeout(function () {
    testResults.fadeIn(500);
  }, 400);
}

function startTest () {
  testStart.fadeOut(300);
  setTimeout(function () {
    test.fadeIn(500);
  }, 400);
}

function restartTest () {
  testResults.fadeOut(300);
  testCtrl.each(function() {
    $(this).removeClass('is-active');
  });
  clearResult();
  carousel.trigger('to.owl.carousel', [0, 100]);
  setTimeout(function () {
    testResults.find('.test-result').hide();
    test.fadeIn(500);
  }, 400);
}

/**
 * Инициализация карусели
 */
function init(){

  carousel.owlCarousel({
    items: 1,
    nav: false,
    dots: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    animateOut: 'fadeOut'
  });
  
  testStartBtn.on('click', function () {
    startTest();
  });
  testRestartBtn.on('click', function () {
    restartTest();
  });
  
  testCtrl.on('click', function() {
    $(this).addClass('is-active');
    processTest(this, isLastSlide());
  });
  
}

module.exports = {init};