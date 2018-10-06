var map, groundLayer, wallLayer, platformsLayer, houseLayer, plantsSignsLayer, ladderLayer, chestLayer

var demo = {};
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
        
    },
    
    create: function(){
        
        // Background image
        game.add.tileSprite(0, 0, 1792, 2720, 'sky');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 1792, 2720);
        
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Load map
        map = game.add.tilemap('villageMap');
        map.addTilesetImage('natureSet');
        map.addTilesetImage('houseSet');
        
        // Map layers
        groundLayer = map.createLayer('Ground');
        wallLayer = map.createLayer('Walls');
        platformsLayer = map.createLayer('Platforms');
        houseLayer = map.createLayer('Houses');
        plantsSignsLayer = map.createLayer('PlantsSigns');
        ladderLayer = map.createLayer('Ladders');
        chestLayer = map.createLayer('Chests');
        
        // Map collision
        map.setCollision([43, 44, 45], true, groundLayer);
        map.setCollision([44, 54, 1610612780, 2684354604, 3221225516], true, wallLayer);
        map.setCollision(44, true, platformsLayer);
        
        // Add Sprites
        player = game.add.sprite(256, game.world.height - 200, 'john');
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 500;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 5, true);
        
        //Camera
        game.camera.follow(player);
        
        // Controls
        cursors = game.input.keyboard.createCursorKeys();
        
    },
    
    update: function(){
        // Collision
        var touchGround = game.physics.arcade.collide(player, groundLayer);
        game.physics.arcade.collide(player, wallLayer);
        touchGround += game.physics.arcade.collide(player, platformsLayer);
        
        // Player Movement
        player.body.velocity.x = 0;
        if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.animations.play('walk');
            }
        else if (cursors.left.isDown) {
                player.body.velocity.x = -150;
                player.animations.play('walk');
            }
        else {
                player.animations.stop();
                player.frame = 0;
            }
        
        if (cursors.up.isDown && touchGround) {
                player.body.velocity.y = -350;
            }
    }
    
    // Functions
};