demo.gameEnd = function(){};
demo.gameEnd.prototype = {
    preload: function(){
        
    },
    create: function(){
        game.stage.backgroundColor = "#000"
            
        var text = game.add.text(400, 100, 'You defeated the lab monster\n     and saved your sister!', {fontSize: '36px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        
        text = game.add.text(400, 200, 'THE END', {fontSize: '18px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        
        text = game.add.text(400, 250, 'Producer: Paul Toprac', {fontSize: '18px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        
        
        text = game.add.text(400, 300, 'Developers: Danny Greer, Cathy Li, Sam Bernasconi', {fontSize: '18px', fill: '#fff'});
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        
    },
    update: function(){}
};
        