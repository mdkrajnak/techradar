/*jslint white: true, vars: true */
/*global radar, d3 */

radar.utils = (function() {
    'use strict';
    
    var scale = d3.scale.linear();
    var dia = 400;
    
    var mkscale = function(dia) {
        var radius = dia/2;
        
        return d3.scale.linear()
            .domain([-400, 400])
            .range([-radius, radius]);
    };
    
    var init = function(diameter) {
        dia = diameter;
        scale = mkscale(dia);
    };
    
    var name2abbr = function(s) {
        var parts = s.replace(/\(.*\)/, '').split(/\s+/);
        if (parts.length === 0) {return "Unk"; }
        if (parts.length === 1) { return parts[0].substr(0,3); }
        if (parts.length === 2) { return parts[0].substr(0,1) + parts[1].substr(0,2); }
        return parts[0].substr(0,1) + parts[1].substr(0,1) + parts[2].substr(0,1); 
    };
    
    var polar_to_cartesian = function(pt) {
      //radians to degrees, requires the t*pi/180
      var x = pt.r * Math.cos((pt.t*Math.PI/180));
      var y = pt.r * Math.sin((pt.t*Math.PI/180));
      return {x: x, y: y} ; //{x: scale(x), y: -scale(y)};
    };
    
    var cartesian_to_polar = function(pt) {
        var radius = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
        var theta = Math.atan2(pt.y, pt.x);
        return {r: radius, t: theta * (180/Math.PI{{r: scale.invert(radius), t: theta * (180/Math.PI)};
    };

    function cartesian_to_raster(x,y) {
      var rx = dia/2 + x;
      var ry = dia/2 + y;
      return [rx,ry];
    };

    function raster_to_cartesian(rx,ry) {
      var x = rx - dia/2;
      var y = ry - dia/2;
      return [x,y];
    }

    function polar_to_raster(r,t) {
      var xy= polar_to_cartesian(r,t);
      return cartesian_to_raster(xy[0], xy[1]);
    }
    
    return {
        init: init,
        mkscale: mkscale,
        name2abbr: name2abbr,
        polar_to_cartesian: polar_to_cartesian,
        cartesian_to_polar: cartesian_to_polar
    };
    
}());

