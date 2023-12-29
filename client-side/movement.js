function input() {
  if(cursors.left.isDown) {
   player.setVelocityX(-100);
   player.flipX = true;
   if(player.body.touching.down) player.anims.play("walk", true);

  }
  else if(cursors.right.isDown) {
   player.setVelocityX(100);
   player.flipX = false;
   if(player.body.touching.down) player.anims.play("walk", true);
  }
  else {
   player.setVelocityX(0);
   player.anims.play("idleX", true);
  }
  if(cursors.up.isDown) {
   player.setVelocityY(-100);
   if(player.body.touching.down) player.anims.play("walkUp", true);

  }
  else {
   player.setVelocityY(0);
   player.anims.play("idleUp", true);
  }
  if(cursors.down.isDown) {
   player.setVelocityY(100);
   if(player.body.touching.down) player.anims.play("walkDown", true);
  }
  else {
   player.setVelocityY(0);
   player.anims.play("idleDown", true);

  }
}
