var map, title, groundT, villageMusic;

demo.startTutorial = function(){};

demo.startTutorial.prototype = {
    preload: function(){
        game.load.image('sky', 'Assets/Maps/sky.png');
        game.load.image('ground', 'Assets/ground.png');
        
        // Sprites
        game.load.image('tab', 'Assets/tab.png');
        game.load.image('spacebar', 'Assets/spacebar.png');
        game.load.image('shift', 'Assets/shift.png');
        game.load.image('arrowkeys', 'Assets/arrowkeys.png');
        
    },
    
    create: function(){
        game.add.tileSprite(0, 0, 3520, 640, 'sky');
        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 3520, 640);
        platforms = game.add.group();
        platforms.enableBody = true;
        groundT = platforms.create(0, game.world.height-200, 'ground');
        groundT.scale.setTo(.5,.5);
        groundT.body.immovable = true;
        
        
        title = game.add.text(325, 70, 'Tutorial',{fontSize: '32px', fill: '#000000' });
        
        keys = game.add.group();
        var arrow = keys.create(75, game.world.height-525, 'arrowkeys');
        arrow.scale.setTo(.08,.08);
        arrowD = game.add.text(120, 250, 'To Move',{fontSize: '24px', fill: '#000000' });
        var tab = keys.create(550, game.world.height-475, 'tab');
        tab.scale.setTo(.13,.13)
        tabD = game.add.text(450, 250, 'To Change Current Item',{fontSize: '24px', fill: '#000000' });
        var shift = keys.create(500, game.world.height-335, 'shift');
        shift.scale.setTo(.17,.17)
        shiftD = game.add.text(475, 380, 'To Inspect Inventory',{fontSize: '24px', fill: '#000000' });
        var space = keys.create(55, game.world.height-317, 'spacebar');
        space.scale.setTo(.4,.4);
        spaceD = game.add.text(120, 380, 'To Use Item',{fontSize: '24px', fill: '#000000' });
        
        var startD = game.add.text(230, 465, 'Press The Spacebar To Begin',{fontSize: '24px', fill: '#ffffff' });  
        
    },
    
    update: function(){
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('village')
        }
    }
   
};