/*jslint
  browser: true
 */

// Turn off "do not define functions in loop"
/*jslint -W083*/

/*global $, console, d3, radar_data, polar_to_raster */

function p2c(pt) {  
  //radians to degrees, requires the t*pi/180
  var x = pt.r * Math.cos((pt.t*Math.PI/180));
  var y = pt.r * Math.sin((pt.t*Math.PI/180));
  return {x: x, y: y};
}

function init(h,w) {
    
    $('#title').text(document.title);
    var dia = Math.min(w, h);   // Radar diameter

    var sectors = [ "#003399", "#0099CC", "#0099FF", "#0000FF"];
    var pi = Math.PI;
    var ad = 2*pi/sectors.length;   // angular displacement
    var rd = dia/8;                 // radial displacement of one band.

    // Function for creating arc generators for a specific band.
    var mkarcfn = function(pos) {
        return function(d, i) {
            return d3.svg.arc()
                .innerRadius(rd*(pos-1))
                .outerRadius(rd*pos)
                .startAngle(i*ad)
                .endAngle((i+1)*ad)(d,i);
        };
    };

    //Create SVG element
    var svg = d3.select("#radar")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Add group to hold the radar paths.
    var rdr = svg.append("g")
        .attr("transform", "translate(" + w/2 +"," + h/2 + ")");

    // Make entry selection for all sectors.
    var paths = rdr.selectAll("path")
        .data(sectors).enter();

    // Append the outer most sectors for hold state.
    paths.append("path")
        .attr("class", "hold")
        .attr("d", mkarcfn(4));

    // Assess
    paths.append("path")
        .attr("class", "assess")
        .attr("d", mkarcfn(3));

    // Trial
    paths.append("path")
        .attr("class", "trial")
        .attr("d", mkarcfn(2));

    // Adopt, using an alternate form for creating the arc.
    paths.append("path")
        .attr("class", "adopt")
        .attr("d", d3.svg.arc()
            .innerRadius(0)
            .outerRadius(rd)
            .startAngle(function(d,i) { return i*ad; })
            .endAngle(function(d,i) { return (i+1)*ad; }));
    
    // Now draw the points.
    var ptnum = 0;
    
    var entries = svg.append("g")
        .attr("transform", "translate(" + w/2 +"," + h/2 + ")");
    
    var points = entries.selectAll("g")
        .data(radar_data)
        .enter()
        .append("g");
    
    var point = points.selectAll("g")
        .data(function(d) { ptnum = 0; return d.items; })
        .enter()
        .append("g")
        .attr("class", "dot");
    
    point.append("circle")
        .attr("cy", function (d) { return p2c(d.pc).y; } ) // translate y value to a pixel
        .attr("cx", function (d) { return p2c(d.pc).x; } ) // translate x value
        .attr("r", 10); // radius of circle
    
    point.append("text")
        .attr("dy", function (d) { return p2c(d.pc).y; } ) // translate y value to a pixel
        .attr("dx", function (d) { return p2c(d.pc).x; } ) // translate x value
        .text(function(d) { return ++ptnum; } );// radius of circle
}