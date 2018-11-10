var boss;
var boss_health;
var bossHealth;
var overlap;
var damageSound;
var bossDialouge;
var inventoryBox;
var enemyE;
var enemies;

var demo = {};
demo.bossState = function(){};
demo.bossState.prototype = {
    preload: function(){
        game.load.spritesheet('john', 'assets/John.png', 65, 70);
        game.load.spritesheet('boss', 'assets/Boss.png', 100, 100);
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('ground', 'assets/labtile.png');
        game.load.audio('impact', 'assets/slaphit.mp3');               
        game.load.image('gun', 'assets/gun.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.spritesheet('enemy', 'assets/bossmini.png', 40, 40);

    },
    

    create: function(){
        overlap = false;
        
        //add physics to game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#4B4B4B';
                
        
        //add sprites
        player = game.add.sprite(32, game.world.height - 250, 'john');
        player.scale.setTo(0.5, 0.5);
        //player.body.setSize(32, 70, 0, 0);
        boss = game.add.sprite(500, game.world.height - 250, 'boss');
        ground = this.add.tileSprite(0,this.game.height-140,this.game.world.width,70,'ground');


        //add health
        bossHealth = game.add.text(540, 0, 'Boss Health: 100', {fontSize: '32px', fill: '#ffffff' });
        boss_health = 100;


        
        playerHealth = game.add.group();
        healthArray = [];
        for (var i = 0; i < 3; i++){
            playerHealth.create(i * 50, 0, 'health');
            healthArray.push(i);

        }
        
        playerHealth.setAll('scale.x', 3);
        playerHealth.setAll('scale.y', 3);
        
        //enable physics for sprites
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(boss);  
        game.physics.arcade.enable(ground);

        //set properties for ground
        ground.body.immovable = true;
        ground.body.allowGravity = false;
        
        //set properties for player
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        player.animations.add('walk', [0, 1], 10, true);

        //set properties for boss
        boss.body.gravity.y = 150;
        boss.body.allowGravity = false;
        boss.body.collideWorldBounds = true;
        boss.body.immovable = true;
        boss.body.velocity.x = -200;
        boss.animations.add('blob', [0, 1, 2, 3], 7, true);
        
        //create enemies 
        //enemyE = game.add.emitter(boss.x, boss.y, 30);
        //enemyE.makeParticles('boss', 0, 30, true, true);
        //enemyE.enableBody = true;
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        enemies.createMultiple(15, 'enemy');
        enemies.setAll('body.gravity.y', 500);
        enemies.setAll('collideWorldBounds', true);
        game.add.tween(enemies).to( { x: game.world.randomX }, 2000, "Linear", true, 2000, -1, true);
        
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
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        items.create(110, game.world.height-190, 'gun');
        items.create(130, game.world.height-190, 'health');
        items.setAll('scale.x', 2);
        items.setAll('scale.y', 2);
        
        //inventory
        inventoryBox = game.add.graphics(0, 0);
        inventoryBox.beginFill(0x77bdea);
        inventoryBox.alpha = 0;
        inventoryBox.drawRect(200, 20, 400, 100);
        inventoryBox.fixedToCamera = true;
        inventoryText = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
        inventoryText.fixedToCamera = true;
        
        //current item display
        itemBox = game.add.graphics(0, 0);
        itemBox.beginFill(0xECE6E5);
        itemBox.alpha = 0.8;
        itemBox.drawRect(740, game.world.height-70, 60, 60);
        itemBox.fixedToCamera = true;
        itemOnScreen = game.add.sprite(743, game.world.height-55, currItem.key);
        itemOnScreen.fixedToCamera = true;
        itemOnScreen.scale.x = 4;
        itemOnScreen.scale.y = 4;
        
    },
    
    update: function(){

        playerMovement(player);
        
        game.physics.arcade.collide(enemies, ground);

        //boss movement
        boss.animations.play('blob');
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
        game.physics.arcade.overlap(boss, bullet, this.hitBoss, null, this);
        
        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy, null, this);
        
        game.physics.arcade.overlap(items, player, this.addInventory);

        
    },
    
    render: function(){
        //game.debug.body(player);
  //      game.debug.body(ground);
//        enemy = enemies.getFirstAlive();
        //game.debug.body(enemy);
    },



    
    
     hitBoss: function(boss, bullet){
        bullet.kill();
        
        damageSound.play();
        boss_health -= 10;
        bossHealth.text = 'Boss Health: ' + boss_health;
        console.log(boss_health);
        
        if (boss_health == 70){
            for (var i = 0; i < 5; i++){
                enemy = enemies.getFirstDead();
                enemy.reset(200 + (i*50), 0);
            }
            //enemyE.on = true;
            //enemyE.start(true, 0, 15);
            //bossDialouge = game.add.text(game.world.width - 500, game.world.height - 400, 'You will never win', {fontSize: '32px', fill: '#ffffff' });
        }
        else if (boss_health == 0){
            boss.kill();
        }
         
    },

    playerHit: function(player) {
        if (!overlap){
            overlap = true;
            healthArray.pop();
            var heart = playerHealth.getFirstAlive();
            heart.kill();
            damageSound.play();
        }
        
        if (healthArray.length == 0){
            player.kill();
            this.changeState();
        }
        
    },
    
    overlapFalse: function() {
        overlap = false;

    },
    
    changeState: function(){
        game.state.start('youDied');
    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);
        item.kill();
        

        
    },
    
    hitEnemy: function(enemy, bullet){
        bullet.kill();
        enemy.kill();
        damageSound.play();
    },

    
};

