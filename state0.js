var demo = {}
demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('john', 'assets/John.png', 35, 70);
        game.load.image('boss', 'assets/boss.png');
    },
    
    creat: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#800080';
        game.world.setBounds(0, 0, 2813, 1000);
        
        john = game.add.sprite(0, 0, 'john');
        boss = game.add.sprite(100, 0, 'boss');
        
    }
}