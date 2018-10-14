var map, ground, platforms, trees, player, playerHealth, bullet, bullets, enemies, boss, damageSound, items, inventory, currItem, inventoryArray, inventoryText, mapChange;
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
        game.load.spritesheet('john', 'assets/John.png', 35, 70);

        game.load.spritesheet('boss', 'assets/bossmini.png', 40, 40);
        
        // Weapons
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('gun', 'assets/Gun.png');

    }, 
    
    
    create: function(){
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
        player = game.add.sprite(1800, game.world.height-96, 'john');
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 5, true);
        
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

        //create inventory
        inventory = game.add.group();
        inventoryArray = [];
        inventoryText = game.add.text(50, game.world.height - 500, 'Inventory: ', {fontSize: '32px', fill: '#ffffff'});
        
        currItem = inventoryArray[0];
        
        inventoryText.fixedToCamera = true;
        inventoryText.cameraOffset.setTo(40, 5);

    }, 
    
    
    
    
    update: function(){
        // Collision
<<<<<<< HEAD
=======

>>>>>>> master
        game.physics.arcade.collide(enemies, ground);
        game.physics.arcade.collide(enemies, platforms);
        
        // Player Movement
<<<<<<< HEAD
        player.body.velocity.x = 0;
        playerMovement(player);
=======
        playerMovement(player);
        
>>>>>>> master

        // Damage
        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy, null, this);
        
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
        inventory.add(item);
        inventory.set(item, 'x', (inventory.getIndex(item) + 1) * 50);
        inventory.setAll('y', game.world.height-450);
        inventory.setAll('scale.x', 2);
        inventory.setAll('scale.y', 2);
        inventoryArray.push(item);
        currItem = inventoryArray[inventoryArray.indexOf(item)];


        
    },
    
    toLab: function(){        
        game.state.start('bossState');    
    },
    
}