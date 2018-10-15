var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventory, inventoryText, inventoryArray, inventoryParent, currItem, mapChange, tutorial, tutorialText;

demo.village = function(){};

demo.village.prototype = {
    
    preload: function(){
        game.load.image('sky', 'assets/maps/sky.png');
        
        // Preload tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        game.load.image('houseSet', 'assets/maps/house2.png');
        
        // Preload tilemap
        game.load.tilemap('villageMap', 'assets/maps/villageMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('john', 'assets/John.png', 35, 70);
        game.load.image('gun', 'assets/gun.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.spritesheet('johnAttack', 'assets/johnAttack.png', 64, 70);
        game.load.image('blank', 'assets/blank.png');

    },
    
    create: function(){
        
        // Background image
        game.add.tileSprite(0, 0, 1792, 2720, 'sky');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 1792, 2720);
        
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        // Load map
        map = game.add.tilemap('villageMap');
        map.addTilesetImage('natureSet');
        map.addTilesetImage('houseSet');
        
        // Map layers
        ground = map.createLayer('Ground');
        walls = map.createLayer('Walls');
        platforms = map.createLayer('Platforms');
        houses = map.createLayer('Houses');
        plantsAndSigns = map.createLayer('PlantsSigns');
        
        // Map change
        mapChange = game.add.sprite(1787, 1152, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Tutorial sign
        tutorial = game.add.sprite(192, game.world.height-192, 'blank');
        game.physics.arcade.enable(tutorial);
        tutorialText = game.add.text(100, game.world.height-100, 'Move Left/Right: A/D\nJump: W', {fontSize: '18px', fill: '#ffffff' });  
        
        // Map collision
        map.setCollision([43, 44, 45], true, ground);
        map.setCollision([44, 1610612780, 2684354604], true, walls);
        map.setCollision(44, true, platforms);
        setTileCollision(platforms, 44, {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        // Add Sprites
        player = game.add.sprite(256, game.world.height-197, 'john');
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 5, true);
        
        //Camera
        game.camera.follow(player);
        
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
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        items.create(230, game.world.height-190, 'gun');
        items.create(150, game.world.height-190, 'pickAxe');
        items.create(1000, game.world.height-190, 'health');
        items.create(1500, game.world.height-250, 'key');
        
        //create inventory
        inventory = game.add.group();
        inventoryArray = [];
        inventoryText = game.add.text(10, game.world.height - 2720, 'Inventory: ', {fontSize: '32px', fill: '#ffffff'});
        
        currItem = inventoryArray[0];
        
        inventoryText.fixedToCamera = true;
        //inventoryText.cameraOffset.setTo(40, 5);
        
        inventoryParent = game.add.graphics(0, 0);
        inventoryParent.beginFill(0xffffff, 0.3);
        inventoryParent.lineStyle(0, 0xffffff, 1);
        inventoryParent.drawRect(inventoryText.x, inventoryText.y + 40, 350, 30);
        inventoryParent.fixedToCamera = true;
        console.log(inventoryText.x, inventoryText.y);
        console.log(inventoryParent.x, inventoryParent.y);
        

      
    },
    
    update: function(){

        
        playerMovement(player);
        
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        game.physics.arcade.overlap(mapChange, player, this.toForest);
        
        game.physics.arcade.overlap(tutorial, player, this.showTutorial);

        

    },
    
    addInventory: function(player, item){
        inventory.add(item);
        inventory.set(item, 'x', (inventory.getIndex(item) + 1) * 30);
        inventory.setAll('y', game.world.height-2675);
        inventory.fixedToCamera = true;
        inventory.setAll('scale.x', 2);
        inventory.setAll('scale.y', 2);
        inventoryArray.push(item);
        console.log(inventoryArray);
        currItem = inventoryArray[inventoryArray.indexOf(item)];
        console.log(currItem);
        console.log(inventory);
        
        
    
    },
    
    toForest: function(){        
        game.state.start('forest');    
    },
    
    showTutorial: function(){        
        tutorialText.text += '\nShoot: SPACE'
        //tutorialText.fixedToCamera = true;
        tutorial.kill();
    },

    

    

};