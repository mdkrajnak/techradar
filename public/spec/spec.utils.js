/*jslint white: true, vars: true */
/*global, radar, d3 */

describe("utils", function() {

  describe("polar to xy conversions", function () {

    it("should convert r:100,t:0 to x:100,y:0", function () {
      var rt = {r: 100, t: 0};
      var xy = radar.utils.polar_to_cartesian(rt);

      expect(xy.x).toBeCloseTo(100, 2);
      expect(xy.y).toBeCloseTo(0, 2);
    });

    it("should convert r:100,t:90 to x:0,y:100", function () {
      var rt = {r: 100, t: 90};
      var xy = radar.utils.polar_to_cartesian(rt);

      expect(xy.x).toBeCloseTo(0, 2);
      expect(xy.y).toBeCloseTo(100, 2);
    });

    it("should convert r:100,t:180 to x:-100,y:0", function () {
      var rt = {r: 100, t: 180};
      var xy = radar.utils.polar_to_cartesian(rt);

      expect(xy.x).toBeCloseTo(-100, 2);
      expect(xy.y).toBeCloseTo(0, 2);
    });

    it("should convert r:100,t:270 to x:0,y:-100", function () {
      var rt = {r: 100, t: 270};
      var xy = radar.utils.polar_to_cartesian(rt);

      expect(xy.x).toBeCloseTo(0, 2);
      expect(xy.y).toBeCloseTo(-100, 2);
    });

  });

});
