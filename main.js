var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('state0', demo.state0);
game.state.add('state1', demo.state1);
game.state.add('village', demo.village);
game.state.start('state0');
