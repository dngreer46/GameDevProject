var game = new Phaser.Game(800, 500, Phaser.AUTO);
game.state.add('bossState', demo.bossState);
game.state.add('village', demo.village);
game.state.add('youDied', demo.youDied);
game.state.add('forest', demo.forest);
game.state.add('house', demo.house);
game.state.add('startTutorial', demo.startTutorial);
game.state.add('villageKidnapped', demo.villageKidnapped);
game.state.add('startPage', demo.startPage);
game.state.add('lab', demo.lab);
//game.state.start('village');
game.state.start('startPage');

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

function loadPlayer(x, y){
    player= game.add.sprite(x, y, 'john');
    player.scale.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.setSize(35, 63, 0, 0);
    
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
        
    // Player Animations
    player.animations.add('walk', [0, 1], 10);
    player.animations.add('attack', [2, 3, 4], 10);
    //Camera
    game.camera.follow(player);
    
}
function playerMovement(player){
    var touchGround = game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, walls);
    touchGround += game.physics.arcade.collide(player, platforms);

    
    player.body.velocity.x = 0;
    player.anchor.setTo(.35,.35);
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
        player.scale.x = .5;
        player.body.velocity.x = 375;    
        player.animations.play('walk');
        dirValue = game.input.keyboard.isDown(Phaser.Keyboard.A) - game.input.keyboard.isDown(Phaser.Keyboard.D);

    }

    else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){               
        player.scale.x = -.5;
        player.body.velocity.x = -375;
        player.animations.play('walk');
        dirValue = game.input.keyboard.isDown(Phaser.Keyboard.A) - game.input.keyboard.isDown(Phaser.Keyboard.D);

    }
    else{
        player.animations.stop('walk');
        //player.frame = 0;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W) && touchGround) {
        player.body.velocity.y = -340;
        player.body.bounce.y = 0.3;

    }
    
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
    
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.TAB);
    
    if (game.input.keyboard.downDuration(Phaser.Keyboard.TAB, 10)){
        currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
        console.log(currItem);
        if (currItem == undefined){
            currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
        }
        showCurrItem(currItem);

        
    }


}

function createInventory(){
    //inventory
    inventoryBox = game.add.graphics(0, 0);
    inventoryBox.beginFill(0x77bdea);
    inventoryBox.alpha = 0;
    inventoryBox.drawRect(200, 20, 400, 100);
    inventoryBox.fixedToCamera = true;
    inventoryText = game.add.text(210, 25, '', {fontSize: '18px', fill: '#000'});
    inventoryText.fixedToCamera = true;
}

function createBullets(){
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('anchor.y', -5);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('scale.x', 0.8);
    bullets.setAll('scale.y', 0.8);        
}

function displayCurrentItem(x, y){
    itemBox = game.add.graphics(0, 0);
    itemBox.beginFill(0x5daf8a);
    itemBox.alpha = 0.65;
    itemBox = itemBox.drawRect(x, y, 50, 50);
    itemBox.fixedToCamera = true;
    itemOnScreen = game.add.sprite(x, y, currItem.key);
    itemOnScreen.fixedToCamera = true;
    itemOnScreen.scale.x = 3.75;
    itemOnScreen.scale.y = 3.75;
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