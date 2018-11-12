var boss;
var boss_health;
var bossHealth;
var overlap;
var damageSound;
var bossDialouge;
var inventoryBox;
var enemyE;
var enemies;

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
        loadPlayer(32, 250);

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
        game.add.tween(enemies).to( { x: game.world.randomX }, 2000, Phaser.Easing.Back.InOut, true, 0, 2000, true);
        
        //set properties for bullets
        createBullets();
        
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
        createInventory();
        
        //current item display
        displayCurrentItem(0, 0);
        
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
        currItem = inventoryArray[inventoryArray.indexOf(item)];
        
    },
    
    hitEnemy: function(enemy, bullet){
        bullet.kill();
        enemy.kill();
        damageSound.play();
    },

    
};

