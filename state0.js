var player;
var cursors;

demo.state0 = function(){};

    
demo.state0.prototype = {
   
    
    preload: function(){
        
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    },
    
    
    create: function(){
        
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        
        
        game.physics.arcade.enable(player);
        
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        
        player.animations.add('left', [0, 1, 2, 3, 4], 10, true);
        player.animations.add('right', [5, 6, 7, 8, 9], 10, true);
        
        cursors = game.input.keyboard.createCursorKeys();
        
        

    },
    
    update: function(){
        
        
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            player.animations.stop();

            player.frame = 4;
        }
        
        if (cursors.up.isDown)
            
            player.body.velocity.y = -150;
        
        
    }
};



