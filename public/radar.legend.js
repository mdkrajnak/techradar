// The current legend is single ordered list, which we use to get the correct 1..N numbering for each entry.
// List placement is controlled by CSS styles.
// Note there are <p> elements embedded in the list which subset it based on the sectors.

/* global $, radar */
radar.legend = (function() {
    var init = function() {

        // Import names from modules.
        var sectors = radar.data.get();
        var name2abbr = radar.utils.name2abbr;

        var legend = $("<ul/>");

        $.each(sectors, function(index, quad) {
            legend.append("<p><b>" + quad.quadrant + "</b></p>");
            $.each(quad.items, function(index, val) {
                legend.append("<li>" + name2abbr(val.name) + ": " + val.name + "</li>");
            });
        });

        legend.appendTo("#legend");
    };

    return { init: init };
}());