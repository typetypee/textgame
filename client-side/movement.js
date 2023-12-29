var keys = {};
var keys = {};

window.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
  e.preventDefault();
});

window.addEventListener('keyup', function(e) {
  delete keys[e.keyCode];
});

  let direct = "down";
function input() {
  let playerVelocity = new Phaser.Math.Vector2();

  if(37 in keys && playerVelocity.y == 0) {
   direct = "left";
   playerVelocity.x = -1;
   player.flipX = true;
   player.anims.play("walk", true);

  }
  else if(39 in keys && playerVelocity.y == 0) {
    direct = "right";
   playerVelocity.x = 1;
   player.flipX = false;
   player.anims.play("walk", true);
  }
  else if(direct === ("left" || "right")){
   playerVelocity.x = 0;
   player.anims.play("idleX", true);
  }

  if(38 in keys && playerVelocity.x == 0) {
    direct = "up";
    playerVelocity.y = -1;
    player.anims.play("walkUp", true);
  }
  else if(direct == "up") {
   playerVelocity.y = 0;
   player.anims.play("idleUp", true);
  }
  if(40 in keys && playerVelocity.x == 0) {
  direct = "down";
   playerVelocity.y = 1;
   player.anims.play("walkDown", true);
  }
  else if(direct == "down"){
   playerVelocity.y = 0;
   player.anims.play("idleDown", true);
  }

  playerVelocity.scale(2);
  player.setVelocity(playerVelocity.x, playerVelocity.y);
}
