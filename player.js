
//TODO: Impliment as behaivour.
classes.bouncer = function(pos1, pos2) {
	var that = this;
	this.x1 = pos1.x;
	this.y1 = pos1.y;
	this.x2 = pos2.x;
	this.y2 = pos2.y;
	this.lengthsqrd = (this.x2-this.x1)*(this.x2-this.x1) + (this.y2-this.y1) * (this.y2 - this.y1);
	this.length = Math.sqrt(this.lengthsqrd);
	
	var life = Math.min(10000.0/Math.sqrt(this.length), 2000);
	var liveuntil = (new Date()).getTime() + life;
	setTimeout(function() {
		that.Remove();
	}, life);
	this.collisiontype = "line";
	
	this.Render = function(ctx) {
		var a = (liveuntil - (new Date()).getTime())/life;
		if (!ctx.lowgfx) {
			ctx.shadowColor = "rgba(0,0,255,"+a+")";
			ctx.shadowBlur = 10;
		}
		ctx.strokeStyle = "rgba(0,0,255,"+a+")";
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.closePath();
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
	}
	
	this.Pair = function(ent){
		var col;
		if (ent.collisiontype === "ball") 
			col = physics.BallLineCollision(ent, this);
		if (col) {
			//this.doAction("collision", [ent]);
			ent.doAction("collision", [this]);
		}
	}
}
extend(classes.bouncer, classes.entity);

classes.player = function() {
	var startpos = null;
	var mpos = null;
	tools.addMouseListener(environment.canvas, window, 'mousedown', function(e, pos) {
		startpos = pos;
	});
	document.body.addEventListener("touchstart", function(e) {
		var pos = tools.getRelativeMousePos(e.touches[0], environment.canvas);
		startpos = pos;
	}, false);
	tools.addMouseListener(environment.canvas, window, 'mousedown', function(e, pos) {
		startpos = pos;
	});
	tools.addMouseListener(environment.canvas, window, 'mouseup', function(e, pos) {
		var b = new classes.bouncer(startpos, pos);
		b.Add();
		startpos = null;
		
		
	});
	tools.addMouseListener(environment.canvas, window, 'mousemove', function(e, pos) {
		mpos = pos;
	});
	
	this.Render = function(ctx) {
		if (startpos) {
			if (!ctx.lowgfx) {
				ctx.shadowColor = "rgba(155,155,255,0.7)";
				ctx.shadowBlur = 10;
			}
			ctx.strokeStyle = "rgba(155,155,255,0.7)";
			ctx.beginPath();
			ctx.moveTo(startpos.x, startpos.y);
			ctx.lineTo(mpos.x, mpos.y);
			ctx.closePath();
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
		}
	}
}
extend(classes.player, classes.entity);