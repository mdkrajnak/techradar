
function name2abbr(s) {
    var parts = s.replace(/\(.*\)/, '').split(/\s+/);
    if (parts.length === 0) return "Unk";
    if (parts.length === 1) return parts[0].substr(0,3);
    if (parts.length === 2) return parts[0].substr(0,1) + parts[1].substr(0,2);
    return parts[0].substr(0,1) + parts[1].substr(0,1) + parts[2].substr(0,1);
}

function polar_to_cartesian(r,t) {  
  //radians to degrees, requires the t*pi/180
  var x = r * Math.cos((t*Math.PI/180));
  var y = r * Math.sin((t*Math.PI/180));
  return [x,y];
}

function cartesian_to_raster(x,y) {
  var rx = w/2 + x;
  var ry = h/2 + y;
  return [rx,ry];
}

function raster_to_cartesian(rx,ry) {
  var x = rx - w/2;
  var y = ry - h/2;
  return [x,y];
}

function polar_to_raster(r,t) {
  var xy= polar_to_cartesian(r,t);
  return cartesian_to_raster(xy[0], xy[1]);
}

