var bossTween, slime;

demo.boss = function(){};
demo.boss.prototype = {
    preload: function() {
         // Preload tileset images
        game.load.image('scifiSet', 'assets/maps/scifiSet.png');
        
        // Preload tilemap
        game.load.tilemap('bossMap', 'assets/maps/bossMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.spritesheet('boss', 'assets/boss.png', 96, 128);
        game.load.spritesheet('john', 'assets/john.png', 63.5, 70);
        game.load.image('health', 'assets/Heart.png');
        game.load.image('slime', 'assets/slime.png');

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
        loadPlayer(50, 512);
        //Create bullets for gun
        createBullets();
        //Display current item
        //displayCurrentItem(740, game.world.height-65);
        //Display inventory
        createInventory();
        //Add player health
        healthFunc();
        //Add hitbox for player
        createHitbox();
        
        
        // Map collision
        map.setCollision([205,206,207], true, ground);
        map.setCollision([135,136,137], true, platforms);
        setTileCollision(platforms, [135,136,137], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });
        
        //Boss creation
        boss = game.add.sprite(685, 320, 'boss');
        game.physics.arcade.enable(boss);
        boss.body.gravity.y = 500;
        boss.body.collideWorldBounds = true;
        boss.animations.add('barf', [0, 5, 6, 7, 8, 9, 10, 11], 10);
        //Boss tweens
        game.time.events.repeat(2000, 100, this.bossMove, this);
        game.time.events.repeat(750, 1000, this.bossAttack, this);
        
        //Boss projectile
        createSlime();

    },
    
    update: function() {
        playerMovement(player);
        game.physics.arcade.collide(boss, ground);
        game.physics.arcade.collide(boss, walls);
        game.physics.arcade.collide(boss, platforms);
        game.physics.arcade.overlap(player, slimeBalls);

        boss.animations.play('barf');
    },
    
    render: function(){
        //game.debug.spriteInfo(player, 32, 32);
        //game.debug.spriteInfo(boss, 32, 32);
        //game.debug.body(player);
    },
    
    bossMove: function(){
        var xArray = [440, 237, 410, 685, 233, 687];
        var yArray = [412, 319, 220, 320, 124, 127]; 
        var Xrand = xArray[Math.floor(Math.random() * xArray.length)];
        var Yrand = yArray[xArray.indexOf(Xrand)];
        
        boss.x = Xrand;
        boss.y = Yrand;

    },
    
    bossAttack: function(){
        slime = slimeBalls.getFirstDead();
        slime.body.setSize(37, 37);
        game.debug.body(slime);
        slime.reset(boss.x+15, boss.y+15);
        slime.body.velocity.x = -250;
        slime.body.velocity.y = -50;
        slime.body.gravity.y = 400;
        slime.body.onOverlap = new Phaser.Signal();
        slime.body.onOverlap.add(playerHit);
    }
}