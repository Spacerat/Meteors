
//Global classes namespace and allocator.
classes = {}


/* Entity class
A basic class with some default unimplimented functions, and
also Add() and Remove(), for adding/removing itself from a global
Allocator.
*/
classes.entity = function() {};
classes.entity.Entities = new tools.Allocator();

classes.entity.prototype.Remove = function() {
	classes.entity.Entities.Remove(this.id);
	this.id = -1;
}
classes.entity.prototype.Add = function() {
	this.id = classes.entity.Entities.Allocate(this);
}
classes.entity.prototype.Tick = function() {};
classes.entity.prototype.Pair = function() {};
classes.entity.prototype.Render = function() {};



/* update_ents(number timedelta, Canvas2dContext ctx) 
	Run Tick(timedelta) and Render(ctx) for all entities.
*/
classes.entity.update_ents = function(delta, ctx) {
	classes.entity.Entities.Enumerate(function(ent) {
		ent.Tick(delta);
		ent.Render(ctx);
	});
}

/* pair_ents()
	Run Pair() for every combination of entities. Useful
	for implimenting collsiion detection
*/
classes.entity.pair_ents = function() {
	classes.entity.Entities.EnumPairs(function(ent1, ent2) {
		ent1.Pair(ent2);
	});    
}

//Global extend function - very useful.

function extend(sub, uber) {
	for (var p in uber.prototype) {
		if (!sub.prototype[p]) {
			sub.prototype[p] = uber.prototype[p];
		}
	}
}