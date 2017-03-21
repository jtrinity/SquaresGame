
//Arena object

function arena(width, height) {
	//canvas stuff
	this.canvas = document.getElementById('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext('2d');

	this.collision_drag = 0.998;

	//objects in arena
	this.memberItems = new Array();

	this.addItem = function(item) {
		this.memberItems.push(item);
	}

	//tells each member item to update pos and draw itself on this arenas canvas
	this.update = function() {
		//clear the canvas
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

		//check for collisions
		for(var i = 0; i<this.memberItems.length; i++){
			for(var j = i+1; j<this.memberItems.length; j++){
				this.checkCartesianCollision(this.memberItems[i],this.memberItems[j]);
			}
		}

		for (var i = 0; i < this.memberItems.length; i++){
			//only update movement if square is active
			// if (this.memberItems[i].active){
			// 	this.memberItems[i].move(this.canvas.width, this.canvas.height);
			// }
			this.memberItems[i].move(this.canvas.width, this.canvas.height);
			this.memberItems[i].draw(this.context);
		}


	}

	this.checkCartesianCollision = function(sqr1, sqr2){
	if (Math.abs(sqr1.xpos - sqr2.xpos) < getMinPosWidth("x",sqr1, sqr2)){
		if (Math.abs(sqr1.ypos - sqr2.ypos) < getMinPosWidth("y",sqr1, sqr2)){
			if (sqr1.xvel * sqr2.xvel < 0){
				sqr1.xvel *= -1;
				sqr2.xvel *= -1;
			} else if (sqr1.xvel * sqr2.xvel >= 0) {
				var temp = sqr1.xvel;
				sqr1.xvel = sqr2.xvel;
				sqr2.xvel = temp;
			}
			if (sqr1.yvel * sqr2.yvel < 0){
				sqr1.yvel *= -1;
				sqr2.yvel *= -1;
			} else if (sqr1.yvel * sqr2.yvel >= 0) {
				var temp = sqr1.yvel;
				sqr1.yvel = sqr2.yvel;
				sqr2.yvel = temp;
			}
			//make square inactive
			if(sqr1.name === "player"){
				sqr2.toggleActive();
			} else if(sqr2.name ==="player"){
				sqr1.toggleActive();
			}
			sqr1.xvel *= this.collision_drag;
			sqr1.yvel *= this.collision_drag;
			sqr2.xvel *= this.collision_drag;
			sqr2.yvel *= this.collision_drag;

		}
	}
}
}


//A better square object

function square(name, xpos, ypos, xvel, yvel, height, width, color) {
	this.name = name;
	this.xpos = xpos;
	this.ypos = ypos;
	this.xvel = xvel;
	this.yvel = yvel;
	this.height = height;
	this.width = width;
	this.color = color;
	this.inactive_color = "black";
	this.active = true;

	//updates square's properties
	this.move = function(maxX, maxY) {
		this.xpos += this.xvel;
		this.ypos += this.yvel;

		//check for out of bounds
		if(this.xpos<0){
			this.xpos=1;
			this.xvel*=-0.9;
		}
		if(this.xpos>maxX-this.width){
			this.xpos=maxX-this.width-1;
			this.xvel*=-0.9;
		}
		if(this.ypos<0){
			this.ypos=1;
			this.yvel*=-0.9;
		}
		if(this.ypos>maxY-this.height){
			this.ypos=maxY-this.height-1;
			this.yvel*=-0.9;
		}

	}

	//toggles the square activity
	this.toggleActive = function() {
		this.active = !this.active;
	}

	//draws the square
	this.draw = function(ctx) {
		if (this.active){
			ctx.fillStyle = this.color;
		} else {
			ctx.fillStyle = this.inactive_color;
		}
		
		ctx.fillRect(this.xpos, this.ypos, this.width, this.height);

	}
}


function update() {
	//update player position first
	if (x_pos_press && my_sqr.xvel < max_vel){
		my_sqr.xvel += v_incr;
	}
	if (x_neg_press && my_sqr.xvel > -1*max_vel){
		my_sqr.xvel -= v_incr;
	}
	if (y_pos_press && my_sqr.yvel < max_vel){
		my_sqr.yvel += v_incr;
	}
	if (y_neg_press && my_sqr.yvel > -1*max_vel){
		my_sqr.yvel -= v_incr;
	}

	arena_1.update();

}


function getMinPosWidth(type,x,y){
	if (type === "x"){
		if (x.xpos < y.xpos){
			return x.width;
		} else {
			return y.width;
		}
	} else if (type === "y"){
		if (x.ypos < y.ypos){
			return x.width;
		} else {
			return y.width;
		}
	}

}

//Performing updates on animation update.
window.main = function () {
  window.requestAnimationFrame( main );
  
  if (!game_paused){
  	update();
  }

};

//the arena
var arena_1 = new arena(800, 800);

//player square
var my_sqr = new square("player",100,100,0,0,50,50,"blue");
arena_1.addItem(my_sqr);

//put some squares in
var sqr_colors = ["orange", "yellow", "magenta", "cyan", "red"]
for (var i = 0; i<5; i++){
	var bad_sqr = new square("square"+i,100+150*i,400,5,5,100,100, sqr_colors[i]);
	arena_1.addItem(bad_sqr);
}


//boolean flags
var x_pos_press = false;
var x_neg_press = false;
var y_pos_press = false;
var y_neg_press = false;

var game_paused = false;

//physcics variables
var v_incr = 1;
var max_vel = 10;

//event listeners
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        x_neg_press = true;
    }

});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 39) {
        x_pos_press = true;
    }

});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 40) {
        y_pos_press = true;
    }

});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 38) {
        y_neg_press = true;
    }

});


document.addEventListener('keyup', function(event) {
    if(event.keyCode == 37) {
        x_neg_press = false;
    }

});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 39) {
        x_pos_press = false;
    }

});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 40) {
        y_pos_press = false;
    }

});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 38) {
        y_neg_press = false;
    }

});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
        game_paused = !game_paused;
    }

});



main(); //Start the cycle.

//setInterval(update, 1);