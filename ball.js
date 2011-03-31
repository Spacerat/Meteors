
/* Ball behaivour
Manages ball physics
*/
behaivours.ball = {
    name: "ball",
    depend: ["particle"],
    init: function(params) {
        this.radius = params.radius || 20;
        this.style = "red";
		this.collisiontype = "ball";
        this.mass = (4/3)*Math.PI * this.radius * this.radius * this.radius;
    },
    tick: function() {
        this.style = "black";
    },
    pair: function(ent) {
		var col=false;
		if (ent.collisiontype === "ball") 
			col = physics.BallBallCollision(this, ent);
		else if (ent.collisiontype === "line")
			col = physics.BallLineCollision(this, ent);
			
		if (col) {
			this.doAction("collision", [ent]);
			if (ent.doAction) ent.doAction("collision", [this]);
		}
	}
}

behaivours.canvasball = {
    depend: ["ball"],
    render: function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
}


