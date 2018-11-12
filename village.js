var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, dialogueBox, villageMusic, itemOnScreen, itemText;
var johnSign, paulaSign, bobSign, forestSign;
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
        game.load.spritesheet('john', 'assets/john.png', 63.5, 70);
        game.load.spritesheet('sarah', 'assets/Sarah.png', 35, 70);
        game.load.spritesheet('bob', 'assets/Bob.png', 35, 70);
        game.load.spritesheet('paula', 'assets/Paula.png', 35, 70);
        game.load.image('gun', 'assets/gun.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('blank', 'assets/blank.png');
        game.load.audio('damageSound', 'assets/slaphit.mp3');
        
    },
    
    create: function(){

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
        
        // Add John sprite
        //loadPlayer(246, 544);
        loadPlayer(2210, 390);
        //set properties for bullets
        createBullets();
        //current item display
        currItem = game.add.sprite(0, game.world.height - 2720, 'blank');
        displayCurrentItem(740, game.world.height-195);
        //inventory
        createInventory();
        healthFunc();
        createHitbox();
        
        
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
        
        

        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        //items.create(1170, game.world.height-1015, 'gun');
        items.create(150, 544, 'pickAxe'); 
        items.create(2210, 390, 'key');   
        items.setAll('scale.x', 2);
        items.setAll('scale.y', 2);
        

        

        
        itemText = game.add.text(600, game.world.height - 165, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        


        
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
        
        
        // Signs
        johnSign = game.add.sprite(194, 545, 'blank');
        game.physics.arcade.enable(johnSign);
        paulaSign = game.add.sprite(1697, 482, 'blank');
        game.physics.arcade.enable(paulaSign);
        bobSign = game.add.sprite(2401, 482, 'blank');
        game.physics.arcade.enable(bobSign);
        forestSign = game.add.sprite(3137, 482, 'blank');
        game.physics.arcade.enable(forestSign);
        

      

    },
    
    update: function(){
        
        game.physics.arcade.collide(sarah, ground);
        game.physics.arcade.collide(bob, ground);
        game.physics.arcade.collide(paula, ground);

        playerMovement(player);
        
        
        game.physics.arcade.overlap(items, player, this.addInventory);
        

        game.physics.arcade.overlap(hitbox1, enemies);
        if (attacking){
            hitbox1.body.setSize(50,40,(15*dirValue)*-1, 0);
        }
        
        var atDoor = game.physics.arcade.overlap(mapChangeHouse, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && currItem.key == 'key') {
            this.toHouse();
        }
        
        // Overlap NPC
        var atSarah = game.physics.arcade.overlap(sarah, player);
        var atPaula = game.physics.arcade.overlap(paula, player);
        var atBob = game.physics.arcade.overlap(bob, player);
        var atForest = game.physics.arcade.overlap(mapChange, player);
        
        // Overlap Signs
        var atJohnSign = game.physics.arcade.overlap(johnSign, player);
        var atPaulaSign = game.physics.arcade.overlap(paulaSign, player);
        var atBobSign = game.physics.arcade.overlap(bobSign, player);
        var atForestSign = game.physics.arcade.overlap(forestSign, player);
        
        // Sarah dialogue
        if (atSarah) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sarah:';
            dialogueText.text = 'Hi brother! It is such a nice day today. \nI want to play outside but I left my kite in the house, \nand the door is locked! Will you please find the key \nand unlock the door for me? \n\n(Make sure the key is the current item when using)';
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
            dialogueText.text = 'The forest is dangerous! \nI should unlock the door for Sarah first.';
        }
        
        // John Sign text
        else if (atJohnSign) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = 'Residence of John and Sarah';
        }
        
        // Paula Sign text
        else if (atPaulaSign) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = 'Residence of Paula';
        }
        
        // Bob Sign text
        else if (atBobSign) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = 'Residence of Bob';
        }
        
        // John Sign text
        else if (atForestSign) {
            dialogueBox.alpha = 0.8;
            dialogueName.text = 'Sign:';
            dialogueText.text = '>>> Forest (DANGER!) \n<<< Elysian Hill (Population: 4)';
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
        game.debug.spriteInfo(player, 32, 32);
        game.debug.body(hitbox1);


    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);
        item.kill();
        currItem = inventoryArray[inventoryArray.indexOf(item)];
        showCurrItem();

    },
    
    toForest: function(){        
        game.state.start('forest');    
    },
    
    toHouse: function(){
        villageMusic.stop();
        game.state.start('house');    
    },
    
   

    

};



