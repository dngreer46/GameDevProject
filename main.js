var game = new Phaser.Game(800, 500, Phaser.AUTO);
game.state.add('startPage', demo.startPage);
game.state.add('village', demo.village);
game.state.add('youDied', demo.youDied);
game.state.add('forest', demo.forest);
game.state.add('house', demo.house);
game.state.add('startTutorial', demo.startTutorial);
game.state.add('villageKidnapped', demo.villageKidnapped);
game.state.add('lab', demo.lab);
game.state.add('bossState', demo.bossState);
game.state.add('boss', demo.boss);
game.state.start('village');

var player, ground, playerHealth, healthArray, velocity = 700, fireRate = 1000, nextFire=0, inventory, inventoryArray = [], currItem, bullet, bullets, dirValue, hitbox, hitbox1, attacking;




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
    player.animations.add('attack', [2, 3, 4], 15);
    //Camera
    game.camera.follow(player);
    player.tint = 0xffffff;

    
}
function playerMovement(player){
    var touchGround = game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, walls);
    touchGround += game.physics.arcade.collide(player, platforms);

    
    player.body.velocity.x = 0;
    player.anchor.setTo(.35,.35);
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
        player.scale.x = .5;
        player.body.velocity.x = 225;    
        //player.body.velocity.x = 475;
        if (attacking){
            player.animations.play('attack');
        }
        else{
            player.animations.play('walk');
        }
        
        dirValue = game.input.keyboard.isDown(Phaser.Keyboard.A) - game.input.keyboard.isDown(Phaser.Keyboard.D);

    }

    else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){               
        player.scale.x = -.5;
        player.body.velocity.x = -225;
        //player.body.velocity.x = -475;
        if (attacking){
            player.animations.play('attack');
        }
        else{
            player.animations.play('walk');
        }
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
            hitbox1.body.setSize(50,40,(15*dirValue)*-1, 0);
            this.hit();
        }
        
        else if (currItem.key == 'health'){
            if (healthArray.length < 3){
                this.addHealth();
                inventoryArray.splice(inventoryArray.indexOf(currItem));
                currItem = inventoryArray[0];
            }


        }
    }
    
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.TAB);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    
    if (game.input.keyboard.downDuration(Phaser.Keyboard.TAB, 10)){
        currItem = inventoryArray[inventoryArray.indexOf(currItem) + 1];
        console.log(currItem);
        if (currItem == undefined){

        }
        else{
            showCurrItem(currItem);

        }
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
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('scale.x', 0.8);
    bullets.setAll('scale.y', 0.8);        
}

function displayCurrentItem(x, y){
    itemBox = game.add.graphics(x, y);
    itemBox.beginFill(0x5daf8a);
    itemBox.alpha = 0.65;
    itemBox = itemBox.drawRect(0, 0, 50, 50);
    itemBox.fixedToCamera = true;
    itemOnScreen = game.add.sprite(x, y, currItem.key);
    itemOnScreen.alignIn(itemBox, Phaser.CENTER);
    itemOnScreen.fixedToCamera = true;
    itemOnScreen.scale.x = 3.75;
    itemOnScreen.scale.y = 3.75;
}

function fire(){
    if(game.time.now > nextFire){
        nextFire = game.time.now + fireRate;         
        bullet = bullets.getFirstDead();
        bullet.reset(player.x, player.y);
        if (dirValue == 1){
            bullet.body.velocity.x = -550;

        }
        else if(dirValue == -1){
            bullet.body.velocity.x = 550;

        }
        
    }
}
function hit(){
    if(!attacking){
        attacking = true;
        hitbox1.body.enable = true;
        player.animations.play('attack');
        var atkTimer = game.time.create(true)
        atkTimer.add(200, function () 
        {
            attacking = false;
            hitbox1.body.enable = false;
        }, this);
        atkTimer.start();
    }
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

function healthFunc(){
    playerHealth = game.add.group();
        healthArray = [];
        for (var i = 0; i < 3; i++){
            playerHealth.create(i * 50, 0, 'health');
            healthArray.push(i);

        }
        playerHealth.fixedToCamera = true;
        playerHealth.setAll('scale.x', 3);
        playerHealth.setAll('scale.y', 3);
}

function createHitbox(){
    hitboxes = game.add.group();
    hitboxes.enableBody = true; 
    player.addChild(hitboxes);
    hitbox1 = hitboxes.create(0,0);
    hitbox1.anchor.setTo(0.75,0.5);
    hitbox1.body.onOverlap = new Phaser.Signal();
    hitbox1.body.onOverlap.add(hitEnemy);
    hitbox1.body.enable = false;
}

function hitEnemy(hitbox, enemy){
    enemy.kill();
}

function createSlime(){        
    slimeBalls = game.add.group();
    slimeBalls.enableBody = true;
    slimeBalls.physicsBodyType = Phaser.Physics.ARCADE;
    slimeBalls.createMultiple(50, 'slime');
    slimeBalls.setAll('checkWorldBounds', true);
    slimeBalls.setAll('outOfBoundsKill', true);
    slimeBalls.setAll('scale.x', 0.1);
    slimeBalls.setAll('scale.y', 0.1);
    
}

function playerHit(enemy, player){
    if (enemy.key = 'slime'){
        enemy.kill();
        healthArray.pop();
        var heart = playerHealth.getFirstAlive();
        heart.kill();
        player.tint = 0xf24826
        player.body.velocity.x = 500*dirValue;
        player.body.velocity.y = -50
        game.time.events.add(500, unTint);
    }
    else{
        if (!overlap){
            overlap = true;
            healthArray.pop();
            var heart = playerHealth.getFirstAlive();
            heart.kill();
        }
    }
    if (healthArray.length == 0){
        player.kill();
        game.state.start('youDied');
    }
}

function unTint(){
    player.tint = 0xffffff;

}