
physics = { 
	BallBallCollision: function(e1, e2, cof) {
		//Collision!
		var distsqrd = Math.pow((e1.x - e2.x),2) + Math.pow((e1.y - e2.y),2);
		if (distsqrd > Math.pow((e1.radius + e2.radius),2)) return false;
		var dist = Math.sqrt(distsqrd);
		
		
		var e = cof || 1; //Coefficient of restitution		
		//Find the normal of the line between the two balls, and its tangent.
		
		var norm = {
			x: (e2.x - e1.x) / dist,
			y: (e2.y - e1.y) / dist
		};
		var tang = {
			x: -norm.y,
			y: norm.x
		};
		
		//Find norm dot velocities. This is equal to cos(theta) * speed.
		var u1n = norm.x * e1.xvel + norm.y * e1.yvel;
		var u2n = norm.x * e2.xvel + norm.y * e2.yvel;
		//Find tang dot velocities. This is equal to sin(theta) * speed.
		var v1t = tang.x * e1.xvel + tang.y * e1.yvel;  //v1t = u1t
		var v2t = tang.x * e2.xvel + tang.y * e2.yvel;  //v2t = u2t     
		
		//We now treat this like a head on collision in the plane of the normal.
		var v1n = ((e1.mass * u1n) + (e2.mass * u2n) + e2.mass * e * (u2n - u1n)) / (e1.mass + e2.mass);
		var v2n = ((e1.mass * u1n) + (e2.mass * u2n) + e1.mass * e * (u1n - u2n)) / (e1.mass + e2.mass);
		
		//Our resultant velocities are in the normal/tangent plane. They now need to be changed back in to the x/y plane.
		var vec1n = {
			x: norm.x * v1n,
			y: norm.y * v1n
		};
		var vec2n = {
			x: norm.x * v2n,
			y: norm.y * v2n
		};
		var vec1t = {
			x: tang.x * v1t,
			y: tang.y * v1t
		};
		var vec2t = {
			x: tang.x * v2t,
			y: tang.y * v2t
		};
		
		//Finally, we sum these velocities.
		e1.xvel = vec1n.x + vec1t.x;
		e1.yvel = vec1n.y + vec1t.y;
		e2.xvel = vec2n.x + vec2t.x;
		e2.yvel = vec2n.y + vec2t.y;            
		
		e2.x = e1.x + norm.x * (e1.radius + e2.radius+1);
		e2.y = e1.y + norm.y * (e1.radius + e2.radius+1);
		return true;
	},

	BallLineCollision: function(ball, line) {
		var i = physics.IntersectCircleWithLine(ball, line);
		if (i) {
			if (i.length === 2) {
				/*
				if (!ball.collidedlines) {
					ball.collidedlines = {};
				}
				else {
					if (ball.collidedlines[line]) return;
				}
				ball.collidedlines[line] = true;
				*/
				var spd = ball.getSpeed();
				var dst = Math.sqrt(Math.pow(line.x2-line.x1,2) + Math.pow(line.y2-line.y1,2));
				
				var norm = {
					x:(line.x2 - line.x1)/line.length,
					y:(line.y2 - line.y1)/line.length
				};
				var ndot = norm.x + norm.y;
				var tang = {
					x: -norm.y,
					y: norm.x
				}
				var tdot = tang.x + tang.y;
				var vec = {
					x: ball.xvel,
					y: ball.yvel
				};
				
				var vdotn = norm.x*vec.x + norm.y * vec.y;
				var vdott = -(tang.x*vec.x + tang.y * vec.y);

				ball.xvel = vdotn * norm.x + vdott * tang.x;
				ball.yvel = vdott * tang.y + vdotn * norm.y;
				
				return true;
				
			}
		}
	}
}

physics.IntersectCircleWithLine = function(circle, line) {
	var r = circle.radius;
	var m = (line.y2 - line.y1) / (line.x2 - line.x1);
	var t = line.y2 - (m * line.x2);
	var s = t - circle.y;
	
	var a = m * m + 1;
	var b = (2 * m * s) - (2 * circle.x);
	var c = (s * s) + (circle.x * circle.x) - (r * r);
	
	var bsqminfourac = b * b - 4 * a * c;
	var p
	if (bsqminfourac > 0) {
		bsqminfourac = Math.sqrt(bsqminfourac);
		var x1 = ((-b) + bsqminfourac) / (2 * a);
		var x2 = ((-b) - bsqminfourac) / (2 * a);
		p = [{
			x: x1,
			y: (m * x1) + t
		},{
			x: x2,
			y: (m * x2) + t
		}];
	}
	else if (bsqminfourac === 0) {
		p = [{
			x: (-b) / (2 * a),
			y: (-b * m) / (2 * a) + t
		}];
	}
	if (!p) return null;
	
	var minx = Math.min(line.x1, line.x2), maxx = Math.max(line.x1, line.x2);
	var miny = Math.min(line.y1, line.y2), maxy = Math.max(line.y1, line.y2);
	
	var res = [];
	for (i=0;i<p.length;i++) {
		if (p[i].x < maxx && p[i].x > minx && p[i].y < maxy && p[i].y > miny) {
			res.push(p[i]);
		}
	}
	
	return res;
}