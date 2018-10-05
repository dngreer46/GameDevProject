var map, groundLayer, platformsLayer, houseLayer, plantsSignsLayer, ladderLayer, chestLayer

var demo = {};
demo.village = function(){};

demo.village.prototype = {
    
    preload: function(){
        
        // Preload tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        game.load.image('houseSet', 'assets/maps/house2.png');
        
        // Preload tilemap
        game.load.tilemap('villageMap', 'assets/maps/villageMap.json', null, Phaser.Tilemap.TILED_JSON);
        
    },
    
    create: function(){
        
        // Load map
        map = game.add.tilemap('villageMap');
        map.addTilesetImage('natureSet');
        map.addTilesetImage('houseSet');
        
        groundLayer = map.createLayer('Ground');
        platformsLayer = map.createLayer('Platforms');
        houseLayer = map.createLayer('Houses');
        plantsSignsLayer = map.createLayer('PlantsSigns');
        ladderLayer = map.createLayer('Ladders');
        chestLayer = map.createLayer('Chests');
        
    },
    
    update: function(){
        
    }
    
    // Functions
};