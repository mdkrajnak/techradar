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
            $.getJSON('/radars/read/radar.json', function(data) {
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

                // Compute a size leaving 350 pixels for the legend and 250px as a minimum size.
                var height = $(window).width(),
                    width = $(window).width(),
                    radarSize = Math.max(250, Math.min(width, height) - 350);

                radar.utils.init(radarSize);
                radar.view.init(radarSize);
                radar.legend.init();
            });
        });
    };

    return { init: init };
}());
