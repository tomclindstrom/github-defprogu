

BasicGame.Preloader = function (game) {
	
	this.background = null;
	this.preloadBar = null;	
	
};

BasicGame.Preloader.prototype = {
	
	
	preload: function() {
		
		// 
		this.stage.backgroundColor = '#2d2d2d';

		this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
		this.add.text(this.game.width /2, this.game.height /2 -30, "LOADING...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);
		
		
		
		// This sets preloadBar sprite as a loader sprite
		// What that does is automatically crop the sprite from 0 to full-width
		// as the files below are loaded in.
		
		this.load.setPreloadSprite(this.preloadBar);
		
		// Game assets 
		this.load.image('titlepage', 'assets/titlepage.png');
		this.load.image('sea', 'assets/sea.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image('enemyBullet', 'assets/enemy-bullet.png');
		this.load.image('powerup1', 'assets/powerup1.png');
		this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
		this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32,32);
		this.load.spritesheet('boss', 'assets/boss.png',93,32);
		this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32 );
		this.load.spritesheet('player', 'assets/player.png?' + Date.now(), 64, 64);
		
		this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
		this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
		this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
		this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
		this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
		
		
		
	},
	
	create: function() {
		
		this.preloadBar.cropEnabled = false;
	},
	
	update: function() {
		
		this.state.start('MainMenu');
		
	}
	
	
	
	
	
};