(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
context = canvas.getContext("2d");
	
function Vector(x, y) {
	this.x = x;
	this.y = y;
	this.add = function (vec2) {
		this.x += vec2.x;
		this.y += vec2.y;
	}
        this.setTo = function (vec2) {
		this.x=vec2.x;   	
		this.y=vec2.y;
	}
}
//object.property
	
function Renderer(canvas, context) {
	this.beginScene = function beginScene() {
		context.fillStyle = Game.Constants.mapColor;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	this.drawUnit = function drawUnit(unit) {
		context.fillStyle = unit.color;
		context.fillRect(unit.location.x, unit.location.y, unit.size.x, unit.size.y);
	}
        this.drawSelectionZone = function drawSelectionZone(selectionZone) {
                context.fillStyle = "rgba(0,0,255,0.25)";
                context.fillRect(selectionZone.start.x, selectionZone.start.y, selectionZone.size.x, selectionZone.size.y);
                context.fillStyle = "rgba(0,0,255,1)";
 		context.strokeRect(selectionZone.start.x, selectionZone.start.y, selectionZone.size.x, selectionZone.size.y)
        }
}
	
function PhysicsEngine() {
	this.moveUnit = function moveUnit(unit) {
		unit.location.add(unit.velocity);
	}
        function unitsCollide(unit1, unit2) {
                
        }
        this.collideUnit = function collideUnit(unit, platform) {
                
	}
}
	
var Game = {};
Game.Constants = {
	mapColor: "green",
	unitSize: new Vector(20, 20),
	updateTime: 5,
};
Game.renderer = new Renderer(canvas, context);
Game.physicsEngine = new PhysicsEngine(Game.Constants.gravity);
Game.mouse = [];
Game.mouse.buttons = {
        left: 1,
};
Game.mouse.location = new Vector(0, 0);

function SelectionZone() {
        this.start = new Vector(0, 0);
        this.finish = new Vector(0, 0);
        this.size = new Vector(0, 0);
        this.refresh = function refresh() {
        	this.size = new Vector(-(this.start.x-this.finish.x), -(this.start.y-this.finish.y));     
        }            
}
var selectionZone = new SelectionZone;
var startedSelection=false;	

function renderScene() {
	Game.renderer.beginScene();
        if (startedSelection) Game.renderer.drawSelectionZone(selectionZone);
	requestAnimationFrame(renderScene);
}
	
function update() {
        if (startedSelection) {
		if (Game.mouse[Game.mouse.buttons.left]) {
		        selectionZone.finish.setTo(Game.mouse.location); 
		        selectionZone.refresh();
		        
		} else {
		        selectionZone.finish.setTo(Game.mouse.location);
		        selectionZone.refresh();
		        startedSelection=false;
		}
        } else {
		if (Game.mouse[Game.mouse.buttons.left]) {
		        selectionZone.start.setTo(Game.mouse.location);
		        selectionZone.finish.setTo(Game.mouse.location);
		        selectionZone.refresh();
		        startedSelection=true;
		}	
        }

	setTimeout(update, Game.Constants.updateTime);
}

window.onmousemove = function (mouseInfo) {
        Game.mouse.location.x=mouseInfo.x;
        Game.mouse.location.y=mouseInfo.y;
}
window.onmousedown = function (buttonInfo) {
	Game.mouse[buttonInfo.which] = true;
}
window.onmouseup = function (buttonInfo) {
        Game.mouse[buttonInfo.which] = false;
}

renderScene();
update();
