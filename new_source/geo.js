var Geo = Geo || {};

Geo.distance = function(p0, p1) {
  return Math.sqrt(Math.pow(p1.x-p0.x, 2) + Math.pow(p1.y-p0.y, 2))
};

Geo.midpoint = function(p0, p1) {
  return Geo.scaledPointOnLine(p0, p1, .5)
};

Geo.scaledPointOnLine = function(p0, p1, s) {
  var x = p0.x + (p1.x - p0.x) * s;
  var y = p0.y + (p1.y - p0.y) * s;
  return {'x': x, 'y': y}
};

Geo.cutTheCorner = function(originPoint, point1, point2, distance) {
  var p1 = {
    p: "p1",
    x: point1.x - originPoint.x,
    y: point1.y - originPoint.y
  };
  var p2 = {
    p: "p2",
    x: point2.x - originPoint.x,
    y: point2.y - originPoint.y
  };
  var a1 = Geo.getAngle(p1);
  var a2 = Geo.getAngle(p2);
  var lAngle = a1 > a2 ? a1 : a2;
  var sAngle = a1 > a2 ? a2 : a1;
  var bisectedAngle = (lAngle - sAngle)/2 + sAngle;
  var a = (bisectedAngle - sAngle) >= Math.PI / 2 ? bisectedAngle - Math.PI: bisectedAngle;
  if (a < 0) {
    a = (2*Math.PI) + a;
  }
  console.log("lAngle: " + lAngle * 180/Math.PI + ", sAngle: " + sAngle * 180/Math.PI + ", a: " + a * 180/Math.PI);

  var scalingFactor = 1;
  var angle = lAngle - sAngle;
  if (lAngle - sAngle > Math.PI) {
    angle = (2 * Math.PI) - (lAngle - sAngle);
  }
  if (angle > Math.PI / 2) {
    scalingFactor = (Math.PI - angle) / (Math.PI / 2)
  }
  console.log("Scaling factor: " + scalingFactor);
  var p = {
    x: originPoint.x + scalingFactor * distance * Math.cos(a),
    y: originPoint.y + scalingFactor * distance * Math.sin(a)
  };
  //console.log(p);
  return p;
};

Geo.getAngle = function(p) {
  var a = Math.atan2(p.y, p.x);
  return a < 0 ? a + 2 * Math.PI : a;
};

exports.Geo;