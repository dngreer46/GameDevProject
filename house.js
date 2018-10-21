var map, bg, ground, platforms, walls, chests, door, mapChange
var player

demo.house = function(){};

demo.house.prototype = {
    preload: function() {
        
        // Tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        game.load.image('castleSet1', 'assets/maps/castleSet1.png');
        
        // Tilemap
        game.load.tilemap('houseMap', 'assets/maps/houseMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('john', 'assets/John.png', 65, 70);
        game.load.image('blank', 'assets/blank.png');

    },
    
    create: function() {
        game.stage.backgroundColor = '#000';
        game.world.setBounds(00, 0, 672, 576);
        
        // Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        // Load map
        map = game.add.tilemap('houseMap');
        map.addTilesetImage('castleSet1');
        map.addTilesetImage('natureSet');
        
        // Map layers
        bg = map.createLayer('BG');
        ground = map.createLayer('Ground');
        platforms = map.createLayer('Platforms');
        walls = map.createLayer('Walls');
        chests = map.createLayer('Chests');
        door = map.createLayer('Door');
        
        // Map collision
        map.setCollision([1,2], true, ground);
        map.setCollision([2, 33, 34, 35, 36, 38, 2147483686], true, walls);
        map.setCollision([12,27,28,29], true, platforms);
        setTileCollision(platforms, [12,27,28,29], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        // Map change
        mapChange = game.add.sprite(194, 517, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Add John sprite
        player = game.add.sprite(194, 517, 'john');
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        
        // Player Animations
        player.animations.add('walk', [0, 1], 10, true);
        
        //Camera
        game.camera.follow(player);
        
        
    },
    
    update: function() {
        
        playerMovement(player);
        
        var atDoor = game.physics.arcade.overlap(mapChange, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.E)) {
            this.toVillage();
        }
        
    },
    
    toVillage: function(){        
        game.state.start('village');    
    },
    
}