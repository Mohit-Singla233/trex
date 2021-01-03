var trex,trex1,trex2,ground,groundvis,groundinvs,obstacle,ob1,ob2,ob3,ob4,ob5,obstacleGroup,clouds,cloudImage,restart,restartani,gameover,gameoverani,cloudsGroup,gameState,score,jumpsound,checksound,diesound;

//local starage
localStorage.highscore = 0;

function preload(){
  //trex animation load
  trex1 = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex2 = loadAnimation("trex_stop.png");  
  //ground visisble animation load
  groundvis = loadImage("ground2.png");
  
  //clouds animation load
  cloudImage = loadImage("cloud.png");
  
  //obstacle animation load
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");

  //restart animation load
  restartani = loadImage("restart.png");
  
  //gameover
  gameoverani = loadImage("gameOver.png");
  
  //loading the jump sound
  jumpsound = loadSound("jump.mp3");
  
  //loading the checkpoint sound
  checksound = loadSound("checkPoint.mp3");
  
  //loading the die sound
  diesound = loadSound("die.mp3");
}



function setup() {
  createCanvas(600,200);
  
  //trex
  trex = createSprite(50,170,20,50);
  trex.addAnimation("running",trex1);
  trex.addAnimation("out",trex2);
  trex.scale = 0.5;
  
  //ground visible
  ground = createSprite(200,190,400,20);
  ground.addImage(groundvis);
  
  //invisible groung for colliding the trex w the ground
  invsground = createSprite(200,195,400,5);
  invsground.visible = false; 
  
  //group for the clouds and onstacles
      cloudsGroup = new Group();
  
  //group for the obstacle
  obstaclesGroup = new Group();
  
  //gameState
  gameState = "play";
  
  //restart
  restart = createSprite(300,100);
  restart.addImage(restartani);
  restart.scale = 0.5;
  restart.visible = false;
  
  //gameover
  gameover = createSprite(300,50);
  gameover.addImage(gameoverani)
  gameover.visible = false;
  
  //score
  score = 0;
}

function draw() {
  background(180);
  drawSprites();
  
  //score
  text("score ="+score,500,20);
  
  //highscore
  if(localStorage.highscore>0){
    text("HS = "+localStorage.highscore,400,20);
  }
  
  //trex colliding with the invisible ground
  trex.collide(invsground);

  //gameState
  if(gameState === "play"){
     //when space is pressed the trex jumps
  if(keyWentDown("space") && trex.y>= 169) {
      trex.velocityY = -12; 
      jumpsound.play();
  }
    
    //checkpont sound
    if(score>0 && score % 100 ===0) {
      checksound.play();
    }
  
  //gravity for when the trex jumps so it dosen't go into space
  trex.velocityY = trex.velocityY + 0.8;
  
  //make the ground move
  ground.velocityX = -6    
  
  //to make it look like the ground is infinite
  if (ground.x < 0){
         ground.x = ground.width/2;
        }
  
  //spawn the clouds
  spawnclouds();
  
  //spawn the obstacles
  spwanObstacles();
    
  //how to end
    if(trex.isTouching(obstaclesGroup)){
      gameState = "end";
      diesound.play();
    }
    
    //score
    score = Math.round(World.frameRate/30)+score;
    
  }
  else {
    //velocity
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //gravity
    trex.velocityY = 0;
    
    //lifetime
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //trex Animation
    trex.changeAnimation("out",trex2);
    
    //restart and gameover
    restart.visible = true;
    gameover.visible = true;
    
    //restart
    if(mousePressedOver(restart)){
      playagain();
    }
  }
 
}

function spawnclouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
      var clouds = createSprite(600,120,40,10);
      clouds.y = random(80,120);
      clouds.addImage(cloudImage);
      clouds.scale = 0.5;
      clouds.velocityX = -3;

       //assign lifetime to the variable
      clouds.lifetime = 200;

      //adjust the depth
      clouds.depth = trex.depth;
      trex.depth = trex.depth + 1;

      //add each cloud to the group
      cloudsGroup.add(clouds);
  }
}

function spwanObstacles(){
  //write code here to spawn obstacles
  if(World.frameCount % 60 === 0){
        var ob = createSprite(600,175);
        ob.velocityX = -6 ;
        ob.scale = 0.5;
        ob.lifetime = 100;
        obstaclesGroup.add(ob);
        //random no for the differnt obstacles
        var R = Math.round(random(1,6));
        switch (R) {

          case 1:
            ob.addImage(ob1);
            break;
          case 2:
             ob.addImage(ob2);
            break;
          case 3:
            ob.addImage(ob3);
            break;
          case 4:
            ob.addImage(ob4);
            break;
          case 5:
            ob.addImage(ob5);
            break;
          case 6:
            ob.addImage(ob6 );
        }

      }
}

function playagain() {
  //gameState
  gameState = "play";
  
  //restart and gameover
  restart.visible = false;
    gameover.visible = false;
  
  //trex animation
  trex.changeAnimation("running",trex1);
  
  //destroy obstacles and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //high score
  if(localStorage.highscore<score) {
    localStorage.highscore=score;
    
  }
  
  //reset the score
  score = 0;
  
  
}