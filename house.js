var map, bg, ground, platforms, walls, door, mapChange
var player

demo.house = function(){};

demo.house.prototype = {
    preload: function() {
        
        // Tileset images
        game.load.image('natureSet', 'Assets/maps/natureSet.png');
        game.load.image('castleSet1', 'Assets/maps/castleSet1.png');
        
        // Tilemap
        game.load.tilemap('houseMap', 'Assets/maps/houseMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.image('blank', 'Assets/blank.png');

    },
    
    create: function() {
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 672, 576);
        
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
        
        // Create items
        createItems()
        spawnItems(192, 352, 'pickAxe')
        
        
        //current item display
        displayCurrentItem(140, game.world.height-155);
        //inventory
        createInventory();
        //health
        healthFunc();
        //hitbox
        createHitbox();
        // Add John sprite
        loadPlayer(194, 517);
        
        
        
        
    },
    
    update: function() {
        
        playerMovement(player);
        playerAction(player);
        
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        var atDoor = game.physics.arcade.overlap(mapChange, player)
        
        if (atDoor && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.toVillage();
        }

        
    },
    
    render: function(){
        game.debug.spriteInfo(player, 32, 32);
        
    },
    
    toVillage: function(){
        //villageMusic.stop();
        game.state.start('villageKidnapped');    
    },
    
     addInventory: function(player, item){
        inventoryArray.push(item);
        item.kill();
        currItem = inventoryArray[inventoryArray.indexOf(item)];
        showCurrItem();

    }
    
    
}