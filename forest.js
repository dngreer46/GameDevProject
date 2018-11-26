var map, ground, platforms, trees, bullet, bullets, enemies, mapChange, forestMusic;
var fireRate = 1000;
var nextFire = 0;


demo.forest = function(){};

demo.forest.prototype = {
    preload: function(){
        //BG image
        game.load.image('forestBG', 'assets/maps/forestBG.png');
        
        // Preload tileset images
        game.load.image('natureSet', 'assets/maps/natureSet.png');
        
        // Preload tilemap
        game.load.tilemap('forestMap', 'assets/maps/forestMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sprites
        game.load.spritesheet('rat', 'assets/rat.png', 64, 32);
        
        game.load.audio('impact', 'assets/slaphit.mp3');
        game.load.audio('forestMusic', 'assets/forestMusic.mp3');


    }, 
    
    
    create: function(){
        
        forestMusic = game.add.audio('forestMusic', true);
        forestMusic.play();
        game.add.audio('impact')
        
        // Game Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.setBoundsToWorld();
        
        //Background
        game.add.tileSprite(0, 0, 1920, 477, 'forestBG');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 1920, 512);
        
        // Load map
        map = game.add.tilemap('forestMap');
        map.addTilesetImage('natureSet');
        
        //Map Layers
        ground = map.createLayer('Ground');
        platforms = map.createLayer('Platforms');
        trees = map.createLayer('Trees');
        
        // Map change
        mapChange = game.add.sprite(1910, game.world.height-100, 'blank');
        game.physics.arcade.enable(mapChange);
        
        // Map collision
        map.setCollision(44, true, ground);
        map.setCollision(44, true, platforms);
        setTileCollision(platforms, 44, {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        

        // Enemy Group
        createEnemies();
        spawnEnemies(350, game.world.height-100, 'rat')
        spawnEnemies(768, game.world.height-100, 'rat')
        spawnEnemies(1216, game.world.height-100, 'rat')
        spawnEnemies(1056, 192, 'rat')
        spawnEnemies(1440, 288, 'rat')

        enemies.callAll('animations.add', 'animations', 'move', [0, 1, 2], 7, true);
        enemies.callAll('play', null, 'move');
        enemies.setAll('body.gravity.y', 500);
        game.add.tween(enemies).to({x: enemies.x + 130}, 1000, 'Linear', true, 0, -1, true);
       
        
        
        //create items
        createItems()
        //spawnItems(224, game.world.height-96, 'gun')
        
        //time event to deal damage to the player
        game.time.events.repeat(3000, 100, overlapFalse);     
        
        //current item display
        itemText = game.add.text(0, game.world.height - 35, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        
        // Player
        loadPlayer(32, 381);
        //set properties for bullets
        createBullets();
        displayCurrentItem(140, game.world.height-65);
        //inventory
        createInventory();
        healthFunc();
        createHitbox();
    }, 

    
    
    
    update: function(){
        
        //Enemies collide with world
        game.physics.arcade.collide(enemies, ground);
        game.physics.arcade.collide(enemies, platforms);
        
        //Damage
        //Pickaxe kills enemies
        game.physics.arcade.overlap(hitbox1, enemies, hitEnemy);
        //Bullets kill enemies
        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy);
        //Enemies hurt player
        game.physics.arcade.overlap(player, enemies, playerHit);

        //Player controls
        playerMovement(player);
        playerAction(player);

        
        // Pick up item
        game.physics.arcade.overlap(items, player, addInventory);
        // Map change
        
        // Map change
        game.physics.arcade.overlap(mapChange, player, this.toLab);

    },

    render: function(){
        game.debug.body(hitbox1);
    },
    
    
    toLab: function(){
        forestMusic.stop();
        game.state.start('lab');    
    },
    
    changeState: function(){
        game.state.start('youDied');
    }
};