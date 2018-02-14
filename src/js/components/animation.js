/**
 * Переключение классов по различным событиям
 * @module Animation
 */

let scrollAnimationBlocks = $('.a-scroll-box');
let parallaxBlocks = $('.a-parallax-box');
 
function addClassTogglerScene (el, controller) {
  new ScrollMagic.Scene({
    triggerElement: el,
    triggerHook: 0.7
  })
  .setClassToggle(el, 'animate')
  .addTo(controller);
}

function addClassTogglerController (animationBlocks) {
  let controller = new ScrollMagic.Controller();
  animationBlocks.each(function(){
    let closestContainer = $(this).closest('[class*="grid"]:not([class*="col"])')[0];
    if (closestContainer.offsetTop < window.outerHeight) {
      $(this).children('[class*="a-"]').css({'transition': 'none'});
      let self = this;
      let delay = 250 * $(closestContainer).index();
      $(self).data('timer', setTimeout(function () {
        $(self).children('[class*="a-"]').css({'transition': ''});
        $(self).addClass('animate');
      }, 250));
    } else {
      let aDelay = 0;
      if ($(this).attr('data-a-delay') !== undefined) {
        aDelay = Number($(this).attr('data-a-delay')) * 1000;
      }
      setTimeout(addClassTogglerScene, aDelay, this, controller);
    }
  });
}

function getFromPosition (el, defaultPosition = 0){
  return (el.attr('data-parallax-from') !== undefined) ? Number(el.attr('data-parallax-from')) : defaultPosition;
}
function getToPosition (el, defaultPosition = 0){
  return (el.attr('data-parallax-to') !== undefined) ? Number(el.attr('data-parallax-to')) : defaultPosition;
}

function getParallaxTimeline (el) {
  let tween = new TimelineMax();
  let tweensArr = [];
  if ($(el).find('.a-parallax-back')) {
    let targetEl = $(el).find('.a-parallax-back');
    let fromPos = getFromPosition(targetEl, -20);
    let toPos = getToPosition(targetEl);
    tweensArr.push(TweenMax.fromTo(targetEl, 1, {yPercent: fromPos}, {yPercent: toPos, ease: Linear.easeNone}));
  }
  if ($(el).find('.a-parallax-middle')) {
    let targetEl = $(el).find('.a-parallax-middle');
    let fromPos = getFromPosition(targetEl, -15);
    let toPos = getToPosition(targetEl);
    tweensArr.push(TweenMax.fromTo(targetEl, 1, {yPercent: fromPos}, {yPercent: toPos, ease: Linear.easeNone}));
  }
  if ($(el).find('.a-parallax-front')) {
    let targetEl = $(el).find('.a-parallax-front');
    let fromPos = getFromPosition(targetEl, -10);
    let toPos = getToPosition(targetEl, 10);
    tweensArr.push(TweenMax.fromTo(targetEl, 1, {yPercent: fromPos}, {yPercent: toPos, ease: Linear.easeNone}));
  }
  tween.add(tweensArr);
  return tween;
}

function addParallaxScene (el, tween, controller) {
  new ScrollMagic.Scene({
    triggerElement: el,
    triggerHook: 0,
    duration: $(el).height()
  })
  .setTween(tween)
  .addTo(controller);
}

function addParallaxController (animationBlocks) {
  let controller = new ScrollMagic.Controller();
  animationBlocks.each(function(){
    let tween = getParallaxTimeline(this);
    addParallaxScene(this, tween, controller);
  });
}

function init () {
  if (scrollAnimationBlocks.length > 0 && $(window).width() > 1024){
    $('html').addClass('is-animating');
    addClassTogglerController(scrollAnimationBlocks);
  }
  if (parallaxBlocks.length > 0 && $(window).width() > 1024){
    $('html').addClass('is-animating');
    addParallaxController(parallaxBlocks);
  }
}

module.exports = {init};