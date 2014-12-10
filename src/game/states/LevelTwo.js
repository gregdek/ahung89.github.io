require('../Common');

var Bird = require('../enemies/Bird');
var GunDog = require('../enemies/GunDog');
var Phoenix = require('../enemies/Phoenix');
var Wolf = require('../enemies/Wolf');

var Level = require('./Level');
var VineLevel = require('./level_types/VineLevel');
var FallingPlatformLevel = require('./level_types/FallingPlatformLevel');

var VINE_TILE_INDICES = [36, 37, 56, 57];

LevelTwo= function() {
	VineLevel.call(this, VINE_TILE_INDICES, 'Foreground', 15, 10);

	this.birdSpawnLocations = [{x:14, y:20, direction: 'right'}, {x:26, y:35, direction: 'left'}, {x:15, y:32, direction: 'right'}, {x:0, y:27, direction: 'right'}, 
		{x:44, y:27, direction: 'right'}, {x:54, y:23, direction: 'left'}, {x:47, y:31, direction: 'right'}];
	this.phoenixSpawnLocations = [{x: 47, y: 11, direction: 'right'}, {x: 56, y: 11, direction: 'left'}, {x: 56, y: 37, direction: 'right'},
		{x: 56, y: 11, direction: 'left'}, {x: 63, y: 35, direction: 'right'}, {x: 71, y: 36, direction: 'left'}, {x: 70, y: 38, direction: 'left'}];
	this.gunDogSpawnLocations = [{x: 29, y: 44, direction: 'left'}, {x: 15, y: 39, direction: 'right'}, {x: 25, y: 37, direction: 'left'}, {x: 13, y: 34, direction: 'right'},
		{x: 38, y: 46, direction: 'right'}];
	this.wolfSpawnLocations = [{x: 23, y: 46, direction: 'left'}, {x: 10, y: 48, direction: 'left'}, {x: 25, y: 21, direction: 'left'}, {x: 29, y: 19, direction: 'left'},
	 {x: 57, y: 29, direction: 'left'}, {x: 61, y: 44, direction: 'right'}, {x: 64, y: 44, direction: 'right'}, {x: 70, y: 44, direction: 'right'},
	 {x: 81, y: 35, direction: 'right'}];

	this.fallingPlatformLocations = [{x: 82, y: 43}, {x: 89, y: 40}];
	this.movingPlatforms = [];

	this.emptySpaceTiles = [1];

	FallingPlatformLevel.call(this, this.fallingPlatformLocations);

	this.startingCameraPosX = 0;
	this.startingCameraPosY = 0;

	// The beginning
	// this.spawnPosX = 4  * TILE_SIZE;
	// this.spawnPosY = 45 * TILE_SIZE;

	// Right before the 4 phoenixes
	// this.spawnPosX = 47  * TILE_SIZE;
	// this.spawnPosY = 40 * TILE_SIZE;

	this.spawnPosX = 75  * TILE_SIZE;
	this.spawnPosY = 42 * TILE_SIZE;
};


LevelTwo.prototype = {
	create: function() {
		this.initLevel('levelTwo', 'area01_level_tiles', 'levelTwoTiles');

		bg = game.add.tileSprite(0, 0, 1366, 768, 'space');
		bg.fixedToCamera = true;

		this.createLayers();
		this.createEnemies();
		this.setTileCollisions();
		this.buildLevelComponents();

		player.create();
	},

	createLayers: function() {
		this.layer = this.map.createLayer('World');
		this.foreground = this.map.createLayer('Foreground');

		this.layer.resizeWorld();
		this.foreground.resizeWorld();
	},

	createEnemies: function() {
		this.spawnEnemies(Bird, this.birdSpawnLocations);
		this.spawnEnemies(Phoenix, this.phoenixSpawnLocations);
		this.spawnEnemies(GunDog, this.gunDogSpawnLocations);
		this.spawnEnemies(Wolf, this.wolfSpawnLocations);
	},

	spawnEnemies: function(EnemyType, spawnSettings) {
		spawnSettings.forEach(function(settings) {
			this.enemies.push(new EnemyType(settings.x * TILE_SIZE, settings.y * TILE_SIZE, settings.direction));
		}, this);
	},

	update: function() {
		player.update();
		
		this.enemies.forEach(function(enemy) {
			enemy.update();
		});

		this.checkFallingPlatformCollisions();
	},

	setTileCollisions: function() {
		this.map.setCollisionBetween(2, 8);
		this.map.setCollisionBetween(24, 27);
		this.map.setCollisionBetween(41, 45);
		this.map.setCollisionBetween(51, 53);
		this.map.setCollisionBetween(61, 62);
		this.map.setCollisionBetween(70, 72);
		this.map.setCollision(75);
		this.map.setCollision(92);
		this.map.setCollisionBetween(112, 114);
		this.map.setCollisionBetween(121, 125);

		// Spikes
		this.map.setTileIndexCallback(92, this.handleSpikeCollision, player);

		this.setVineCollisions();
	},

	// This callback function will be called in the physics arcade system's separateTile method, which automatically 
	// passes the colliding sprite body and the tile as arg1 and arg2.
	handleSpikeCollision: function(sprite, tile) {
		if(sprite === player.sprite) {
			player.killPlayer();
		}

		return true;  // Return something so that collision handling physics will be applied after this callback.
	},

	tearDownLevelComponents: function() {
		this.fallingPlatforms.destroy();
	},

	buildLevelComponents: function() {
		this.createPlatforms();
	}
}

$.extend(LevelTwo.prototype, Level.prototype);
$.extend(LevelTwo.prototype, VineLevel.prototype);
$.extend(LevelTwo.prototype, FallingPlatformLevel.prototype);

module.exports = LevelTwo;