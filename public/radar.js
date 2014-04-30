/*jslint
  browser: true
 */

// Turn off "do not define functions in loop"
/*jslint -W083*/

/*global $, console, d3, radar_data */

function init(h,w) {
    
    // Initialize the title as specified in radarData.js
    $('#title').text(document.title);
    
    //  Initialize variables used to size and position the graphics.
    var dia = Math.min(w, h);       // Radar diameter
    var radius = dia/2;
    var rd = dia/8;                 // Radial displacement of one band (e.g. "Adopt").
    var pi = Math.PI;
    var ad = 2*pi/radar_data.length;    // Angular displacement of one sector.
    
    // Create a d3 scale, we assume the input data uses radius values of 0..400 so the 
    // domain is [-400, 400].
    var rscale = d3.scale.linear()
        .domain([-400, 400])
        .range([-radius, radius]);

    // Function for creating arc generators for a specific band, pos 0 is the innermost "Adopt" band.
    var mkarcfn = function(pos) {
        return function(d, i) {
            return d3.svg.arc()
                .innerRadius(rd*(pos-1))
                .outerRadius(rd*pos)
                .startAngle(i*ad)
                .endAngle((i+1)*ad)(d,i);
        };
    };
    
    // Function to convert r, theta coordinates to viewport coordinates (minus translation).
    var p2c = function(pt) {  
      //radians to degrees, requires the t*pi/180
      var x = pt.r * Math.cos((pt.t*Math.PI/180));
      var y = pt.r * Math.sin((pt.t*Math.PI/180));
      return {x: rscale(x), y: -rscale(y)};
    };
    
    var dragmove = function(d) {
        if (d.x == undefined) d.x = 0;
        if (d.y == undefined) d.y = 0;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
    };
    
    var drag = d3.behavior.drag()
        .on("drag", dragmove);

    //Create SVG element
    var svg = d3.select("#radar")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Add group to hold the radar paths.
    var rdr = svg.append("g")
        .attr("transform", "translate(" + w/2 +"," + h/2 + ")");

    // Make an entry selection for all sectors.
    var paths = rdr.selectAll("path")
        .data(radar_data).enter();

    // Append the outer most band for hold state.
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

    // Adopt, using an alternate form for creating the arc for didatic purposes.
    paths.append("path")
        .attr("class", "adopt")
        .attr("d", d3.svg.arc()
            .innerRadius(0)
            .outerRadius(rd)
            .startAngle(function(d,i) { return i*ad; })
            .endAngle(function(d,i) { return (i+1)*ad; }));
    
    // Now draw the points.
    var ptnum = 0;
    
    // Note, can we move the transform to the parent <svg> element?
    var entries = svg.append("g")
        .attr("transform", "translate(" + w/2 +"," + h/2 + ")");
    
    // Make an entry selection for all points.
    var points = entries.selectAll("g")
        .data(radar_data)
        .enter()
        .append("g");
    
    // Create one <g> for each point.  
    // A point group consists of its symbol and text.
    var point = points.selectAll("g")
        .data(function(d) { ptnum = 0; return d.items; })
        .enter()
        .append("g")
        .attr("class", "dot")
        .attr("x", 0)
        .attr("y", 0)
        .call(drag);
    
    point.append("circle")
        .attr("cy", function (d) { return p2c(d.pc).y; } ) // translate y value to a pixel
        .attr("cx", function (d) { return p2c(d.pc).x; } ) // translate x value
        .attr("r", rscale(12)); // radius of circle
    
    point.append("text")
        .attr("dy", function (d) { return p2c(d.pc).y; } ) // translate y value to a pixel
        .attr("dx", function (d) { return p2c(d.pc).x; } ) // translate x value
        .text(function(d) { return name2abbr(d.name); } ) // radius of circle
        .append("title")
        .text(function(d) { return d.name; });
}