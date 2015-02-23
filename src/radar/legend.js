/*jslint white: true, vars: true */
// The current legend is single ordered list, which we use to get the correct 1..N numbering for each entry.
// List placement is controlled by CSS styles.
// Note there are <p> elements embedded in the list which subset it based on the sectors.

/*global $, radar */

radar.legend = (function() {
    'use strict';

    // Convenience name for util function.
    var name2key = radar.utils.name2abbr;
    var mkid = radar.utils.mkid;

    var mklegend = function(sectors) {
        var radiusSort = function(a, b) { return a.pc.r - b.pc.r; };

        $.each(sectors, function(index, quad) {
            var qid = '#qtitle-' + index;
            var qtitle = $(qid).text(quad.quadrant);
            (function(ttl, qid) {
                ttl.change(function() {
                    radar.data.update(qid, 'qtitle', $(this).text());});
            })(qtitle, qid);

            var tid = '#tlist-' + index;
            var tlist = $(tid);
            tlist.children().remove();

            $.each(quad.items.sort(radiusSort), function(index, val) {
                var key = $('<span class="entry-key">').attr('id', mkid('lekey-', val.id)).text(name2key(val.name));
                var txt = $('<span class="entry-txt">').attr('id', mkid('letxt-', val.id)).text(val.name);
                var img = $('<img class="entry-img" src="../radar/bullet-16.png">').attr('id', mkid('leimg-', val.id));
                img.attr('alt', val.name);
                var li =  $('<li>').append(img).append(key).append(':&nbsp;').append(txt);

                (function(val, img, key, txt) {
                    txt.change(function() {
                        radar.data.update(val.id, 'name', $(this).text());
                        img.attr('alt', $(this).text());
                        key.text(name2key($(this).text())) });
                })(val, img, key, txt);

                tlist.append(li);
            });
        });
    };

    var endsWith = function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) != -1;
    };

    // Add event handlers to the legend elements.
    var setHandlers = function() {

        // Make the quadrant titles editable when users click on it.
        $('.quad-title').click(radar.utils.mkEditable());
        $('.entry-txt').click(radar.utils.mkEditable());

        // Rollover and click handlers for the individual entries
        $(".entry-img")
            .mouseenter(function() {
                $(this).attr('src', '../radar/delete-16.png');
            })
            .mouseleave(function() {
                $(this).attr('src', '../radar/bullet-16.png');
            })
            .click(function() {
                if (endsWith(this.src, 'delete-16.png')) {
                    radar.data.deleteEntry(radar.utils.mkid('tech-', this.id));
                    radar.legend.update();
                    radar.view.redraw();
                }
            });
    };

    var init = function() {
        var data = radar.data.get();

        mklegend(data.sectors);
        setHandlers();
    };

    var update = function() {
        var data = radar.data.get();

        mklegend(data.sectors);
        setHandlers();
    };

    return { init: init, update: update };
}());