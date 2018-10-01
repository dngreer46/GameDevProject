var player;
var boss;
var ground;
var playerHealth;
var health;
var speed = 4;
var bullets;
var bullet;
var velocity = 500;
var fireRate = 300;
var nextFire = 0;
var boss_health;
var bossHealth;
var overlap;
var damageSound;
var demo = {};

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('john', 'assets/John.png', 35, 70);
        game.load.spritesheet('boss', 'assets/boss.png', 100, 100);
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('ground', 'assets/labtile.png');
        game.load.audio('impact', 'assets/slaphit.mp3');
    },
    

    create: function(){
        overlap = false;
        
        //add physics to game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#4B4B4B';
                
        
        //add sprites
        player = game.add.sprite(32, game.world.height - 250, 'john');
        boss = game.add.sprite(500, game.world.height - 240, 'boss');
        ground = this.add.tileSprite(0,this.game.height-140,this.game.world.width,70,'ground');


        //add health
        bossHealth = game.add.text(540, 0, 'Boss Health: 100', { fontSize: '32px', fill: '#fff' });
        playerHealth = game.add.text(10, 0, 'Player Health: 100', {fontSize: '32px', fill: '#fff'});
        health = 100;
        boss_health = 100;
        
        //enable physics for sprites
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(boss);  
        game.physics.arcade.enable(ground);
        
        //set properties for ground
        ground.body.immovable = true;
        ground.body.allowGravity = false;
        
        //set properties for player
        player.body.bounce.y = 0.1;
        player.body.gravity.y = 150;
        player.body.collideWorldBounds = true;
        player.animations.add('walk', [0, 1], true);

        //set properties for boss
        boss.body.gravity.y = 150;
        boss.body.allowGravity = false;
        boss.body.collideWorldBounds = true;
        boss.body.immovable = true;
        boss.body.velocity.x = -200;

        //set properties for bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', -5);
        bullets.setAll('anchor.x', 0.5);
        
        //add sound
        damageSound = game.add.audio('impact');
        
        //time event to deal damage to the player
        game.time.events.repeat(2000, 100, this.overlapFalse, this);

    },
    
    update: function(){

        game.physics.arcade.collide(boss, ground);
        game.physics.arcade.collide(player, ground);
        
        
        //player movement and actions
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            player.x += speed;
            player.animations.play('walk', 14, true);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            player.x -= speed;
            player.animations.play('walk', 14, true);
        }
        else{
            player.animations.stop('walk');
            player.frame = 0;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            player.y -= speed;
            if(player.y < 150){
                player.y = 150;
            }
        }
        if (game.input.activePointer.isDown){
            this.fire();
        }
             
        //boss movement
        if (boss.x <= 100){
            boss.body.velocity.x = 200;
            boss.frame = 0;
        }
        else if (boss.x >= 660){
            boss.body.velocity.x = -200;
            boss.frame = 1;
        }
        //damage player
        game.physics.arcade.overlap(player, boss, this.playerHit, null, this);

        //damage boss
        game.physics.arcade.overlap(boss, bullet, this.hitEnemy, null, this);
        
    },
    
    fire: function(){
        if(game.time.now > nextFire){
            nextFire = game.time.now + fireRate;
            bullet = bullets.getFirstDead();
            bullet.reset(player.x, player.y);
            
            game.physics.arcade.moveToPointer(bullet, velocity);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);
        }
    },
    
     hitEnemy: function(boss, bullet){
        bullet.kill();
        
        damageSound.play();
        boss_health -= 10;
        bossHealth.text = 'Boss Health: ' + boss_health;
        
        if (boss_health == 0){
            boss.kill();
        }
         
    },

    playerHit: function(player) {
        if (!overlap){
            overlap = true;
            health -= 10;
            damageSound.play();
            playerHealth.text = 'Player Health: ' + health;        
        }
        
        if (health == 0){
            player.kill();
            this.changeState();
        }
        
    },
    
    overlapFalse: function() {
        overlap = false;

    },
    
    changeState: function(){
        game.state.start('state1');
    }
    
};