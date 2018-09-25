window.onload = function () {
	
	
	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');
	
	game.state.add('Boot', BasicGame.Boot);
	game.state.add('Preloader', BasicGame.Preloader);
	game.state.add('MainMenu', BasicGame.MainMenu);
	game.state.add('Game', BasicGame.Game);
	
	
	// Now we start boot state
	game.state.start('Boot');
	
	
	
	
};