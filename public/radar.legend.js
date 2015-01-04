/*jslint white: true, vars: true */
// The current legend is single ordered list, which we use to get the correct 1..N numbering for each entry.
// List placement is controlled by CSS styles.
// Note there are <p> elements embedded in the list which subset it based on the sectors.

/*global $, radar */

radar.legend = (function() {
    'use strict';

    // Convience name for util function.
    var name2abbr = radar.utils.name2abbr;

    var mklegend = function(sectors) {
        var legend = $("<ul/>");

        var radiusSort = function(a, b) { return a.pc.r - b.pc.r; };

        $.each(sectors, function(index, quad) {
            legend.append("<p><b>" + quad.quadrant + "</b></p>");
            $.each(quad.items.sort(radiusSort), function(index, val) {
                legend.append("<li>" + name2abbr(val.name) + ": " + val.name + "</li>");
            });
        });

        return legend;
    };

    var init = function() {
        var sectors = radar.data.get();
        var legend = mklegend(sectors);

        legend.appendTo("#legend");
    };

    var update = function() {
        var sectors = radar.data.get();
        var legend = mklegend(sectors);

        $('#legend ul').replaceWith(legend);
    };

    return { init: init, update: update };
}());