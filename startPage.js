var map, title, groundT, villageMusic;

demo.startPage = function(){};

demo.startPage.prototype = {
    preload: function(){
        game.load.image('sky', 'assets/maps/sky.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('title', 'assets/titleimage.png');
        game.load.audio('villageMusic', 'assets/villageMusic.mp3');
        
    },
    create: function(){
        villageMusic = game.add.audio('villageMusic', 0.3, true);
        villageMusic.play();
        game.add.tileSprite(0, 0, 3520, 640, 'sky');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 3520, 640);
        platforms = game.add.group();
        platforms.enableBody = true;
        groundT = platforms.create(0, game.world.height-200, 'ground');
        groundT.scale.setTo(.5,.5);
        groundT.body.immovable = true;
        
        var title = game.add.sprite(250, game.world.height-600, 'title');
        title.scale.setTo(.5,.5);
        
        //title = game.add.text(325, 70, 'Elysian Hill',{fontSize: '32px', fill: '#000000' });
        
        var startD = game.add.text(250, 465, 'Press The Spacebar To Begin',{fontSize: '24px', fill: '#ffffff' });  
        
        var tutorialD = game.add.text(220, 300, 'Press The "T" Key To Begin Tutorial',{fontSize: '24px', fill: '#000000' });
        
        
    },
    update: function(){
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('village');
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.T)){
            game.state.start('startTutorial');
        }
    }
    
};