var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, box, villageMusic, villageKidnappedMusic;
var sarah, bob, paula

demo.villageKidnapped = function(){};
demo.villageKidnapped.prototype = {
    preload: function(){
        game.load.image('sky', 'Assets/maps/sky.png');
        
        // Preload tileset images
        game.load.image('natureSet', 'Assets/maps/natureSet.png');
        game.load.image('houseSet', 'Assets/maps/house2.png');
        
        // Preload tilemap
        game.load.tilemap('villageMap', 'Assets/maps/villageMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('note', 'Assets/note.png', 35, 35);

        game.load.image('blank', 'Assets/blank.png');
        game.load.audio('villageKidnappedMusic', 'Assets/villageKidnappedMusic.ogg');

    },
    
    create: function(){
        
       attacking = false
        
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
        map.setCollision([43, 44, 45, 54], true, ground);
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
        
        // Signs
        johnSign = game.add.sprite(194, 545, 'blank');
        game.physics.arcade.enable(johnSign);
        forestSign = game.add.sprite(3137, 482, 'blank');
        game.physics.arcade.enable(forestSign);

        itemText = game.add.text(0, game.world.height - 165, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        
        //current item display
        displayCurrentItem(140, game.world.height-195);
        //inventory
        createInventory();
        //health
        healthFunc();
        //hitbox
        createHitbox();
        // Add John sprite
        loadPlayer(545, 544);
        

    },
    
    update: function(){
        
        game.physics.arcade.collide(note, ground);
        game.physics.arcade.collide(bob, ground);
        game.physics.arcade.collide(paula, ground);

        
        playerMovement(player);
        playerAction(player);
        
        game.physics.arcade.overlap(items, player, addInventory);
        
        game.physics.arcade.overlap(mapChange, player, this.toForest);
        
        
        var atDoor = game.physics.arcade.overlap(mapChangeHouse, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.E)) {
            this.toHouse();
        }
        
        // Overlap NPC
        var atNote = game.physics.arcade.overlap(note, player)
        var atPaula = game.physics.arcade.overlap(paula, player)
        var atBob = game.physics.arcade.overlap(bob, player)
        
        var atJohnSign = game.physics.arcade.overlap(johnSign, player);
        var atForestSign = game.physics.arcade.overlap(forestSign, player);
        
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
        
        // John Sign text
        else if (atJohnSign) {
            box.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = 'Residence of John and Sarah';
        }
        
        // Forest Sign text
        else if (atForestSign) {
            box.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = '>>> Forest (DANGER!) \n<<< Elysian Hill (Population: 4)';
        }
        
        
        // Get rid of text box if not overlapping NPC
        else {
            box.alpha = 0;
            dialogueName.text = '';
            dialogueText.text = '';
        }

        

    },

    
    toForest: function(){   
        villageKidnappedMusic.stop();
        game.state.start('forest');    
    },
    
    toHouse: function(){
        game.state.start('house');    
    },
    

    

    

};