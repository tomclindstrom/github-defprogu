BasicGame.Game = function(game) {




};


BasicGame.Game.prototype = {

	create: function () {
		
		this.setupBackground();
		this.setupPlayer();
		this.setupEnemies();
		this.setupBullets();
		this.setupExplosions();
		this.setupPlayerIcons();
		this.setupText();
		this.setupAudio();
		
		this.cursors = this.input.keyboard.createCursorKeys();
	},
	
	update: function() {
		
		this.checkCollisions();
		this.spawnEnemies();
		
		//this.processPlayerInput();
		//this.fire();
		
		
	},
	
	render: function(){
		
	},
	
	setupBackground: function() {
	this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
    this.sea.autoScroll(0, BasicGame.SEA_SCROLL_SPEED);
	},
	
	setupPlayer: function(){
		
		this.player = this.add.sprite(this.game.width /2, this.game.height -50, 'player');
		this.player.anchor.setTo(0.5,0.5);
		// 12.09 gör animationen till player todo Frame 0,1,2
		// todo insert one frame of the plae in the beginning  solution [0,1,2,0]
		this.player.animations.add('fly', [0,1,2,0], 20, true);		
		
		// ghost animation get player tinted
		this.player.animations.add('ghost', [3,0,3,1], 20, true);
		
		// play fly animation
		this.player.play('fly', 20);
		
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		
		this.player.body.collideWorldBounds = true;
		// 20x20 pixel hitbox, centered a little bit higher than the centered
		this.player.body.setSize(20,20,0,-5);
		
		this.weaponLevel = 0;
		
		
	},
	
	setupEnemies: function () {
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(50, 'greenEnemy');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true);
    this.enemyPool.setAll(
      'dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true
    );

    // Set the animation for each sprite
    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);
      enemy.events.onAnimationComplete.add( function (e) {
        e.play('fly');
      }, this);
    });

    this.nextEnemyAt = 0;
    this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

    this.shooterPool = this.add.group();
    this.shooterPool.enableBody = true;
    this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooterPool.createMultiple(20, 'whiteEnemy');
    this.shooterPool.setAll('anchor.x', 0.5);
    this.shooterPool.setAll('anchor.y', 0.5);
    this.shooterPool.setAll('outOfBoundsKill', true);
    this.shooterPool.setAll('checkWorldBounds', true);
    this.shooterPool.setAll(
      'reward', BasicGame.SHOOTER_REWARD, false, false, 0, true
    );
    this.shooterPool.setAll(
      'dropRate', BasicGame.SHOOTER_DROP_RATE, false, false, 0, true
    );

    // Set the animation for each sprite
    this.shooterPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);
      enemy.events.onAnimationComplete.add( function (e) {
        e.play('fly');
      }, this);
    });

    // start spawning 5 seconds into the game
    this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
    this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;

    this.bossPool = this.add.group();
    this.bossPool.enableBody = true;
    this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bossPool.createMultiple(1, 'boss');
    this.bossPool.setAll('anchor.x', 0.5);
    this.bossPool.setAll('anchor.y', 0.5);
    this.bossPool.setAll('outOfBoundsKill', true);
    this.bossPool.setAll('checkWorldBounds', true);
    this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);
    this.bossPool.setAll(
      'dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0, true
    );

    // Set the animation for each sprite
    this.bossPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);
      enemy.events.onAnimationComplete.add( function (e) {
        e.play('fly');
      }, this);
    });

    this.boss = this.bossPool.getTop();
    this.bossApproaching = false;
  },
	

  setupBullets: function () {
    this.enemyBulletPool = this.add.group();
    this.enemyBulletPool.enableBody = true;
    this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBulletPool.createMultiple(100, 'enemyBullet');
    this.enemyBulletPool.setAll('anchor.x', 0.5);
    this.enemyBulletPool.setAll('anchor.y', 0.5);
    this.enemyBulletPool.setAll('outOfBoundsKill', true);
    this.enemyBulletPool.setAll('checkWorldBounds', true);
    this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);

    // Add an empty sprite group into our game
    this.bulletPool = this.add.group();

    // Enable physics to the whole sprite group
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    //   sets the initial state as non-existing (i.e. killed/dead)
    this.bulletPool.createMultiple(100, 'bullet');

    // Sets anchors of all sprites
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);

    // Automatically kill the bullet sprites when they go out of bounds
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);

    this.nextShotAt = 0;
    this.shotDelay = BasicGame.SHOT_DELAY;
  },
  
  
  setupExplosions: function () {
    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);
    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add('boom');
    });
  },
  
  setupPlayerIcons: function() {
	  
	this.powerUpPool = this.add.group();
    this.powerUpPool.enableBody = true;
    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.powerUpPool.createMultiple(100, 'powerup1');
    this.powerUpPool.setAll('anchor.x', 0.5);
    this.powerUpPool.setAll('anchor.y', 0.5);
	this.powerUpPool.setAll('outOfBoundsKill', true);
    this.powerUpPool.setAll('checkWorldBounds', true);
    this.powerUpPool.setAll(
      'reward', BasicGame.POWERUP_REWARD, false, false, 0, true
    );
	  
	this.lives = this.add.group();
		// calculate location of the first life icon
	var firstLifeIconX = this.game.width -20 -(BasicGame.PLAYER_EXTRA_LIVES * 30);
	for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++) {
		var life = this.lives.create(firstLifeIconX + (30 *i), 30, 'player');
		// we scale life
		life.scale.setTo(0.5,0.5);
		life.anchor.setTo(0.5,0.5);
		
	}
	  
	  
	  
  },
  
  // Gör setup Text 'Use Arrow Keys to Move, Press Z / space to Fire'
  
  setupText: function() {
	  
		this.instructions = this.add.text(
			this.game.width / 2,
			this.game.height -100,
			'Use Arrow Keys to Move , Press space to Fire\n' +
			'Tapping/clicking does both',
			{font: '20px monospace', fill: '#fff', align: 'center'}
			);
		this.instructions.anchor.setTo(0.5,0.5);
		this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE;
		
		
		// Score text 
		
		this.score = 0;
		this.scoreText = this.add.text(
			this.game.width /2 , 30, '' + this.score,
			{font: '20px monospace', fill: '#fff', align: 'center'}	
		);
			
		this.scoreText.anchor.setTo(0.5,0.5);	
  
		
	  
	  
	  
  },
  
  setupAudio: function() {
	  
		this.sound.volume = 0.3;
		this.explosionSFX = this.add.audio('explosion');
		// Put boss soundsFX in here in future
		this.playerExplosionSFX = this.add.audio('plaerExplosion');
		this.enemyFireSFX = this.add.audio('enemyFire');
		this.playerFireSFX = this.add.audio('playerFire');
		this.powerUpSFX = this.add.audio('powerUp');
	  
	   
	  
  },
  
  
  // update() . related functions
  
  checkCollisions: function() {
	  
	  this.physics.arcade.overlap(
		this.bulletPool, this.enemyPool, this.enemyHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.bulletPool, this.shooterPool, this.enemyHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.player, this.enemyPool, this.playerHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.player, this.shooterPool, this.playerHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.player, this.enemyBulletPool, this.playerHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.player, this.bossPool, this.playerHit, null, this
	  
	  );
	  
	  this.physics.arcade.overlap(
		this.player, this.powerUpPool, this.playerPowerUp, null, this
	  
	  );
	  
		  if(this.bossApproaching == false){
			  this.physics.arcade.overlap(
				this.bulletPool, this.bossPool, this.enemyHit,null,this
			  );
			  
		  }
	  
	 
  
  
  },
  
  spawnEnemies: function() {
	  
		if(this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {  
			  
			  this.nextEnemyAt = this.time.now + this.enemyDelay;
			  
			  var enemy = this.enemyPool.getFirstExists(false);
			  
			  // spawn at a random location top of the screen
			  enemy.reset(
				this.rnd.integerInRange(20, this.game.width -20),0,
				BasicGame.ENEMY_HEALTH
			  
			  );
			  
			  
			  // enemy coming with random speed
			  enemy.body.velocity.y = this.rnd.integerInRange(
				BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY
			  
			  );
			  enemy.play('fly');
			  
			  
		  
		} 

		// shooter	
		
		if(this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {  
			  
			  this.nextShooterAt = this.time.now + this.shooterDelay;
			  
			  var shooter = this.shooterPool.getFirstExists(false);
			  
			  // spawn at a random location top of the screen
			  shooter.reset(
				this.rnd.integerInRange(20, this.game.width -20),0,
				BasicGame.SHOOTER_HEALTH
			  
			  );
			  
			  // We choose random target location at the bottom
			  var target = this.rnd.integerInRange(20, this.game.width -20);
			  
			  // move to target and rotate the sprite accordingly
			  
			  shooter.rotation = this.physics.arcade.moveToXY(
				shooter, target,this.game.height,
				this.rnd.integerInRange(
					BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY
					
			    )
			  ) - Math.PI/2;
			  shooter.play('fly');
			 // each shooter has their own shot timer
				shooter.nextShotAt = 0;
			  
			  
			  
		  
		} 
	  
	  
  }
  
  
	
	
};