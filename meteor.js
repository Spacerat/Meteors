
behaivours.image = {
	render: function(ctx) {
		if (this.centred) {
			ctx.drawImage(this.image, this.x - this.image.width/2, this.y - this.image.height/2);
		}
		else {
			ctx.drawImage(this.image, this.x, this.y);
		}
	}
}

classes.trail = function(maxlen, r) {
	var points = new Array();
	this.doPath = function(ctx, scaler, scalen) {
		if (scaler === undefined) {scaler = 1;}
		if (scalen === undefined) {scalen = 1;}
		var s = r * scaler;
		var n = Math.ceil(scalen * points.length);
		if (n<=2) return;
		ctx.beginPath();
		//console.log(points);
		ctx.moveTo(points[0][0] + points[0][2]*s, points[0][1] + points[0][3] * s);
		for (var i = 1; i < n; i++) {
			var w = s * (1 - (i / n));
			ctx.lineTo(points[i][0] + points[i][2] * w, points[i][1] + points[i][3] * w);
		}
		
		for (var i = n-1; i >= 0; i--) {
			var w = -s * (1 - (i / n));
			ctx.lineTo(points[i][0] + points[i][2] * w, points[i][1] + points[i][3] * w);
		}
		ctx.closePath();
		
	}
	this.update = function(x, y, tx, ty) {
		points.unshift([x, y, tx, ty]);
		if (points.length > maxlen) {
			points.pop();
		}
	}
}

behaivours.meteor = {
	name: ["meteor"],
	depend: ["ball"],
	init: function(params) {
		var s = setOrDefault(this, params);
		//Set the landing destination and intended velocity, then set the start based on that.
		var xend = tools.randRange(0, environment.canvas.width);
		var xvel =  (xend - environment.canvas.width/2) * tools.randRange(1,2);
		this.xvel = xvel;
		this.xend = xend;
		this.x = xend - xvel * Math.sqrt((2 * environment.canvas.height + 300) / environment.gravity);
		this.y = -300;
		this.health = 3;
		this.image = tools.Images['meteor1'];
		this.bounded = false;
		s("radius", this.image.width/2);
		this.trail = new classes.trail(50,this.radius);
		s("centred", true);
		this.name = "meteor";
		
		this.smash = function() {
			this.health -=1;
			this.mass /= 3;
			this.image = tools.Images['meteor'+(4-this.health)];
			if (this.health == 0) {
				this.Remove();
				environment.score+=1;
			}
		}
		
	},
	collision: function(ent) {
		//TODO: Impliment with hasBehaivour.
		if (ent.name==="meteor") {
			this.smash();
		}
		this.bounded = true;
	},
	tick: function(delta) {
		if (this.y > environment.canvas.height + this.radius) {
			this.bounded = false;
		}
		if (this.y > environment.canvas.height*2) {
			this.Remove();
		}
	},
	render: function(ctx) {
		if (!this.image) return;
		ctx.shadowColor = 'transparent';
		var spd = this.getSpeed();
		var norm = {
			x: (this.xvel / spd),
			y: (this.yvel / spd)
		};
		var tang = {
			x: -norm.y,
			y: norm.x
		};
		if (!ctx.lowgfx === true) {
			this.trail.update(this.x, this.y, tang.x, tang.y);
			
			ctx.fillStyle = "rgba(200,150,50,0.7)";
			this.trail.doPath(ctx);
			ctx.fill();
			ctx.fillStyle = "rgba(255,170,59,0.7)";
			this.trail.doPath(ctx, 0.5, 0.5);
			
			ctx.fill();
		}
		ctx.drawImage(this.image, this.x - this.image.width/2, this.y - this.image.height/2);
		
		// this.x - this.radius * tang.x, this.y - this.radius * tang.y
	}
}