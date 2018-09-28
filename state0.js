var player;
var boss;
var cursors;
var speed = 6;

var demo = {};

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('john', 'assets/John.png', 35, 70);
        game.load.image('boss', 'assets/boss.png');
    },
    
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#ffffff';
        
        player = game.add.sprite(32, game.world.height - 150, 'john');
        boss = game.add.sprite(100, game.world.height - 150, 'boss');
        
        game.physics.arcade.enable(player, boss);
        
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.body.collideWorldBounds = true;
     

        player.animations.add('walk', [0, 1], true);


        
    },
    
    update: function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            player.x += speed;
            player.animations.play('walk', 14, true);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            player.x -= speed;
            player.animations.play('walk', 14, true);

        }
        else{
            player.animations.stop('walk');
            player.frame = 0;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            player.y -= speed;
            if(player.y < 395){
                player.y = 395;
            }
        }
    }
};