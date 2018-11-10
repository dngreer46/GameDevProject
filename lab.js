var map, bg, ground, walls, platforms;
var items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, dialogueBox, villageMusic, itemOnScreen, itemText;

demo.lab = function(){};
demo.lab.prototype = {
    preload: function(){
        // Preload tileset images
        game.load.image('scifiSet', 'assets/maps/scifiSet.png');
        
        // Preload tilemap
        game.load.tilemap('labMap', 'assets/maps/labMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        
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
        
        
        // Add John sprite
        loadPlayer(16, 192);
        //inventory
        createInventory();
        
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