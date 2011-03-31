
//TODO: Impliment as behaivour.
classes.bouncer = function(pos1, pos2) {
	var that = this;
	this.x1 = pos1.x;
	this.y1 = pos1.y;
	this.x2 = pos2.x;
	this.y2 = pos2.y;
	this.lengthsqrd = (this.x2-this.x1)*(this.x2-this.x1) + (this.y2-this.y1) * (this.y2 - this.y1);
	this.length = Math.sqrt(this.lengthsqrd);
	
	var life = Math.min(100000.0/this.length, 1000);
	var liveuntil = (new Date()).getTime() + life;
	setTimeout(function() {
		that.Remove();
	}, life);
	this.collisiontype = "line";
	
	this.Render = function(ctx) {
		var a = (liveuntil - (new Date()).getTime())/life;
		ctx.shadowColor = "blue";
		ctx.strokeStyle = "rgba(0,0,255,"+a+")";
		ctx.lineCap = "round";		
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
	tools.addMouseListener(environment.canvas, document.body, 'mousedown', function(e, pos) {
		startpos = pos;
	});
	tools.addMouseListener(environment.canvas, document.body, 'mouseup', function(e, pos) {
		var b = new classes.bouncer(startpos, pos);
		b.Add();
		startpos = null;
		
		
	});
	tools.addMouseListener(environment.canvas, document.body, 'mousemove', function(e, pos) {
		mpos = pos;
	});
	
	this.Render = function(ctx) {
		if (startpos) {
			ctx.strokeStyle = "blue";
			ctx.shadowColor = "blue";
			ctx.shadowBlur = 10;
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