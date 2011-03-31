
function setOrDefault(obj, params) {
	return function(val, def) {
		if (obj[val] === undefined) {
			obj[val] = params[val] || def;
		}
	}
}

//Global behaivours namespace
behaivours = {}

behaivours.particle = {
    name: "particle",
    tick: function(delta) {
        this.x += this.xvel * delta;
        this.y += this.yvel * delta;
    },
    init: function(params) {
		var s = setOrDefault(this, params);
		s("x", 0);
		s("y", 0);
		s("mass", 1);
		s("xvel", 0);
		s("yvel", 0);
		
        this.getSpeed = function() {
            return Math.sqrt(this.xvel * this.xvel + this.yvel * this.yvel);
        }
    }
};

behaivours.gravity = function(strength) {
    return {
        name: "gravity",
        depend: ["particle"],
        tick: function(delta) {
            if (this.bbox) {
                if (this.y + (this.yvel + strength)*delta + this.radius < this.bbox.bottom) {
                    this.yvel = this.yvel + (strength * delta);
                }
            }
            else {
                this.yvel = this.yvel + (strength * delta);
            }
        }
    }
}
behaivours.boundingbox = function(left, top, right, bottom) {
    return {
        name: "bbox",
        depend: ["ball"],
        init: function(params) {
			var s = setOrDefault(this, params);
            this.bbox = {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            }
			s("bounded", true);
			
        },
        tick: function(delta) {
			if (this.bounded === true) {
				if (this.x - this.radius + this.xvel*delta < left) {
					this.xvel = -this.xvel;
					this.x = left + this.radius;
				}
				else if (this.x + this.radius + this.xvel*delta > right) {
					this.xvel = -this.xvel;
					this.x = right - this.radius;
				}
				if (this.y - this.radius + this.yvel*delta < top) {
					this.yvel = -this.yvel;
					this.y = top + this.radius;
				}
				else if (this.y + this.radius + this.yvel*delta > bottom) {
					this.yvel = -this.yvel;
					this.y = bottom - this.radius;
				}
			}
            /*         
            if (this.getSpeed() < 0.1) {
                this.xvel = 0;
                this.yvel = 0;
            }
            */
        }
    }
}

/*
The behaivor is a special kind of entity. It impliments a system in which
objects can be created by clumping together a group of behaivours - a kind
of multiple inheritence in which obj.Tick() runs the tick function of EVERY
parent.
New 'classes' can be defined in this system by creating behaivours 
which rely on other behaivours.
*/
classes.behaivor = function(params, behavs) {
    var that = this;
    var bnams = {};
    
    // Sort out dependancies
    var b = 0;
    while (b < behavs.length) {
        
        bnams[behavs[b].name]=true;
        var dep = behavs[b].depend;
        
        
        if (dep) {
            for (var d in dep) {
                if (!(bnams[dep[d]])) {
                    behavs.push(behaivours[dep[d]]);
                    bnams[dep[d]] = true;
                } 
            }
        }
        b++;
    }
    /* doAction(string Action, array Args) 
		Call the action for all set behaivours, passing an array of arguments.
	*/
    this.doAction = function(actname, args) {
        for (var b in behavs) {
            if (behavs[b][actname]) behavs[b][actname].apply(this, args);
        }
    }
	
	this.hasBehaivour = function(behavname) {
		return (bnams[behavname]!==undefined);
	}
 
    /* Tick(number Delta) 
		Call the 'tick' action for all set behaivours, passing delta time.
	*/
	this.Tick = function(delta) {
        for (var b in behavs) {
            if (behavs[b].tick) behavs[b].tick.apply(this, [delta]);
        }
	}
	
    /* Pair(ent2) 
		Call the 'pair' action for all set behaivours, passing the paired entity.
	*/
	this.Pair = function(ent2) {
        for (var b in behavs) {
            if (behavs[b].pair) behavs[b].pair.apply(this, [ent2]);
        }
	}
	
    /* Render() 
		Call the 'pair' action for all set behaivours, passing the paired entity.
	*/
	this.Render = function(ctx) {
        for (var b in behavs) {
            if (behavs[b].render) behavs[b].render.apply(this, [ctx]);
        }
	}	
    //Initialise the entity.
    this.doAction("init", [params]);
};
extend(classes.behaivor, classes.entity);
