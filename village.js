
var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventoryBox, inventoryText, mapChange, tutorial, tutorialText, dialogueName, dialogueText, box, villageMusic;
var sarah, bob, paula

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
        game.load.spritesheet('john', 'assets/John.png', 65, 70);
        game.load.spritesheet('sarah', 'assets/Sarah.png', 35, 70);
        game.load.spritesheet('bob', 'assets/Bob.png', 35, 70);
        game.load.spritesheet('paula', 'assets/Paula.png', 35, 70);
        game.load.image('gun', 'assets/gun.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('blank', 'assets/blank.png');
        game.load.audio('villageMusic', 'assets/villageMusic.mp3');

    },
    
    create: function(){
        
        villageMusic = game.add.audio('villageMusic');
        villageMusic.play();
        
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
        
        mapChangeHouse = game.add.sprite(545, 2529, 'blank');
        game.physics.arcade.enable(mapChangeHouse);
        
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
        
        // Add Sarah sprite
        sarah = game.add.sprite(850, game.world.height-197, 'sarah');
        sarah.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(sarah);
        sarah.body.gravity.y = 500;
        
        // Bob
        bob = game.add.sprite(550, 1698, 'bob');
        bob.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(bob);
        bob.body.gravity.y = 500;
        
        // Paula
        paula = game.add.sprite(900, 1698, 'paula');
        paula.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(paula);
        paula.body.gravity.y = 500;
        
        
        // Add John sprite
        player = game.add.sprite(950, 1698, 'john');
        //player = game.add.sprite(256, game.world.height-197, 'john');
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.setSize(32, 70, 0, 0);
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 10, true);
        player.animations.add('attack', [2, 3, 4], 10, true);
        
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
        
        //inventory
        inventoryBox = game.add.graphics(0, 0);
        inventoryBox.beginFill(0x77bdea);
        inventoryBox.alpha = 0;
        inventoryBox.drawRect(200, 20, 400, 100);
        inventoryBox.fixedToCamera = true;
        inventoryText = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
        inventoryText.fixedToCamera = true;
        
        //dialouge
        box = game.add.graphics(0, 0);
        box.beginFill(0x77bdea);
        box.alpha = 0;
        box.drawRect(200, 20, 400, 200);
        box.fixedToCamera = true;
        dialogueName = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
        dialogueName.fixedToCamera = true;
        dialogueText = game.add.text(210, 75, '', {fontSize: '15px', fill: '#000'});
        dialogueText.fixedToCamera = true;

      

    },
    
    update: function(){
        
        game.physics.arcade.collide(sarah, ground);
        game.physics.arcade.collide(bob, ground);
        game.physics.arcade.collide(paula, ground);

        
        playerMovement(player);
        
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        game.physics.arcade.overlap(mapChange, player, this.toForest);
        
        game.physics.arcade.overlap(tutorial, player, this.showTutorial);
        
        var atDoor = game.physics.arcade.overlap(mapChangeHouse, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.E)) {
            this.toHouse();
        }
        
        // Overlap NPC
        var atSarah = game.physics.arcade.overlap(sarah, player)
        var atPaula = game.physics.arcade.overlap(paula, player)
        var atBob = game.physics.arcade.overlap(bob, player)
        
        // Sarah dialogue
        if (atSarah) {
            box.alpha = 0.8;
            dialogueName.text = 'Sarah:';
            dialogueText.text = 'Hi brother! It is such a nice day today. \nI want to play outside but I left my kite in the house, \nand the door is locked!\nWill you please find the key for me?';
        }
        
        // Paula dialogue
        else if (atPaula) {
            box.alpha = 0.8;
            dialogueName.text = 'Paula:';
            dialogueText.text = 'Hiya neighbor! Fine weather we have today.';
        }
        
        // Bob dialogue
        else if (atBob) {
            box.alpha = 0.8;
            dialogueName.text = 'Bob:';
            dialogueText.text = 'Good mornin, John! How are you today?';
        }
        
        // Get rid of text box if not overlapping NPC
        else {
            box.alpha = 0;
            dialogueName.text = '';
            dialogueText.text = '';
        }

        

    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);
        item.kill();
        currItem = inventoryArray[inventoryArray.indexOf(item)];

    },
    
    toForest: function(){        
        game.state.start('forest');    
    },
    
    toHouse: function(){
        game.state.start('house');    
    },
    
    showTutorial: function(){        
        tutorialText.text += '\nShoot: SPACE'
        //tutorialText.fixedToCamera = true;
        tutorial.kill();
    },
    

    

};