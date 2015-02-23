/**
 * Implements sliding menu logic.
 */

/*jslint browser: true, white: true, vars: true */
/*global $, radar */

radar.menu = (function(){
    'use strict';

    var body;
    var mask;

    var clearMsg = function() {
        $('#nav-msg').text('');
    };

    var setMsg = function(text) {
        $('#nav-msg').text(text);
    };
    
    var openMenu = function() {
        body.className = 'smr-open';
        $('#container').append(mask);
    };
    
    var closeMenu = function() {
        body.className = '';
        $('#container > .mask').remove();
    };
        
    var init = function() {
        body = document.body;
        mask = document.createElement('div');
        mask.className = 'mask';

        var menuOpen = document.querySelector('#open-menu-control');
        var menuClose = document.querySelector('#close-menu-control');
        
        /* slide menu right */
        menuOpen.addEventListener('click', function() {
            clearMsg();
            openMenu();
        } );

        /* hide active menu if mask is clicked */
        mask.addEventListener('click', function() {
            closeMenu();
        } );

        /* hide active menu if close menu button is clicked */
        menuClose.addEventListener('click', function() {
            closeMenu();
        } );
    };
    
    return { init: init, openMenu: openMenu, closeMenu: closeMenu, clearMsg: clearMsg, setMsg: setMsg };
}());