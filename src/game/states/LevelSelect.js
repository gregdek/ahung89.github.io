var MenuButtons = require('../entities/MenuButtons.js');
var arrow = require('../entities/MenuArrow.js');
var FadableState = require('./state_types/FadableState.js');

function LevelSelect() {}

module.exports = LevelSelect;

LevelSelect.prototype = {
	create: function() {
		this.buttonSettings = [
			{key: 'forest_of_doom_button', yOffset: -40, callback: this.startLevelOne},
			{key: 'space_park_button', yOffset: 60, callback: this.startLevelTwo},
			{key: 'back_button', yOffset: 160, callback: this.loadMenu}
		];

		this.gameTitle = game.add.image(game.camera.width / 2, game.camera.height / 2 - 150, 'select_level');
		this.gameTitle.anchor.setTo(0.5, 0.5);

		this.buttons = new MenuButtons(this.buttonSettings);
		arrow.draw(this.buttons);
	},

	update: function() {
		arrow.animate();
		arrow.move();

		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			this.buttons.buttons[arrow.arrow.currentButton - 1].callbackFunction.call(this);
		}
	},

	startLevel: function(level) {
		if(!this.changingState) {
			this.changingState = true;
			this.fadeOut(function() {
				game.state.start(level);
			});
		}
	},

	startLevelOne: function() {
		this.startLevel("LevelOne");
	},

	startLevelTwo: function() {
		this.startLevel("LevelTwo");
	},

	loadMenu: function() {
		game.state.start("Menu");
	}
}

$.extend(LevelSelect.prototype, FadableState.prototype);