// game.js
//
// create instance of engine

// fullscreen by default
var game = new ex.Engine({
    width: 800,
    height: 600,
});

// x of 150, y position, width 200, height 20
var paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20);

paddle.color = ex.Color.Red;

// set collisions ON
paddle.collisionType = ex.CollisionType.Fixed;

// like game.CurrentScene.add
game.add(paddle);

// mouse move listener
game.input.pointers.primary.on('move', function(evt){
    paddle.pos.x = evt.worldPos.x
});

// create a ball
var ball = new ex.Actor(100, 300, 20, 20);
ball.color = ex.Color.Red;
// velocity, pixels per second
ball.vel.setTo(100, 100);

// set passive collision : just notify and do nothing
ball.collisionType = ex.CollisionType.Passive

// bounce
ball.on('precollision', function(ev) {
   /*
    var intersection = ev.intersection.normalize()
    // flip axis
    if(Math.abs(intersection.x) > Math.abs(intersection.y)) {
        ball.vel.x *= -1;
    }
    else {
        ball.vel.y *= -1;
    }*/
    
    if(bricks.indexOf(ev.other) > -1) {
        // removes actor from current scene
        ev.other.kill()
    }

    // reverse course after collision
    var intersection = ev.intersection.normalize()

    // largest component of intersection is our axis to flip
    if(Math.abs(intersection.x) > Math.abs(intersection.y)){
        ball.vel.x *=  -1
    }
    else{
        ball.vel.y *= -1
    }

})

// wire to postupdate event (bounce with borders of screen)
ball.on('postupdate', function() {
    // if collide on left reverse x vel
    if(this.pos.x < this.getWidth() / 2) {
        this.vel.x *= -1
    }

    // if collide on right
    if(this.pos.x + this.getWidth() / 2 > game.drawWidth){
        this.vel.x *= -1
    }

    // if collide on top
    if(this.pos.y < this.getHeight() / 2){
        this.vel.y *= -1
    }
})

ball.draw = function(ctx, delta) {
    // if call of original base method
    //ex.Actor.prototype.draw.call(this, ctx, delta)
    
    // custom draw code
    ctx.fillStyle = this.color.toString()
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
}

game.add(ball)

// works even after adding ball to the game
ball.on('exitviewport', function() {
    alert('You lose !')
})

// build bricks

var padding = 20 // px
var xoffset = 65 // x-offset
var yoffset = 20 // y-offset
var columns = 5
var rows = 3

var brickColor = [ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow]
// individual brick width with padding factored in
var brickWidth = game.drawWidth / columns - padding - padding / columns // px
var brickHeight = 30 // px

var bricks = []
for(var j=0; j<rows; j++) {
    for(var i=0; i<columns; i++){
        bricks.push(
            new ex.Actor(
                xoffset + i * (brickWidth + padding) + padding,
                yoffset + j * (brickHeight + padding) + padding,
                brickWidth,
                brickHeight,
                brickColor[j % brickColor.length]
            )
        )
    }
}


bricks.forEach(function(brick) {
    // Make sure bricks can participate in collisions
    brick.collisionType = ex.CollisionType.Active
    
    // Add brick to current scene to be drawn
    game.add(brick);
})


game.start();
