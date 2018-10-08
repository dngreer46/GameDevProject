var inventory
preload: function(){
    game.load.image('inventory', 'assets/inventory.png', 0, 0);
    game.load.image('gun', 'assets/gun.png', 0, 0);
},
    
create: function(){
    inventory = [];
    
update: function(){
    game.physics.arcade.overlap(player, item, this.addInventory);
    
}

addInventory: function(){
    inventory.push(item)
}
    
};
