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
                legend.append("<li><img class='entry-img' src='bullet-16.png' alt='" + val.name + "'/>" + name2abbr(val.name) + ": " + val.name + "</li>");
            });
        });

        return legend;
    };

    var endsWith = function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) != -1;
    };

    var sethandlers = function() {

        // Make the quadrant titles editable when users click on it.
        $('#legend ul p b').click(function() {
            this.contentEditable=true
            $(this).on('keypress blur', function(e) {
                if(e.keyCode && e.keyCode == 13 || e.type=='blur') {
                    this.contentEditable=false
                    return false
                }
            });
            $(this).focus()
        });

        // Rollover and click handlers for the individual entries
        $(".entry-img")
            .mouseenter(function() {
                this.src = 'delete-16.png';
            })
            .mouseleave(function() {
                this.src = 'bullet-16.png';
            })
            .click(function() {
                if (endsWith(this.src, 'delete-16.png')) {
                    radar.data.deleteEntry(this.alt);
                    radar.legend.update();
                    radar.view.redraw();
                }
            });
    };

    var init = function() {
        var sectors = radar.data.get();
        var legend = mklegend(sectors);

        legend.appendTo("#legend");
        sethandlers();
    };

    var update = function() {
        var sectors = radar.data.get();
        var legend = mklegend(sectors);

        $('#legend ul').replaceWith(legend);
        sethandlers();
    };

    return { init: init, update: update };
}());