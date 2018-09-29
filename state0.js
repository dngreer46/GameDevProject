var player;
var boss;
var speed = 4;
var bullets;
var bullet;
var velocity = 500;
var fireRate = 300;
var nextFire = 0;
var boss_health = 100
var bossHealth;
var demo = {};

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('john', 'assets/John.png', 35, 70);
        game.load.image('boss', 'assets/boss.png');
        game.load.image('bullet', 'assets/bullet.png');
    },
    
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#ffffff';
        
        player = game.add.sprite(32, game.world.height - 150, 'john');
        boss = game.add.sprite(500, game.world.height - 150, 'boss');
        
        bossHealth = game.add.text(540, 0, 'Boss Health: 100', { fontSize: '32px', fill: '#000000' });
        
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(boss);

        player.body.bounce.y = .1;
        player.body.gravity.y = 150;
        player.body.collideWorldBounds = true;
        boss.body.gravity.y = 1000000000;
        boss.body.collideWorldBounds = true;
        

        player.animations.add('walk', [0, 1], true);


        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet')
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', -5);
        bullets.setAll('anchor.x', 0.5)

    },
    
    update: function(){
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
        game.physics.arcade.overlap(boss, bullet, this.hitEnemy);

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
        
        boss_health -= 10;
        bossHealth.text = 'Boss Health: ' + boss_health;
        
        if (boss_health == 0){
            boss.kill();
        }
         
    }
    
};