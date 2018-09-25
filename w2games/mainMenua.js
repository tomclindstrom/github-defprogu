BasicGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {
	this.add.sprite(0,0, 'titlepage');

	this.loadingText = this.add.text(this.game.width /2, this.game.height /2 + 80, "Press Z or tap/click to game start", {font: "20px monospace", fill: "#fff"});
	this.loadingText.anchor.setTo(0.5,0.5);  
	  // insert game start button on key down on key press
	  
	  // call start game function.
	  
	  // insert text start game
	  
  },
  
  update: function() {
	  // we check if the key Z or activepointer is down
	  if(this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
		  console.log("Start game check");
		  this.startGame();
 
	  }
	  
	  
	  
  },
  
  startGame: function(pointer) {
	  
	  this.state.start('Game');
  }
  
  
};