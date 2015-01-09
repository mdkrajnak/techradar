/*jslint
  browser: true
  white: true
  vars: true
 */

/*global $ */

var radar = (function () {
    'use strict';

    // Load default file from remote server.
    // Checks to see if page was loaded from file://
    var load = function(cb) {
        var protocol = $(location).attr('protocol');
        console.log('proto: ' + protocol);

        if (protocol !== 'file:') {
            $.getJSON('radars/radar.json', function(data) {
                cb(data);
            });
        }
        else {
            // Use default data.
            // @todo find a way to load it from file?
            cb(radar.data.get());
        }
    };

    // Top level app initialization.
    var init = function (w, h) {

        // Launch the data request before document is ready.
        load(function(data) {
            radar.data.update(data);

            // Complete initialization only if the document is ready.
            $(function() {
                radar.utils.init();
                radar.view.init();
                radar.legend.init();
            });
        });
    };

    return { init: init };
}());
