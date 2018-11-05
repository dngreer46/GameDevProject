var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, dialogueBox, villageMusic, itemOnScreen, itemText;
var sarah, bob, paula;


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
        game.load.spritesheet('john', 'assets/john.png', 63, 70, 5);
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
        
        villageMusic = game.add.audio('villageMusic', 0.3, true);
        villageMusic.play();
        
        // Background image
        game.add.tileSprite(0, 0, 3520, 640, 'sky');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 3520, 640);
        
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
        mapChange = game.add.sprite(3500, 480, 'blank');
        game.physics.arcade.enable(mapChange);
        
        mapChangeHouse = game.add.sprite(545, 544, 'blank');
        game.physics.arcade.enable(mapChangeHouse);
        

        
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
        sarah = game.add.sprite(850, 544, 'sarah');
        sarah.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(sarah);
        sarah.body.gravity.y = 500;
        
        // Bob
        bob = game.add.sprite(2785, 480, 'bob');
        bob.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(bob);
        bob.body.gravity.y = 500;
        
        // Paula
        paula = game.add.sprite(1960, 480, 'paula');
        paula.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(paula);
        paula.body.gravity.y = 500;
        
        
        // Add John sprite
        player = game.add.sprite(256, 544, 'john');
        //player = game.add.sprite(1500, game.world.height-250, 'john');

        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.setSize(35, 70, 0, 0);

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
        //items.create(1170, game.world.height-1015, 'gun');
        items.create(150, 544, 'pickAxe'); 
        items.create(1072, 455, 'key');   
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
        
        currItem = game.add.sprite(0, game.world.height - 2720, 'blank');
        
        itemText = game.add.text(600, game.world.height - 165, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        
        //current item display
        itemBox = game.add.graphics(0, game.world.height-195);
        itemBox.beginFill(0x5daf8a);
        itemBox.alpha = 0.65;
        itemBox = itemBox.drawRect(720, 0, 50, 50);
        itemBox.fixedToCamera = true;
        itemOnScreen = game.add.sprite(720, game.world.height-190, currItem.key);
        itemOnScreen.fixedToCamera = true;
        itemOnScreen.scale.x = 3.75
        itemOnScreen.scale.y = 3.75
        
        //dialouge
        dialogueBox = game.add.graphics(0, 0);
        dialogueBox.beginFill(0x77bdea);
        dialogueBox.alpha = 0;
        dialogueBox.drawRect(200, 20, 400, 200);
        dialogueBox.fixedToCamera = true;
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
        

        
        var atDoor = game.physics.arcade.overlap(mapChangeHouse, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if(currItem == undefined){
            }
            else if(currItem.key == 'key'){
                this.toHouse();
            }
        }
        
        // Overlap NPC
        var atSarah = game.physics.arcade.overlap(sarah, player)
        var atPaula = game.physics.arcade.overlap(paula, player)
        var atBob = game.physics.arcade.overlap(bob, player)
        var atForest = game.physics.arcade.overlap(mapChange, player)
        
        // Sarah dialogue
        if (atSarah) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sarah:';
            dialogueText.text = 'Hi brother! It is such a nice day today. \nI want to play outside but I left my kite in the house, \nand the door is locked!\nWill you please find the key for me?';
        }
        
        // Paula dialogue
        else if (atPaula) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Paula:';
            dialogueText.text = 'Hiya neighbor! Fine weather we have today.';
        }
        
        // Bob dialogue
        else if (atBob) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Bob:';
            dialogueText.text = 'Good mornin, John! How are you today?';
        }
        
        // Forest dialogue
        else if (atForest) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'John (you):';
            dialogueText.text = 'The forest is dangerous! \nI should look for the kite at home first.';
        }
        
        // Get rid of text box if not overlapping NPC
        else {
            dialogueBox.alpha = 0;
            dialogueName.text = '';
            dialogueText.text = '';
        }

        

    },
    
    render: function(){
        //game.debug.body(player);
    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);
        item.kill();

    },
    
    toForest: function(){        
        game.state.start('forest');    
    },
    
    toHouse: function(){
        villageMusic.stop();
        game.state.start('house');    
    },
    
   

    

};



