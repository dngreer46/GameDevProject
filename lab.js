var map, bg, ground, walls, platforms;
var items, inventoryBox, inventoryText, mapChange, dialogueName, dialogueText, dialogueBox, villageMusic, itemOnScreen, itemText, enemies;

demo.lab = function(){};
demo.lab.prototype = {
    preload: function(){
        // Preload tileset images
        game.load.image('scifiSet', 'assets/maps/scifiSet.png');
        
        //Sprite
        game.load.spritesheet('enemy', 'assets/enemy.png', 100, 100);
        // Preload tilemap
        game.load.tilemap('labMap', 'assets/maps/labMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        
    },
    
    create: function() {
        
        
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 960, 2400);
        
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
        mapChange = game.add.sprite(940, 2208, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Add enemies
        createEnemies();
    
        spawnEnemies(500, game.world.height-100, 'enemy');
        spawnEnemies(100, game.world.height-1000, 'enemy');
        spawnEnemies(600, game.world.height-1000, 'enemy');
        spawnEnemies(200, game.world.height-2000, 'enemy');
        spawnEnemies(200, game.world.height-2000, 'enemy');
        
        enemies.callAll('animations.add', 'animations', 'blob', [0, 1, 2, 3], 7, true);
        enemies.callAll('play', null, 'blob');
        enemies.setAll('body.gravity.y', 500);
        game.add.tween(enemies).to({x: enemies.x + 130}, 1000, 'Linear', true, 0, -1, true);
        
        createItems()
        spawnItems(50, 192, 'gun');
        
        // Add John sprite
        loadPlayer(16, 192);
        //inventory
        createInventory();
        healthFunc();
        createBullets();
        createHitbox();
    },
    
    update: function() {
        
        game.physics.arcade.collide(enemies, ground);
        game.physics.arcade.collide(enemies, platforms);
        
        playerMovement(player);
        playerAction(player);

        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy, null, this);
        

        // Map change
        game.physics.arcade.overlap(mapChange, player, this.toBoss);
    },
    
    toBoss: function(){
        game.state.start('boss');
    }
    
}