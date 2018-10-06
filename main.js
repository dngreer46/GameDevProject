var game = new Phaser.Game(800, 500, Phaser.AUTO);
game.state.add('bossState', demo.bossState);
game.state.add('state1', demo.state1);
game.state.add('village', demo.village);
game.state.start('village');
