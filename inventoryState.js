
var inventory;

demo.inventoryState = function(){};

demo.inventoryState.prototype = {
    preload: function(){
        game.load.image('gun', 'assets/gun.png');
        game.load.image('pickAxe', 'assets/Pickaxe.png');
        game.load.image('health', 'assets/Heart.png');
        game.load.image('key', 'assets/key.png');
    },
    
    create: function(){
        game.stage.backgroundColor = '#42ebf4';
        console.log(inventoryArray);
        inventory = game.add.group();
        
        for (var i = 0; i < inventoryArray.length; i++){
            inventory.create(0, 0, inventoryArray[i].key);
            console.log(i);
        }
        inventory.setAll('scale.x', 8);
        inventory.setAll('scale.y', 8);
        inventory.align(2, 2, 120, 120, Phaser.CENTER);
        inventory.x = 220;
        inventory.y = 150;

    },
    
    update: function(){
        
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
        //currItem = switchItem(inventoryArray);
        //console.log(currItem);
            game.state.start('village', true, false);    
        }   
    }
}