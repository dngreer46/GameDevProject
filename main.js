var game = new Phaser.Game(800, 500, Phaser.AUTO);
game.state.add('bossState', demo.bossState);
game.state.add('village', demo.village);
game.state.add('youDied', demo.youDied);
game.state.add('forest', demo.forest);
game.state.start('village');

// Allows collision for select tile faces
// Found here: https://thoughts.amphibian.com/2015/11/single-direction-collision-for-your.html
function setTileCollision(mapLayer, idxOrArray, dirs) {

    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }

    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;

    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {

                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;

                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;

            }
        }
    }

}

function playerMovement(player){
    var touchGround = game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, walls);
    touchGround += game.physics.arcade.collide(player, platforms);

    
    player.body.velocity.x = 0;
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
        player.body.velocity.x = 150;            player.animations.play('walk');
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){                 player.body.velocity.x = -150;
        player.animations.play('walk');
    }
    else{
        player.animations.stop();
        player.frame = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W) && touchGround) {
        player.body.velocity.y = -325;
    }
        
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        currItem = switchItem(inventoryArray);
        console.log(currItem);
    }
        
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if (currItem == undefined){
                
        }
            
        else if (currItem.key == 'gun'){
            this.fire();
        }
            
        else if (currItem.key == 'pickAxe'){
            this.hit();
        }
        
        else if (currItem.key == 'health'){
            this.addHealth();
        }
    }

}

function fire(){
    if(game.time.now > nextFire){
        nextFire = game.time.now + fireRate;         
        bullet = bullets.getFirstDead();
        bullet.reset(player.x, player.y-10);
        bullet.body.velocity.x = 500
    }
}
function hit(){
    player = game.add.sprite(player.x, player.y, 'johnAttack');
    player.scale.setTo(0.5, 0.5);
    player.animations.add('swing', [0, 1, 2], 5, true);
    player.animations.play('swing');
}

function addHealth(){
    heart = playerHealth.getFirstDead();
    //heart.reset(playerHealth.x, playerHealth.y);
    console.log(heart);
}