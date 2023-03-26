var cars = [];
var carsG = [];

var res = 960;
var maxCars = 100;
var interChange = 0.15;
var interDist = 50;

function setup(){
	// put setup code here
	createCanvas(0.6*res*1.6,0.6*res);
	background(0);
	
	for(var r = random(8) + 15; r>=0; r--){
		cars.push(new Car(random(width), random(height)));
	}
}

function draw(){
	// put drawing code here
	background(0,25);
	//console.log(floor(frameRate()));
	
	for(var i = cars.length - 1; i >= 0; i--){
		cars[i].show();
		
		for(var j = cars.length - 1; j >= 0; j--){
			if(j!=i) if( collided(i, j) && cars[i].young() && cars[j].young() && cars.length < maxCars){
				for(var r = random(3)+2; r>=0; r--){
					cars.push(new Car(cars[i].pos.x, cars[i].pos.y));
				}
				for(var rr = random(8)+8; rr>=0; rr--){
					carsG.push(new CarGhost(cars[i].pos.x, cars[i].pos.y));
				}
				cars.splice(i,1);
				cars.splice(j,1);
			}
		}
		
		if(cars[i].dead()){
			cars.splice(i,1);
		}
	}
	for(var ii=carsG.length-1; ii>=0; ii--){
		carsG[ii].show();
		if(carsG[ii].age>255) carsG.splice(ii,1);
	}
}

function Car(x, y){
	this.pos = createVector(x, y);
	this.vel = createVector(random(4)-2, random(4)-2);
	this.age = 0;
	this.r = 5;
	this.charge = floor(random(2));
	this.c = (this.charge)? color(255,0,150): color(0,0,255);
	this.death = random(90)+110;
	
	this.update = function(){
		this.pos = this.pos.add(this.vel);
		if(this.pos.x > width) this.pos.x = 0;
		if(this.pos.x < 0) this.pos.x = width;
		
		if(this.pos.y > height) this.pos.y = 0;
		if(this.pos.y < 0) this.pos.y = height;

		if(this.vel.mag > 1.5) this.vel.setMag(1.5);
		
		this.age += 0.1;
	}
	
	this.show = function(){
		fill(this.c);
		stroke(this.c);
		if(this.death - this.age > 20) ellipse(this.pos.x, this.pos.y, this.r, this.r);
		else{
			this.c = color(this.c.levels[0],this.c.levels[1],this.c.levels[2],255*((this.death - this.age)/20));
			fill(this.c);
			stroke(this.c);
			ellipse(this.pos.x, this.pos.y, this.r, this.r);
		}
		this.update();
	}
	
	this.dead = function(){
		return this.age > this.death;
	}
	
	this.young = function(){
		return this.age > 20; 
	}
}

function CarGhost( x, y ){
	this.pos = createVector(x, y);
	this.vel = createVector(random(2)-1, random(2)-1);
	this.age = 0;
	this.r = random(3)+2;
	this.c = color(random(50,100),0,random(105,155),250);
	
	this.update = function(){
		this.pos = this.pos.add(this.vel);
		if(this.pos.x > width) this.pos.x = 0;
		if(this.pos.x < 0) this.pos.x = width;
		
		if(this.pos.y > height) this.pos.y = 0;
		if(this.pos.y < 0) this.pos.y = height;

		this.c = color(this.c.levels[0],0,this.c.levels[2],250-this.age);
		this.age += random(1,5);
	}
	
	this.show = function(){
		fill(this.c);
		stroke(this.c);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		this.update();
	}
}

function collided(i, j){
	var d = cars[i].pos.dist(cars[j].pos);
	if( d < interDist && cars[i].young() && cars[j].young() && cars.length < maxCars && cars[i].charge != cars[j].charge){
		var ideal = createVector(cars[j].pos.x-cars[i].pos.x, cars[j].pos.y-cars[i].pos.y);
		if(cars[i].vel.x < ideal.x) cars[i].vel.x += interChange * d/50;
		else cars[i].vel.x -= interChange * d/50;
		if(cars[i].vel.y < ideal.y) cars[i].vel.y += interChange * d/50;
		else cars[i].vel.y -= interChange * d/50;
		//var prev = cars[i].vel.angleBetween(ideal);
		//cars[i].vel.rotate(-interChange);
		//if(prev < cars[i].vel.angleBetween(ideal)) cars[i].vel.rotate(interChange*2);
	}
	return d<cars[i].r && cars[i].charge != cars[j].charge;
}
