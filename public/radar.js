/*jslint
  browser: true
 */

/*global $ */

var radar = (function () {
    'use strict';
    
    var init = function (w, h) {
        // Compute a size leaving 350 pixels for the legend and 500px as a minimum size.
        var radarSize = Math.max(500, Math.min(w, h) - 350);
        
        radar.utils.init(radarSize);
        radar.view.init(radarSize);
        radar.legend.init();
    };

    return { init: init };
}());