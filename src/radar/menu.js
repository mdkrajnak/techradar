/**
 * Implements sliding menu logic.
 */

$(function(){

    var body = document.body;
    var mask = document.createElement('div');
    var menuOpen = document.querySelector('#open-menu-control');
    var menuClose = document.querySelector('#close-menu-control');

    mask.className = 'mask';

    /* slide menu right */
    menuOpen.addEventListener('click', function() {
        body.className = 'smr-open';
        $('#container').append(mask);
    } );

    /* hide active menu if mask is clicked */
    mask.addEventListener('click', function() {
        body.className = '';
        $('#container > .mask').remove();
    } );

    /* hide active menu if close menu button is clicked */
    menuClose.addEventListener('click', function() {
        body.className = '';
        $('#container > .mask').remove();
    } );

});