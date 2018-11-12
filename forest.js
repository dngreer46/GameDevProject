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
        game.load.spritesheet('enemy', 'assets/enemy.png', 40, 40);
        
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
        
        // Player
        loadPlayer(32, 381);
        //inventory
        createInventory();
        //set properties for bullets
        createBullets();
        displayCurrentItem(740, game.world.height-65);
        healthFunc();
        createHitbox();

        
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
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.create(350, game.world.height-100, 'enemy');
        enemies.create(768, game.world.height-100, 'enemy');
        enemies.create(1216, game.world.height-100, 'enemy');
        enemies.create(1056, 192, 'enemy');
        enemies.create(1440, 288, 'enemy');
        enemies.callAll('animations.add', 'animations', 'blob', [0, 1, 2, 3], 7, true);
        enemies.callAll('play', null, 'blob');
        enemies.setAll('body.gravity.y', 500);

       
        
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        items.physicsBodyType = Phaser.Physics.ARCADE;
        items.create(224, game.world.height-96, 'gun');
        items.setAll('scale.x', 2)
        items.setAll('scale.y', 2)

        

        
        //time event to deal damage to the player
        game.time.events.repeat(2000, 100, this.overlapFalse, this);     
        
        //current item display
        itemText = game.add.text(600, game.world.height - 35, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        

    }, 

    
    
    
    update: function(){
        
        // Collision
        game.physics.arcade.collide(enemies, ground);
        game.physics.arcade.collide(enemies, platforms);
        
        // Player Movement
        playerMovement(player);

        // Damage
        game.physics.arcade.overlap(enemies, bullet, this.hitEnemy, null, this);
        game.physics.arcade.overlap(player, enemies, this.playerHit, null, this);
        game.physics.arcade.overlap(hitbox1, enemies);


        // Pick up item
        game.physics.arcade.overlap(items, player, this.addInventory);
        
        // Map change
        game.physics.arcade.overlap(mapChange, player, this.toLab);

    },

    render: function(){
        //game.debug.body(hitbox1);
    },
    
    hitEnemy: function(enemy, bullet){
        bullet.kill();
        enemy.kill();
    },
    
    addInventory: function(player, item){
        inventoryArray.push(item);               
        item.kill();
        currItem = inventoryArray[inventoryArray.indexOf(item)];
        showCurrItem();
        
    },
    
    toLab: function(){
        forestMusic.stop();
        game.state.start('lab');    
    },
    
    playerHit: function(player) {
        if (!overlap){
            overlap = true;
            healthArray.pop();
            var heart = playerHealth.getFirstAlive();
            heart.kill();
        }
        
        if (healthArray.length == 0){
            player.kill();
            this.changeState();
        }
        
    },
    
    overlapFalse: function() {
        overlap = false;
        
    },
    
    changeState: function(){
        game.state.start('youDied');
    }
};