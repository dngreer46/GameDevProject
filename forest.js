var map, ground, platforms, trees, bullet, bullets, enemies, boss, damageSound, mapChange, forestMusic;
var fireRate = 1000;
var nextFire = 0;


demo.forest = function(){};

demo.forest.prototype = {
    preload: function(){
        //BG image
        game.load.image('forestBG', 'assets/maps/forestBG.png');
        
        // Preload tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        
        // Preload tilemap
        game.load.tilemap('forestMap', 'assets/maps/forestMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('john', 'assets/John.png', 65, 70);

        game.load.spritesheet('boss', 'assets/bossmini.png', 40, 40);
        
        // Weapons
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('gun', 'assets/Gun.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.audio('impact', 'assets/slaphit.mp3');
        game.load.audio('forestMusic', 'assets/forestMusic.mp3');


    }, 
    
    
    create: function(){
        
        villageMusic.stop();
        forestMusic = game.add.audio('forestMusic');
        forestMusic.play();
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        //Background
        game.add.tileSprite(0, 0, 1920, 477, 'forestBG');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 1920, 512);
        
        // Load map
        map = game.add.tilemap('forestMap');
        map.addTilesetImage('natureSet');
        
        //Map Layers
        ground = map.createLayer('Ground');
        platforms = map.createLayer('Platforms');
        trees = map.createLayer('Trees');
        
        // Map change
        mapChange = game.add.sprite(1910, game.world.height-100, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Map collision
        map.setCollision(44, true, ground);
        map.setCollision(44, true, platforms);
        setTileCollision(platforms, 44, {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        // Player
        player = game.add.sprite(32, game.world.height-96, 'john');
        player.scale.setTo(0.5, 0.5);
        //player.body.setSize(32, 70, 0, 0);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 5, true);
        player.animations.add('attack', [2, 3, 4], 10, true);
        //Camera
        game.camera.follow(player);
        

        // Enemy Group
        enemies = game.add.group();
        enemies.enableBody = true;
        boss = enemies.create(350, game.world.height-100, 'boss');
        boss = enemies.create(768, game.world.height-100, 'boss');
        boss = enemies.create(1216, game.world.height-100, 'boss');
        boss = enemies.create(1056, 192, 'boss');
        boss = enemies.create(1440, 288, 'boss');
        enemies.callAll('animations.add', 'animations', 'blob', [0, 1, 2, 3], 7, true);
        enemies.callAll('play', null, 'blob');
        enemies.setAll('body.gravity.y', 500);
        
        //set properties for bullets
        //set properties for bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', -5);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('scale.x', 0.8);
        bullets.setAll('scale.y', 0.8);
        
        //add sound
        damageSound = game.add.audio('impact');
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        items.create(224, game.world.height-96, 'gun');
        items.setAll('scale.x', 2)
        items.setAll('scale.y', 2)

        //inventory
        inventoryBox = game.add.graphics(0, 0);
        inventoryBox.beginFill(0x77bdea);
        inventoryBox.alpha = 0;
        inventoryBox.drawRect(200, 20, 400, 100);
        inventoryBox.fixedToCamera = true;
        inventoryText = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
        inventoryText.fixedToCamera = true;
        
        playerHealth = game.add.group();
        healthArray = [];
        for (var i = 0; i < 3; i++){
            playerHealth.create(i * 50, 0, 'health');
            healthArray.push(i);

        }
        playerHealth.fixedToCamera = true;
        playerHealth.setAll('scale.x', 3);
        playerHealth.setAll('scale.y', 3);
        
        //time event to deal damage to the player
        game.time.events.repeat(2000, 100, this.overlapFalse, this);     
        
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
        
        // Collision
        game.physics.arcade.collide(enemies, ground);
        game.physics.arcade.collide(enemies, platforms);
        
        // Player Movement
        playerMovement(player);

        // Damage
        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy, null, this);
        game.physics.arcade.overlap(player, enemies, this.playerHit, null, this);
        
        // Pick up item
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        // Map change
        game.physics.arcade.overlap(mapChange, player, this.toLab);

    },

    
    hitEnemy: function(boss, bullet){
        bullet.kill();
        boss.kill();
        damageSound.play();
    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);               
        item.kill();
        
    },
    
    toLab: function(){
        forestMusic.stop();
        game.state.start('bossState');    
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
    }
};