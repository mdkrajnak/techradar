/*jslint white: true, vars: true */
// The current legend is single ordered list, which we use to get the correct 1..N numbering for each entry.
// List placement is controlled by CSS styles.
// Note there are <p> elements embedded in the list which subset it based on the sectors.

/*global $, radar */

radar.legend = (function() {
    'use strict';

    // Convenience name for util function.
    var name2abbr = radar.utils.name2abbr;

    var mklegend = function(sectors) {
        var legend = $("<ul/>");

        var radiusSort = function(a, b) { return a.pc.r - b.pc.r; };

        $.each(sectors, function(index, quad) {
            legend.append('<p><b class="quad-title">' + quad.quadrant + '</b></p>');
            $.each(quad.items.sort(radiusSort), function(index, val) {
                legend.append(
                    '<li><img class="entry-img" src="bullet-16.png" alt="' + val.name +
                    '"/><span class="entry-key">' + name2abbr(val.name) +
                    '</span>:&nbsp;<span class="entry-txt">' + val.name + "</span></li>");
            });
        });

        return legend;
    };

    var endsWith = function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) != -1;
    };

    var stripkey = function(text) {
        var start = text.indexOf(':');
        if (start < 0) return text;
        return text.substr(start + 2);
    };

    // Add event handlers to the legend elements.
    var setHandlers = function() {

        // Make the quadrant titles editable when users click on it.
        $('.quad-title').click(radar.utils.mkEditable());

        $('.entry-txt').click(radar.utils.mkEditable());//function (e) {
        //    var $this = $(this);
        //    $this.text(stripkey($this.text()));
        //    $this.attr('contentEditable', true);
        //    $this.on('keypress blur', function (e) {
        //        if (e.keyCode && e.keyCode == 13 || e.type == 'blur') {
        //            var $this = $(this);
        //            $this.attr('contentEditable', false);
        //            var text = $this.text();
        //            if (text === undefined) return false;
        //            console.log('text: ' + text);
        //            $this.text(name2abbr(text) + ': ' + text);
        //            return false;
        //        }
        //    });
        //    $(this).focus();
        //    return false;
        //});

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
        setHandlers();
    };

    var update = function() {
        var sectors = radar.data.get();
        var legend = mklegend(sectors);

        $('#legend ul').replaceWith(legend);
        setHandlers();
    };

    return { init: init, update: update };
}());