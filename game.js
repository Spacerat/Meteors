
environment = {}

//namespace for the entire game.
game = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var delta = new tools.Delta();   
	var bbox = behaivours.boundingbox(0, -300, canvas.width, canvas.height + 100);
	var grav = behaivours.gravity(150);	
	var started = false;
	//Set some global variables
	environment = {
		ctx: ctx,
		canvas: canvas,
		delta: delta,
		grav: grav,
		bbox: bbox,
		gravity: 150,
		score: 0,
		spawned: 0
	}
	
    //Initialisation and the main loop, called when all images are finished loading.
    var begin = function() {
		var b = (new classes.background(canvas, ctx));
		b.Add();
		var p = (new classes.player());
        setInterval( function() {
			var i;
			ctx.globalCompositeOperation = "copy";
			ctx.fillStyle = "rgba(0,0,0,0)";
			ctx.fillRect(0,0,canvas.width, canvas.height);
			ctx.globalCompositeOperation = "source-over";
            delta.Tick();
			classes.entity.update_ents(delta.time, ctx);
			classes.entity.pair_ents();
			p.Render(ctx);
			ctx.fillStyle = "black";
			ctx.font = "30px arial,sans-serif";
			ctx.fillText("Score: "+environment.score+" / "+environment.spawned,20,30);
			ctx.font = "10px arial,sans-serif";
			ctx.fillText("FPS: "+Math.floor(delta.FPS),canvas.width - 40,10);			
        },18);
    }
	
	this.startGame = function () {
		if (started === true) return;
		started = true;
		environment.spawned = 0;
		tools.spawner(30, 2000, function() {
			var met = (new classes.behaivor({},[behaivours.meteor, grav, bbox]));
			met.Add();
			environment.spawned+=1;
		});
	}
	
    tools.Images = new tools.ImageLoader();

	tools.Images.Load('img/',[
        'hills',
		'meteor1',
		'meteor2',
		'meteor3'
        ],'.png', begin);
		
};


