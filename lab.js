var map, bg, ground, walls, platforms;
var items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, dialogueBox, villageMusic, itemOnScreen, itemText;

demo.lab = function(){};
demo.lab.prototype = {
    preload: function(){
        // Preload tileset images
        game.load.image('scifiSet', 'assets/maps/scifiSet.png');
        
        // Preload tilemap
        game.load.tilemap('labMap', 'assets/maps/labMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('john', 'assets/john.png', 63, 70, 5);
        
        game.load.image('gun', 'assets/gun.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('blank', 'assets/blank.png');
    },
    
    create: function() {
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 960, 1600);
        
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        // Load map
        map = game.add.tilemap('labMap');
        map.addTilesetImage('scifiSet');
        
        // Map layers
        bg = map.createLayer('BG');
        ground = map.createLayer('Ground');
        walls = map.createLayer('Walls');
        platforms = map.createLayer('Platforms');
        
        // Map collision
        map.setCollision([211, 215, 216, 101, 33, 32, 205, 206, 207, 141, 142, 176, 177, 71, 72, 106, 107], true, ground);
        map.setCollision(211, true, walls);
        map.setCollision([216, 211, 212, 215, 100, 101, 102, 135, 136, 137], true, platforms);
        setTileCollision(platforms, [216, 211, 212, 215, 100, 101, 102, 135, 136, 137], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        // Map Change
        mapChange = game.add.sprite(940, 1408, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Add John sprite
        player = game.add.sprite(16, 192, 'john');
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
        
        //inventory
        inventoryBox = game.add.graphics(0, 0);
        inventoryBox.beginFill(0x77bdea);
        inventoryBox.alpha = 0;
        inventoryBox.drawRect(200, 20, 400, 100);
        inventoryBox.fixedToCamera = true;
        inventoryText = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
        inventoryText.fixedToCamera = true;
        
    },
    
    update: function() {
        playerMovement(player);
        
        // Map change
        game.physics.arcade.overlap(mapChange, player, this.toBoss);
    },
    
    toBoss: function(){
        game.state.start('bossState');
    }
    
}