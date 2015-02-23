/*jslint browser: true, white: true, vars: true */
/*global $ */

/*
 * Instantiate the radar module.
 */
var radar = (function () {
    'use strict';

    var init = function() {
        $(function() {
            radar.utils.init();
            radar.view.init();
            radar.legend.init();
            radar.menu.init();
        });
    };
    
    return { init: init };
}());
