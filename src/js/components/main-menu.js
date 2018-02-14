/**
 * MainMenu
 * @module MainMenu
 */

let mainMenu = {
  el: $('.header-menu'),
  btn: $('.btn-menu'),
  state: false
}
let dropdownMenu = {
  el: $('.top-nav-dropdown'),
  btn: $('.top-nav-dropdown__activator'),
  dropdown: $('.top-nav-dropdown__menu'),
  state: false
}

function checkMenu (menu, menuState) {
  menu.state = menuState;
  if (menuState) {
    openMenu(menu);
  } else {
    closeMenu(menu);
  }
}

function openMenu (menu) {
  menu.state = true;
  menu.btn.addClass('is-opened');
  if (menu.hasOwnProperty('dropdown')) {
    menu.dropdown.slideDown(500);
  } else {
    menu.el.fadeIn(500);
  }
  menu.el.trigger('opened');
}

function closeMenu (menu) {
  menu.state = false;
  menu.btn.removeClass('is-opened');
  if (menu.hasOwnProperty('dropdown')) {
    menu.dropdown.slideUp(500);
  } else {
    menu.el.fadeOut(300);
  }
  menu.el.trigger('closed');
}

/**
 * инициализация меню
 * @example
 * MainMenu.init();
 */
function init(){
  
  let isSmall = Main.DeviceDetection.isMobile() || Main.DeviceDetection.isTablet();
  
  // set initial state
  checkMenu(mainMenu, !isSmall);
  checkMenu(dropdownMenu, !isSmall);
  // set state after resize
  $(window).on('resizeend', function () {
    isSmall = Main.DeviceDetection.isMobile() || Main.DeviceDetection.isTablet();
    checkMenu(mainMenu, !isSmall);
    checkMenu(dropdownMenu, !isSmall);
  });
  
  // toggle state by btn
  mainMenu.btn.on('click', function (e) {
    e.stopPropagation();
    checkMenu(mainMenu, !mainMenu.state);
  });
  dropdownMenu.btn.on('click', function (e) {
    e.stopPropagation();
    checkMenu(dropdownMenu, !dropdownMenu.state);
  });
  
  // close by click outside
  $('.layout').on('click', function (e) {
    console.dir(e);
    if (!mainMenu.el.find(e.target).length) {
      closeMenu(mainMenu);
    }
    if (!dropdownMenu.el.find(e.target).length) {
      closeMenu(dropdownMenu);
    }
  });
  
  // stop bubbling click inside
  mainMenu.el.on('click', function (e) {
    e.stopPropagation();
  })
  dropdownMenu.el.on('click', function (e) {
    e.stopPropagation();
  })
  
}

module.exports = {init, checkMenu};