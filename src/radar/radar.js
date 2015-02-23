/*jslint browser: true, white: true, vars: true */
/*global $ */

/*
 * Instantiate the radar module.
 */
var radar = (function () {
    'use strict';

    // Load default data.
    // If current page loaded from file use built-in default data,
    // otherwise load default radar from remote.
    var loadDefault = function(cb) {
        var protocol = $(location).attr('protocol');

        if (protocol === 'file:') {
            // @todo find a way to load it from file?
            cb(radar.data.get());
        }
        else {
            $.getJSON('../radar/radars/radar.json', function(data) {
                cb(data);
            });
        }
    };

    // Top level app initialization.
//    var init = function () {
//        // Start to load the data right away.
//        // Pass a callback to execute when the load completes.
//        loadDefault(function(data) {
//            radar.data.setIds(data.sectors);
//            radar.data.set(data);
//
//            // Complete when the document is ready.
//            $(function() {
//                radar.utils.init();
//                radar.view.init();
//                radar.legend.init();
//                radar.menu.init();
//            });
//        });
//    };

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
