var bossTween, slime, bossHealth, boss_health;

demo.boss = function(){};
demo.boss.prototype = {
    preload: function() {
         // Preload tileset images
        game.load.image('scifiSet', 'Assets/maps/scifiSet.png');
        
        // Preload tilemap
        game.load.tilemap('bossMap', 'Assets/maps/bossMap.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.spritesheet('boss', 'Assets/boss.png', 96, 128);
        game.load.spritesheet('john', 'Assets/john.png', 63.5, 70);
        game.load.image('health', 'Assets/Heart.png');
        game.load.image('slime', 'Assets/slime.png');

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
        
        //add health
        bossHealth = game.add.text(540, 0, 'Boss Health: 100', {fontSize: '32px', fill: '#ffffff' });
        bossHealth.fixedToCamera = true;
        boss_health = 100;
        
        // Add John sprite
        loadPlayer(50, 512);
        createBullets();
        displayCurrentItem(140, game.world.height-195);
        itemText = game.add.text(0, game.world.height - 195, 'Current Item', {fontSize: '18px', fill: '#ECE6E5'});
        itemText.fixedToCamera = true;
        createInventory();
        //Add player health
        healthFunc();
        //Add hitbox for player
        createHitbox();
    },
    
    update: function() {
    
        game.physics.arcade.collide(boss, ground);
        game.physics.arcade.collide(boss, walls);
        game.physics.arcade.collide(boss, platforms);
        //game.physics.arcade.overlap(player, slimeBalls, bossHitPlayer);
        //game.physics.arcade.overlap(player, boss, bossHitPlayer);
        game.physics.arcade.overlap(boss, bullets, this.hitBoss)
        boss.animations.play('barf');
        // Pick up item
        game.physics.arcade.overlap(items, player, addInventory);
        
        playerMovement(player);
        playerAction(player);
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
        //game.debug.body(slime);
        slime.reset(boss.x+15, boss.y+15);
        slime.body.velocity.x = -250;
        slime.body.velocity.y = -50;
        slime.body.gravity.y = 400;
        slime.body.onOverlap = new Phaser.Signal();
        slime.body.onOverlap.add(bossHitPlayer);
    },
    hitBoss: function(boss, bullet){
        bullet.kill();
        
        //damageSound.play();
        boss_health -= 10;
        bossHealth.text = 'Boss Health: ' + boss_health;
        console.log(boss_health);
        
        if (boss_health == 70){

            //enemyE.on = true;
            //enemyE.start(true, 0, 15);
            //bossDialouge = game.add.text(game.world.width - 500, game.world.height - 400, 'You will never win', {fontSize: '32px', fill: '#ffffff' });
        }
        else if (boss_health == 0){
            boss.kill();
            game.state.start('gameEnd');
        }
         
    },
}
