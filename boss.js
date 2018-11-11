demo.boss = function(){};
demo.boss.prototype = {
    preload: function() {
         // Preload tileset images
        game.load.image('scifiSet', 'assets/maps/scifiSet.png');
        
        // Preload tilemap
        game.load.tilemap('bossMap', 'assets/maps/bossMap.json', null, Phaser.Tilemap.TILED_JSON);
    },
    
    create: function() {
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 960, 640);
        
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        // Load map
        map = game.add.tilemap('bossMap');
        map.addTilesetImage('scifiSet');
        
        // Map layers
        bg = map.createLayer('BG');
        ground = map.createLayer('Ground');
        platforms = map.createLayer('Platforms');
        
        // Add John sprite
        loadPlayer(16, 512);
        //inventory
        createInventory();
        healthFunc();
        
        // Map collision
        map.setCollision([205,206,207], true, ground);
        map.setCollision([135,136,137], true, platforms);
        setTileCollision(platforms, [135,136,137], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
    },
    
    update: function() {
        playerMovement(player);
    },
    
}