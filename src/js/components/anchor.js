/**
 * Anchor scrolling
 * @module Anchor
 */

function scrollToAnchor(newpos) {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos, offsetY: 200}});
}


/**
 * инициализация событий якорного меню
 * @example
 * Anchor.init();
 */
function init(){
    
  $('.js-anchor').click(function(e){
    let id = $(this).attr('href');
    let scrollToID = id + '-title';
    if (!!$(this).closest('.modal')) {
      Main.Modal.closeModal($(this).closest('.modal'));
    }
    if ($(id).length > 0 && $(scrollToID).length > 0) {
      e.preventDefault();
      
      setTimeout(scrollToAnchor, 400, scrollToID);
      ;
      
      //if (window.history && window.history.pushState) {
      //  history.pushState("", document.title, id);
      //}
    }
  });
}

module.exports = {init};