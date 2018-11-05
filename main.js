var game = new Phaser.Game(800, 500, Phaser.AUTO);
game.state.add('bossState', demo.bossState);
game.state.add('village', demo.village);
game.state.add('youDied', demo.youDied);
game.state.add('forest', demo.forest);
game.state.add('house', demo.house);
game.state.add('startTutorial', demo.startTutorial);
game.state.add('villageKidnapped', demo.villageKidnapped);
game.state.add('lab', demo.lab);
//game.state.start('village');
game.state.start('startTutorial');

var player, ground, playerHealth, healthArray, velocity = 700, fireRate = 1000, nextFire=0, inventory, inventoryArray = [], currItem, bullet, bullets, dirValue;



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
    player.anchor.setTo(.35,.35);
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
        player.scale.x = .7;
        player.body.velocity.x = 175;    
        player.animations.play('walk');
        dirValue = game.input.keyboard.isDown(Phaser.Keyboard.A) - game.input.keyboard.isDown(Phaser.Keyboard.D);

    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){                   player.scale.x = -.7;
        player.body.velocity.x = -175;
        player.animations.play('walk');
        dirValue = game.input.keyboard.isDown(Phaser.Keyboard.A) - game.input.keyboard.isDown(Phaser.Keyboard.D);

    }
    else{
        player.animations.stop('walk');
        //player.frame = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W) && touchGround) {
        player.body.velocity.y = -340;
    }
}
    
function useItem(player){
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){   
        inventoryBox.alpha = 0.8;
        inventory = game.add.group(inventoryBox);
        inventoryText.text = 'Inventory: ';
        for (var i = 0; i < inventoryArray.length; i++){
            inventory.create(0, 0, inventoryArray[i].key);
        }
        inventory.setAll('scale.x', 2);
        inventory.setAll('scale.y', 2);
        inventory.align(5, 1, 50, 30, Phaser.CENTER);
        inventory.x = 210;
        inventory.y = 80;
    }
    else{
        inventoryBox.alpha=0;
        inventoryText.text = '';
    }
        
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        
        if (currItem == undefined){
            currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
            showCurrItem();  
        }
            
        else if (currItem.key == 'gun'){
            this.fire();
        }
            
        else if (currItem.key == 'pickAxe'){
            //this.hit();
            player.animations.play('attack');
        }
        
        else if (currItem.key == 'health'){
            if (healthArray.length < 3){
                this.addHealth();
                console.log(currItem.index);
                inventoryArray.splice(inventoryArray.indexOf(currItem));
                currItem = inventoryArray[0];
            }


        }
    }
    if (game.input.keyboard.downDuration(Phaser.Keyboard.F, 10)){
        currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
        console.log(currItem);
        if (currItem == undefined){
            currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
        }
        showCurrItem(currItem);

        
    }


}

function fire(){
    if(game.time.now > nextFire){
        nextFire = game.time.now + fireRate;         
        bullet = bullets.getFirstDead();
        bullet.reset(player.x, player.y-10);
        if (dirValue == 1){
            bullet.body.velocity.x = -550;

        }
        else if(dirValue == -1){
            bullet.body.velocity.x = 550;

        }
        
    }
}
function hit(){
    player.animations.play('attack');

}

function addHealth(){
    var addHeart = playerHealth.getFirstAlive();
    playerHealth.create(addHeart.x - 50, addHeart.y, 'health');
    healthArray.push(addHeart);
    playerHealth.setAll('scale.x', 3);
    playerHealth.setAll('scale.y', 3);

}

function showCurrItem(){
    
    if (currItem == undefined){
        currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
    }
    
    itemOnScreen.loadTexture(currItem.key);

    
}