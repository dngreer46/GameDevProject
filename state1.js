demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        
    },
    create: function(){
        game.stage.backgroundColor = "#000"
            
        var text = game.add.text(400, 250, 'You Died :(', {fontSize: '48px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        
        text = game.add.text(400, 400, 'Press ESC to try again.', {fontSize: '18px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.restart, null, null);
    },
    update: function(){},
    
    restart: function() {
            game.state.start('bossState');
    }
};
        