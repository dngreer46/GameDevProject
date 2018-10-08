var map, ground, walls, platforms, houses, plantsAndSigns, chests, items, inventory, inventoryText;

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
        game.load.image('sword', 'assets/Sword.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');


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
        chests = map.createLayer('Chests');
        
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
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        gun = items.create(230, game.world.height-190, 'gun');
        items.create(100, game.world.height-190, 'sword');
        items.create(150, game.world.height-190, 'pickAxe');
        items.create(1000, game.world.height-190, 'health');
        items.create(1500, game.world.height-250, 'key');
        
        //create inventory
        inventory = game.add.group();

        inventoryText = game.add.text(50, game.world.height - 500, 'Inventory: ', {fontSize: '32px', fill: '#ffffff'});
        
        
        
      
    },
    
    update: function(){
        // Collision
        var touchGround = game.physics.arcade.collide(player, ground);
        game.physics.arcade.collide(player, walls);
        touchGround += game.physics.arcade.collide(player, platforms);
        
        // Player Movement
        player.body.velocity.x = 0;
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
            player.body.velocity.x = 150;
            player.animations.play('walk');
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
            player.body.velocity.x = -150;
            player.animations.play('walk');
        }
        else{
            player.animations.stop();
            player.frame = 0;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.W) && touchGround) {
            player.body.velocity.y = -325;
        }
    
        game.physics.arcade.overlap(items, player, this.addInventory);
        

    },
    
    addInventory: function(player, item){
        inventory.add(item);
        inventory.set(item, 'x', (inventory.getIndex(item) + 1) * 50);
        inventory.setAll('y', game.world.height-450);
        inventory.setAll('scale.x', 2);
        inventory.setAll('scale.y', 2);
        //inventory.setAll('cameraOffset.x', 0);
        //inventory.setAll('cameraOffset.y', game.world.height-400);
        //inventory.fixedToCamera = true;
        console.log(inventory);


        
        
    }
    // Functions
    
};

// Allows collision for select tile faces
// Found here: https://thoughts.amphibian.com/2015/11/single-direction-collision-for-your.html
function setTileCollision(mapLayer, idxOrArray, dirs) {

    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }

    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;

    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {

                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;

                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;

            }
        }
    }

}
