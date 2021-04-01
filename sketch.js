var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trexCollided_Img;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound, trexSound, gameOvrSound1, gameOvrSound2;
var backGround, backGroundImg;

function preload(){
  trex_running = loadAnimation("Dino_Running_1.png", "Dino_Running_2.png", "Dino_Running_3png.png", "Dino_Running_4.png", "Dino_Running_5.png", "Dino_Running_6.png");
  trex_collided = loadAnimation("Dino_Collided_1.png", "Dino_Collided_2.png", "Dino_Collided_3.png", "Dino_Collided_4.png", "Dino_Collided_5.png");
  trex_collided_Img = loadAnimation("Dino_Collided_5.png");

  // groundImage = loadImage("Desert-Ground_1.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Thorny_1.png");
  obstacle2 = loadImage("Thorny_2.png");
  obstacle3 = loadImage("Thorny_3.png");
  obstacle4 = loadImage("Thorny_4.png");
  obstacle5 = loadImage("Thorny_5.png");
  obstacle6 = loadImage("Thorny_6.png");
  
  restartImg = loadImage("ReplayButton.png")
  gameOverImg = loadImage("Dsrt_GameOver.png")

  backGroundImg = loadImage("cartoon-desert-bg for C39 Pro.jpg")
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  // gameOvrSound1 = loadSound("mixkit-sad-game-over-trombone-471.wav");
  // gameOvrSound2 = loadSound("mixkit-spooky-game-over-1948.wav")
  // trexSound = loadSound("TrexSoundMix.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  backGround = createSprite(displayWidth/1.4, displayHeight/2, displayWidth, displayHeight);
  backGround.addImage(backGroundImg);
  backGround.scale = 5;

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(70,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.changeAnimation("collided image", trexCollided_Img);
  // trex.velocityX = 10;
  

  trex.scale = 0.8;
  
  // ground = createSprite(width/6, height-50, windowWidth, 20);
  // ground.addImage("ground",groundImage);
  // ground.scale = 7;
  // ground.x = ground.width /2;
  
  gameOver = createSprite(windowWidth/2, windowHeight/4, 25, 25);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2, windowHeight/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  trex.scale =1.2;
  
  invisibleGround = createSprite(width/300, height-35, windowWidth, 10);
  invisibleGround.visible = false;
  // camera.position.x = invisibleGround.x;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  // trex.debug = true;
  
  score = 0;

  // if (typeof trexSound.loop == 'boolean')
  // {
  //     trexSound.loop = true;
  // }
  
}

function draw() {
  
  background(180);

  // trexSound.play();
  
  // trexSound.loop();

  // camera.position.x = displayWidth-700
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    backGround.velocityX = -(4 + 3* score/100);
    // ground.velocityX = -(4 + 3* score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (backGround.x < displayWidth/2){
      backGround.x = displayWidth/1.3;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    // //spawn the clouds
    // spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    

     
      // ground.velocityX = 0;
      trex.velocityY = 0

      backGround.velocityX = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
   if(mousePressedOver(restart)) {
     reset();
     trex.changeAnimation("running", trex_running);
    }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  



  drawSprites();

  //displaying score
  push();
  fill(	249, 224, 118);
  stroke(214, 184, 90);
  strokeWeight(15);
  textSize(30);
  text("Score: "+ score, windowWidth/26, windowHeight/12);
  pop();

  push();
  fill("red");
  stroke("red");
  strokeWeight(1);
  textSize(35);
  text("Presse Space Bar to jump!!!", windowWidth/2.5, windowHeight/26);
  pop();

  push();
  fill("red");
  stroke("red");
  strokeWeight(1);
  textSize(35);
  text("Keep running but look out for the cactus hands!!!", windowWidth/3.3, windowHeight/10);
  pop();

}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnObstacles(){
  if (frameCount % 110 === 0){
    var obstacle = createSprite(windowWidth+100,height-55,10,40);
    obstacle.velocityX = -(6 + score/100);
    // obstacle.setCollider("rectangle", 0, 0, obstacle.width, obstacle.height);
    // obstacle.debug = true;

    // obstacle.y = Math.round(random(height-55, height-45));

     //generate random obstacles
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;
       case 2: obstacle.addImage(obstacle2);
               break;
       case 3: obstacle.addImage(obstacle3);
               break;
       case 4: obstacle.addImage(obstacle4);
               break;
       case 5: obstacle.addImage(obstacle5);
               break;
       case 6: obstacle.addImage(obstacle6);
               break;
       default: break;
   
    }
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    obstacle.scale = 1;
   
    obstaclesGroup.setColliderEach("rectangle",0,0,obstacle.width,obstacle.height);
    obstaclesGroup.debug = true;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }  
}

// function spawnClouds() {
//   //write code here to spawn the clouds
//   if (frameCount % 60 === 0) {
//     var cloud = createSprite(600,120,40,10);
//     cloud.y = Math.round(random(80,120));
//     cloud.addImage(cloudImage);
//     cloud.scale = 0.5;
//     cloud.velocityX = -3;
    
//      //assign lifetime to the variable
//     cloud.lifetime = 200;
    
//     //adjust the depth
//     cloud.depth = trex.depth;
//     trex.depth = trex.depth + 1;
    
//     //add each cloud to the group
//     cloudsGroup.add(cloud);
//   }
// }  
