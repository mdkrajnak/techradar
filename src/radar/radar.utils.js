/*jslint white: true, vars: true */
/*global radar, d3 */

radar.utils = (function() {
    'use strict';

    var scale = d3.scale.linear();

    var mkscale = function(dia) {
        var radius = dia/2;

        return d3.scale.linear()
            .domain([-400, 400])
            .range([-radius, radius]);
    };

    var init = function() {
        scale = mkscale(radar.view.diameter());
    };

    // Given a string return the first matching number out of string or '0'.
    // E.g. if 'tech-7' then '7', if 'tech' then '0'.
    // Treats hyphens as hyphens, not minus so no negative numbers.
    var idnum = function(idval) {
        var m = idval.match(/\d+/);
        return (m == null ? '0' : m[0]);
    };

    // Given an id in string + num format replace the current prefix
    // with the specified one.
    var mkid = function(prefix, idval) {
        return prefix + idnum(idval)
    };

    // Click handler that makes an element editable on click,
    // and non-editable on exit.
    var mkEditable = function () {
        return function () {
            $(this).attr('contentEditable', true);
            $(this).on('keypress blur', function (e) {
                if (e.keyCode && e.keyCode == 13 || e.type == 'blur') {
                    $(this).attr('contentEditable', true);
                    $(this).change();
                    return false
                }
            });
            $(this).focus();
        }
    };

    var name2abbr = function(s) {
        var parts = s.replace(/\(.*\)/, '').trim().split(/\s+/);
        if (parts.length === 0) {return "Unk"; }
        if (parts.length === 1) { return parts[0].substr(0,3); }
        if (parts.length === 2) { return parts[0].substr(0,1) + parts[1].substr(0,2); }
        return parts[0].substr(0,1) + parts[1].substr(0,1) + parts[2].substr(0,1);
    };

    var polar_to_cartesian = function(pt) {
        var x = pt.r * Math.cos((pt.t*Math.PI/180));
        var y = pt.r * Math.sin((pt.t*Math.PI/180));
        return {x: x, y: y} ; //
    };

    var cartesian_to_polar = function(pt) {
        var radius = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
        var theta = Math.atan2(pt.y, pt.x);
        if (theta < 0) theta = (2*Math.PI) + theta;
        return {r: radius, t: theta * (180/Math.PI)};
    };

    // @todo: Consider making dia an argument.
    var cartesian_to_raster = function(x,y) {
        var dia = radar.view.diameter();
        var rx = dia/2 + x;
        var ry = dia/2 + y;
        return {x: rx, y: ry};
    };

    var raster_to_cartesian = function(rx,ry) {
        var dia = radar.view.diameter();
        var x = rx - dia/2;
        var y = ry - dia/2;
        return {x: x, y: y};
    };

    var polar_to_raster = function(pt) {
        //radians to degrees, requires the t*pi/180
        var scale = mkscale(radar.view.diameter());
        var x = pt.r * Math.cos((pt.t*Math.PI/180));
        var y = pt.r * Math.sin((pt.t*Math.PI/180));
        return {x: scale(x), y: scale(y)};
    };

    return {
        init: init,
        mkscale: mkscale,
        idnum: idnum,
        mkid: mkid,
        name2abbr: name2abbr,
        mkEditable: mkEditable,
        cartesian_to_polar: cartesian_to_polar,
        cartestian_to_raster: cartesian_to_raster,
        raster_to_cartesian: raster_to_cartesian,
        polar_to_cartesian: polar_to_cartesian,
        polar_to_raster: polar_to_raster
    };

}());
