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

    var chooseDiameter = function() {
        // Compute a size leaving 350 pixels for the legend and 250px as a minimum size.
        var height = $(window).width();
        var width = $(window).width();
        return Math.max(250, Math.min(width, height) - 360);
    };

    var dia = chooseDiameter();

    var diameter = function () {
        return dia;
    };

    var inittitle = function (text) {

        $('#title').text(text);

        // Make the title editable when users click on it.
        $('#title').click(function () {
            this.contentEditable = true
            $(this).on('keypress blur', function (e) {
                if (e.keyCode && e.keyCode == 13 || e.type == 'blur') {
                    this.contentEditable = false;
                    return false
                }
            });
            $(this).focus()
        });

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

    // Drag handler.
    // Store local coordinates in scratch x,y variables.
    var dragmove = function (d) {
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

    var dragend = function (d) {
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

    var addEntry = function () {
        console.log('addEntry() x: ' + d3.event.x + ', y: ' + d3.event.y);
        radar.data.addEntry(d3.event);
        radar.legend.update();
        redraw();
    };

    var drawradar = function (rdr, dia, sectors) {

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

    // Draw a circle on the radar for each entry in the technologies list.
    var drawentries = function (rdr, dia, sectors) {

        // Convenience names.
        var p2c = radar.utils.polar_to_cartesian;

        // Create a d3 scale based on the displayed radar diameter.
        var rscale = radar.utils.mkscale(dia);

        // Register drag handlers.
        var drag = d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragend", dragend);

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

        point.append("circle")
            .attr("cy", function (d) {
                return p2c(d.pc).y;
            }) // translate y value to a pixel
            .attr("cx", function (d) {
                return p2c(d.pc).x;
            }) // translate x value
            .attr("r", rscale(12)); // radius of circle

        point.append("text")
            .attr("dy", function (d) {
                return p2c(d.pc).y;
            }) // translate y value to a pixel
            .attr("dx", function (d) {
                return p2c(d.pc).x;
            }) // translate x value
            .text(function (d) {
                return radar.utils.name2abbr(d.name);
            }) // radius of circle
            .append("title")
            .text(function (d) {
                return d.name;
            });
    };

    var render = function (rdr, dia) {
        // Get the radar data.
        var sectors = radar.data.get();

        // Render title, radar, and data entries.
        inittitle(radar.data.title);
        drawradar(rdr, dia, sectors);
        drawentries(rdr, dia, sectors);
    };

    var init = function () {

        console.log('init() dia: ' + dia);

        //Create SVG element
        var svg = d3.select("#radar")
            .append("svg")
            .attr("width", dia)
            .attr("height", dia);

        // Add group to hold the radar paths.
        var rdr = svg.append("g")
            .attr("transform", "translate(" + dia / 2 + "," + dia / 2 + ")");

        render(rdr, dia);
    };

    var redraw = function () {
        // Clear the svg element then call render to recreate.
        // @todo: implement

        $("svg").remove();

        //Create SVG element
        var svg = d3.select("#radar")
            .append("svg")
            .attr("width", dia)
            .attr("height", dia);

        // Add group to hold the radar paths.
        var rdr = svg.append("g")
            .attr("transform", "translate(" + dia / 2 + "," + dia / 2 + ")");

        render(rdr, dia);
    }

    return {init: init, redraw: redraw, diameter: diameter};
}();