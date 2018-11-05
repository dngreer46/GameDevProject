var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, box, villageMusic, villageKidnappedMusic;
var sarah, bob, paula

demo.villageKidnapped = function(){};
demo.villageKidnapped.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/maps/sky.png');
        
        // Preload tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        game.load.image('houseSet', 'assets/maps/house2.png');
        
        // Preload tilemap
        game.load.tilemap('villageMap', 'assets/maps/villageMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('john', 'assets/john.png', 63, 70);
        game.load.spritesheet('note', 'assets/note.png', 35, 35);
        game.load.spritesheet('bob', 'assets/Bob.png', 35, 70);
        game.load.spritesheet('paula', 'assets/Paula.png', 35, 70);
        game.load.image('blank', 'assets/blank.png');
        game.load.audio('villageKidnappedMusic', 'assets/villageKidnappedMusic.ogg');

    },
    
    create: function(){
        
        villageKidnappedMusic = game.add.audio('villageKidnappedMusic', 1, true);
        villageKidnappedMusic.play();
        
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
        
        // Add Note sprite
        note = game.add.sprite(850, 544, 'note');
        game.physics.arcade.enable(note);
        note.body.gravity.y = 500;
        
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
        //player = game.add.sprite(1787, 1152, 'john');
        player = game.add.sprite(545, 544, 'john');
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
        
        
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;

        
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
        itemBox.drawRect(game.world.width - 1053, game.world.height-2280, 60, 60);
        itemBox.fixedToCamera = true;
        itemOnScreen = game.add.sprite(game.world.width - 1052, game.world.height-2273, currItem.key);
        itemOnScreen.fixedToCamera = true;
        itemOnScreen.scale.x = 4
        itemOnScreen.scale.y = 4
        
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
        
        game.physics.arcade.collide(note, ground);
        game.physics.arcade.collide(bob, ground);
        game.physics.arcade.collide(paula, ground);

        
        playerMovement(player);
        
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        game.physics.arcade.overlap(mapChange, player, this.toForest);
        
        
        var atDoor = game.physics.arcade.overlap(mapChangeHouse, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.E)) {
            this.toHouse();
        }
        
        // Overlap NPC
        var atNote = game.physics.arcade.overlap(note, player)
        var atPaula = game.physics.arcade.overlap(paula, player)
        var atBob = game.physics.arcade.overlap(bob, player)
        
        // Sarah dialogue
        if (atNote) {
            box.alpha = 0.8;
            dialogueName.text = 'Note:';
            dialogueText.text = 'H E L P';
        }
        
        // Paula dialogue
        else if (atPaula) {
            box.alpha = 0.8;
            dialogueName.text = 'Paula:';
            dialogueText.text = 'H-Hurry, John! Something horrible took your sister \naway!!';
        }
        
        // Bob dialogue
        else if (atBob) {
            box.alpha = 0.8;
            dialogueName.text = 'Bob:';
            dialogueText.text = 'I tried to stop it, John, but it was too fast! \nIt took your sister Sarah into the forest!';
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
    

    

    

};