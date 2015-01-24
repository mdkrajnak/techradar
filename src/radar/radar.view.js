/*jslint
  browser: true
  white: true
  vars: true
 */

// Turn off "do not define functions in loop"
/*jshint -W083*/

/*global $, console, d3, radar */

radar.view = function () {
    'use strict';

    // Compute size of radar to draw based on current window size.
    var chooseDiameter = function() {
        // Compute a size leaving 350 pixels for the legend and 250px as a minimum size.
        var height = $(window).height() - 100;
        var width = $(window).width() - 400;
        return Math.max(250, Math.min(width, height));
    };

    // Radar diameter.
    var dia = chooseDiameter();

    // Get current diameter.
    var diameter = function () {
        return dia;
    };

    // Initialize the radar title
    var initTitle = function (text) {
        var rtitle = $('#title');
        rtitle.text(text);

        // Make the title editable when users click on it.
        rtitle.click(radar.utils.mkEditable());
        (function(ttl) {
            ttl.change(function() {
                radar.data.update('title-1', 'title', $(this).text());});
        })(rtitle);
    };

    // Function for creating arc generators for a specific band, pos 0 is the innermost "Adopt" band.
    // Note the (d,i) at the tail of the call chain, so that we're returning the generated path
    // and not the generator function.
    var mkarcfn = function (pos, nsect, dia) {
        var ad = 2 * Math.PI / nsect;    // Angular displacement of one sector.
        var rd = dia / 8;                 // Radial displacement of one band (e.g. "Adopt").

        return function (d, i) {
            return d3.svg.arc()
                .innerRadius(rd * (pos - 1))
                .outerRadius(rd * pos)
                .startAngle(i * ad)
                .endAngle((i + 1) * ad)(d, i);
        };
    };

    // Drag move handler.
    // Store local coordinates in scratch x,y variables.
    var dragMove = function (d) {
        if (d.x === undefined) {
            d.x = 0;
        }
        if (d.y === undefined) {
            d.y = 0;
        }

        d.x += d3.event.dx;
        d.y += d3.event.dy;

        // Update r, theta
        d.pc = radar.utils.cartesian_to_polar(d3.event);

        // Update position on radar.
        d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
        radar.data.updateEntry(d);
        radar.legend.update();
    };

    // Drag end handler.
    // @todo: consider persisting map state when done.
    var dragEnd = function (d) {
        radar.legend.update();
        // Save changes.
//            $.ajax({
//                url: window.location.origin + '/radars/update/radars.json',
//                type: 'POST',
//                contentType: 'application/json',
//                data: JSON.stringify(radar.data.get()),
//                dataType: 'json'
//            });
    };

    // Add a new technology target to radar.
    // Updates data and legend then redraw the radar.
    var addEntry = function () {

        // Use d3.mouse() because d3.event.x, y unreliable in chrome.
        var coords = d3.mouse(this);

        radar.data.addEntry({x: coords[0], y: coords[1]});
        radar.legend.update();
        redraw();
    };

    // Draw the radar given the svg element, radar diameter, and sector data.
    var drawRadar = function (rdr, dia, sectors) {

        var nsect = sectors.length;

        // Make an entry selection for all sectors.
        var paths = rdr.selectAll("path");
        paths = paths.data(sectors);

        paths.exit().remove();

        paths = paths.enter();

        // Append the outer most band for hold state.
        paths.append("path")
            .attr("class", "hold")
            .attr("d", mkarcfn(4, nsect, dia))
            .on("click", addEntry);

        // Assess
        paths.append("path")
            .attr("class", "assess")
            .attr("d", mkarcfn(3, nsect, dia))
            .on("click", addEntry);

        // Trial
        paths.append("path")
            .attr("class", "trial")
            .attr("d", mkarcfn(2, nsect, dia))
            .on("click", addEntry);

        // Adopt
        paths.append("path")
            .attr("class", "adopt")
            .attr("d", mkarcfn(1, nsect, dia))
            .on("click", addEntry);
    };

    // Draw a target on the radar for each entry in the technologies list.
    var drawEntries = function (rdr, dia, sectors) {

        // Compute size of target.
        var tgtScale = radar.utils.mkscale(dia);
        var tgtSize = tgtScale(15);

        // Register drag handlers.
        var drag = d3.behavior.drag()
            .on("drag", dragMove)
            .on("dragend", dragEnd);

        var ptnum = 0;

        // Make an entry selection for all points.
        var points = rdr.selectAll("g")
            .data(sectors)
            .enter()
            .append("g");

        // Create one <g> for each point.
        // A point group consists of its symbol and text.
        var point = points.selectAll("g")
            .data(function (d) {
                ptnum = 0;
                return d.items;
            })
            .enter()
            .append("g")
            .attr("class", "dot")
            .attr("x", 0)
            .attr("y", 0)
            .call(drag);

        // Append a circle to display target.
        // Use polar to cartesian to convert data coords to display coords.
        var p2r = radar.utils.polar_to_raster;
        point.append("circle")
            .attr("cy", function (d) {
                return p2r(d.pc).y;
            })
            .attr("cx", function (d) {
                return p2r(d.pc).x;
            })
            .attr("r", tgtSize);

        point.append("text")
            .attr("dy", function (d) {
                return p2r(d.pc).y;         // translate y value to a pixel
            })
            .attr("dx", function (d) {
                return p2r(d.pc).x;         // translate x value
            })
            .text(function (d) {
                return radar.utils.name2abbr(d.name);
            })
            .attr('id', function(d) {
                return radar.utils.mkid('trkey-', d.id);
            })
            .append("title")
            .text(function (d) {
                return d.name;
            });
    };

    var update = function(aid, name, value) {
        var key = '#' + aid;
        if (name == 'text') {
            console.log('updating ' + aid + ' / ' + $(key).name + ' ' + name + ' ' + $(key).text() + ' with ' + value)
            $(key).text(value);
        }
        else {
            $(key).attr(name, value);
        }
    };

    // Render the radar.
    var render = function(svg, dia) {
        // Get the radar data.
        var data = radar.data.get();
        var sectors = data.sectors;

        // Add group to hold the radar paths.
        var radius = dia / 2;
        var rdr = svg.append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        // Render title, radar, and data entries.
        initTitle(radar.data.title());
        drawRadar(rdr, dia, sectors);
        drawEntries(rdr, dia, sectors);
    };

    var init = function () {

        //Create SVG element
        var svg = d3.select("#radar")
            .append("svg")
            .attr("width", dia)
            .attr("height", dia);

        render(svg, radar.view.diameter());
    };

    // Redraw radar.
    // Currently completely removes svg element and rebuilds from scratch.
    // @todo: convert to do incremental update of svg elements using d3 joins?
    var redraw = function () {

        // Delete current element and create new one.
        $("svg").remove();
        var svg = d3.select("#radar")
            .append("svg")
            .attr("width", dia)
            .attr("height", dia);

        render(svg, radar.view.diameter());
    }

    return {init: init, update: update, redraw: redraw, diameter: diameter};
}();