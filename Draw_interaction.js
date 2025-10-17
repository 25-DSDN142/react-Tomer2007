let background1 = true;
let rightheadanim = 0;
let leftheadanim = 0;
let handedness;

// Face expression states
let isMouthOpen = false;
let isSmiling = false;
let isFrowning = false;
let isAngry = false;

// Hand tracking
let leftHandHealth = 100;
let rightHandHealth = 100;
let blockIFrames = 0;
let rightFullBlockHB = 1;
let leftFullBlockHB = 1;
let leftDamageMulti = 1;
let rightDamageMulti = 1;
let leftIsRaging = false;
let rightIsRaging = false;

let distance;
let d;

let rightGloveColour;
let leftGloveColour;

let rightEyeColour;
let leftEyeColour;

let leftChargingAttack = false;  
let rightChargingAttack = false;  

let Rdistance;
let RightStartingLocationX;
let RightStartingLocationY;
let RightBallSize;
let firingBallRight = false;
let RightTargetX;
let RightTargetY;  
let RightBallX; 
let RightBallY;
let rightBallTimer;

let rightHasGottenStart = true;

let Ldistance;
let LeftStartingLocationX;
let LeftStartingLocationY;
let LeftBallSize;
let firingBallLeft = false;
let LeftTargetX;
let LeftTargetY;  
let LeftBallX; 
let LeftBallY;
let leftBallTimer;

let leftHasGottenStart = true;

//gif fixes
let activeImpacts = [];

// Hand positions for interaction
let leftThumbTipX = 0;
let leftThumbTipY = 0;
let rightThumbTipX = 0;
let rightThumbTipY = 0;

let leftPinkyTipX = 0;
let leftPinkyTipY = 0;
let rightPinkyTipX = 0;
let rightPinkyTipY = 0;

let leftHeadX = 0;
let leftHeadY = 0;
let rightHeadX = 0;
let rightHeadY = 0;

// Face positions
let noseTipY = 0;
let noseTipX = 0;

let cloudX1 = 0;
let cloudX2 = 0;

let whatGesture; 

let fightingGame = false;

function prepareInteraction() {
  punchImpactImage = loadImage('/images/NewPunchImpact.gif');
  headImpactImage = loadImage('/images/Head_hit.gif');
  explosionImage = loadImage('/images/Explosion.gif');
  boxingRing = loadImage('/images/boxingRing.png');

  rightEyeColour = color(0,0,0);
  leftEyeColour = color(0,0,0);
}

function drawInteraction(faces, hands) {
  if (key == 'f'){
    fightingGame = true;
  }
  if (key == 'b'){
    background1 = false;
  }
  
  if (background1 === true){
    Background1();
  }

  if (fightingGame === true){
  image(boxingRing, 50, 363, 1180, 860);
  }
  // ----=  HANDS PART  =----
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    
    handedness = hand.handedness;

    let whatGesture = detectHandGesture(hand);

    // Get hand keypoints
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;
    let ringFingerTipX = hand.ring_finger_tip.x;
    let ringFingerTipY = hand.ring_finger_tip.y;
    let middleFingerDipX = hand.middle_finger_dip.x;
    let middleFingerDipY = hand.middle_finger_dip.y;
    let middleFingerMcpX = hand.middle_finger_mcp.x;
    let middleFingerMcpY = hand.middle_finger_mcp.y; 
    let wristX = hand.wrist.x;
    let wristY = hand.wrist.y;

    // Calculate distance and rotation
    d = dist(middleFingerMcpX, middleFingerMcpY, wristX, wristY); 
    distance = map(d, 0, 100, 1, 100);

    let dy = (middleFingerMcpY - wristY);
    let dx = (middleFingerMcpX - wristX);
    let RotationAmount = Math.atan2(dy, dx);

    // Draw puppet parts
    if (handedness === "Left"){
    fill(100,20,20);
    PuppetBody(hand, RotationAmount);
    }
    if (handedness === "Right"){
        fill(20,20,100);
        PuppetBody(hand, RotationAmount);
    }

    push();
    translate(middleFingerDipX, middleFingerDipY);
    rotate(RotationAmount);
    fill(255);
    stroke(0);
    if (handedness === "Left"){
    ellipse(leftheadanim, leftheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }
    if (handedness === "Right"){
    ellipse(rightheadanim, rightheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }
    pop();

    if (handedness === "Left"){
    fill(leftEyeColour);
    stroke(leftEyeColour);
    ellipse(indexFingerTipX, indexFingerTipY, (distance*0.2), (distance*0.2));
    ellipse(ringFingerTipX, ringFingerTipY, (distance*0.2), (distance*0.2));
    }
    if (handedness === "Right"){
    fill(rightEyeColour);
    stroke(rightEyeColour);
    ellipse(indexFingerTipX, indexFingerTipY, (distance*0.2), (distance*0.2));
    ellipse(ringFingerTipX, ringFingerTipY, (distance*0.2), (distance*0.2));
    }
   
    if (handedness === "Left"){
      if (whatGesture == "Block"){
        leftFullBlockHB = 0;
        leftGloveColour = color(156, 68, 65);
        
      }
      else{
        leftFullBlockHB = 1;
        leftGloveColour = color(214, 46, 28);
      }
    }
    if (handedness === "Right"){
      if (whatGesture == "Block"){
        rightFullBlockHB = 0;
        rightGloveColour = color(65, 100, 156);
      }
      else{
        rightFullBlockHB = 1;
        rightGloveColour = color(67, 133, 240);
      }
    }

    if (fightingGame === true){
     if (handedness === "Left" && whatGesture == "Charge"){
        console.log("Charging attack");
        leftChargingAttack = true;
        leftBallTimer = 0;
        leftHasGottenStart = true; 
      }
    
     if (handedness === "Right" && whatGesture == "Charge"){
        console.log("Charging attack");
        rightChargingAttack = true;
        rightBallTimer = 0;
        rightHasGottenStart = true;
      }
    }

    if (handedness === "Left"){
      PuppetArmThumb(hand, leftGloveColour);
      PuppetArmPinky(hand, leftGloveColour);
    }
    if (handedness === "Right"){
      PuppetArmThumb(hand, rightGloveColour);
      PuppetArmPinky(hand, rightGloveColour);
    }

  if (fightingGame === true){
    if (rightChargingAttack === true){
      RightBallAttack(hand);
    }
    if (leftChargingAttack === true){
      LeftBallAttack(hand);
    }
    if (firingBallRight === true){  
    FireBallR(RightBallSize, RightStartingLocationX, RightStartingLocationY, RightTargetX, RightTargetY, rightBallTimer);
    }

    if (firingBallLeft === true){  
    FireBallL(LeftBallSize, LeftStartingLocationX, LeftStartingLocationY, LeftTargetX, LeftTargetY, leftBallTimer);
    }
    
    HitBox(hand);
    puppetBlockInteraction(hand);
  }

      // draw all active impacts
    for (let i = activeImpacts.length - 1; i >= 0; i--) {
      let impact = activeImpacts[i];
      impact.timer++;

      // Draw gif
      image(impact.img, impact.x - impact.size / 2, impact.y - impact.size / 2, impact.size, impact.size);

      // Once timer expires, remove it
      if (impact.timer > impact.lifetime) {
        activeImpacts.splice(i, 1);
      }
    }
    // Draw facial expressions on puppet
    if (faces.length > 0) {
      if (isFrowning) {
        frowningPuppet(hand);
      }
      if (isSmiling) {
        smilingPuppet(hand);
      }
      if (isAngry) {
        angryPuppet(hand, RotationAmount);
      }
    }
  }
  if (fightingGame === true){
  if (rightHandHealth > 1 || leftHandHealth > 1){
  HealthBars(rightHandHealth, leftHandHealth);
  }
  if (leftHandHealth < 1){
        textSize(50);
        fill(56, 104, 194);
        text('Blue Wins!', 640, 250, 240,240);
  }
  if (rightHandHealth < 1){
        textSize(50);
        fill(181, 70, 62);
        text('Red Wins!', 640, 250, 240,240);
  }
  }

  // ----=  FACE PART  =----
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    if (showKeypoints) {
      drawPoints(face)
    }
    
    // Safely check if face has required keypoints
    if (!face.keypoints || face.keypoints.length < 400) {
      console.warn("Face detected but keypoints incomplete");
      continue;
    }

    // Check facial expressions
    checkIfMouthOpen(face);
    checkIsSmiling(face);
    checkIsFrowning(face);
    checkIsAngry(face);

    // Activate Rage mode when Mouth opens
    if (isMouthOpen == true) {
      if (rightHandHealth < 33){
        rightRageMode();
      }
      if (leftHandHealth < 33){
        leftRageMode();
      }
    }
  }
}

function drawConnections(hand) {
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}

function PuppetBody(hand, rotationAmount) {
  let middleFingerMcpX = hand.middle_finger_mcp.x;
  let middleFingerMcpY = hand.middle_finger_mcp.y;

  let wristX = hand.wrist.x;
  let wristY = hand.wrist.y;
 
  rectMode(CENTER);
  push();
  translate(wristX, wristY);
  rotate(rotationAmount);
  stroke(0);
  rect(0,0, 1.3*distance,distance);
  pop();

  push();
  translate(middleFingerMcpX, middleFingerMcpY);
  rotate(rotationAmount);
  stroke(0);
  rect(0,0, 1.2*distance,distance);
  pop();
}

function PuppetArmThumb(hand, GloveColour) {
  let thumbCmcX = hand.thumb_cmc.x;
  let thumbCmcY = hand.thumb_cmc.y;
  let thumbMcpX = hand.thumb_mcp.x;
  let thumbMcpY = hand.thumb_mcp.y;
  let thumbIpX = hand.thumb_ip.x;
  let thumbIpY = hand.thumb_ip.y;
  let thumbTipX = hand.thumb_tip.x;
  let thumbTipY = hand.thumb_tip.y;
  let indexFingerMcpY = hand.index_finger_mcp.y;
  let indexFingerMcpX = hand.index_finger_mcp.x;

  let shoulderY = (thumbCmcY + indexFingerMcpY) * 0.5;
  let shoulderX = (thumbCmcX + indexFingerMcpX) * 0.5;

  strokeWeight(10);
  stroke(0);
  line(shoulderX, shoulderY, thumbMcpX, thumbMcpY);
  line(thumbMcpX, thumbMcpY, thumbIpX, thumbIpY);
  line(thumbIpX, thumbIpY, thumbTipX, thumbTipY);
  fill(GloveColour);
  ellipse(thumbTipX, thumbTipY, 0.4*distance, 0.4*distance);
}

function PuppetArmPinky(hand, GloveColour) {
  let pinkyFingerMcpX = hand.pinky_finger_mcp.x;
  let pinkyFingerMcpY = hand.pinky_finger_mcp.y;
  let pinkyFingerPipX = hand.pinky_finger_pip.x;
  let pinkyFingerPipY = hand.pinky_finger_pip.y;
  let pinkyFingerDipX = hand.pinky_finger_dip.x;
  let pinkyFingerDipY = hand.pinky_finger_dip.y;
  let pinkyFingerTipX = hand.pinky_finger_tip.x;
  let pinkyFingerTipY = hand.pinky_finger_tip.y;
  let ringFingerMcpY = hand.ring_finger_mcp.y;
  let ringFingerMcpX = hand.ring_finger_mcp.x;

  let shoulderY = (pinkyFingerMcpY + ringFingerMcpY) * 0.5;
  let shoulderX = (pinkyFingerMcpX + ringFingerMcpX) * 0.5;

  strokeWeight(10);
  stroke(0);
  line(shoulderX, shoulderY, pinkyFingerPipX, pinkyFingerPipY);
  line(pinkyFingerPipX, pinkyFingerPipY, pinkyFingerDipX, pinkyFingerDipY);
  line(pinkyFingerDipX, pinkyFingerDipY, pinkyFingerTipX, pinkyFingerTipY);
  fill(GloveColour);
  ellipse(pinkyFingerTipX, pinkyFingerTipY, 0.4*distance, 0.4*distance);
}

function checkIfMouthOpen(face) {
  if (!face.keypoints || face.keypoints.length < 15) return;
  
  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]
  let d = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
  
  isMouthOpen = d >= 10;
}

function checkIsSmiling(face) {
  if (!face.keypoints || face.keypoints.length < 309) return;
  
  let middleInnerLipY = face.keypoints[13].y;
  let leftOuterLipY = face.keypoints[308].y;
  let rightOuterLipY = face.keypoints[61].y;

  isSmiling = (rightOuterLipY < middleInnerLipY && leftOuterLipY < middleInnerLipY);
}

function checkIsFrowning(face) {
  if (!face.keypoints || face.keypoints.length < 309) return;
  
  let middleLowerLipY = face.keypoints[14].y;
  let leftOuterLipY = face.keypoints[308].y;
  let rightOuterLipY = face.keypoints[61].y;

  isFrowning = (rightOuterLipY > middleLowerLipY && leftOuterLipY > middleLowerLipY);
}

function checkIsAngry(face) {
  if (!face.keypoints || face.keypoints.length < 301) return;
  
  let rightOuterBrowY = face.keypoints[70].y;
  let rightInnerBrowY = face.keypoints[55].y;
  let leftOuterBrowY = face.keypoints[300].y;
  let leftInnerBrowY = face.keypoints[285].y;

  isAngry = (rightOuterBrowY < rightInnerBrowY && leftOuterBrowY < leftInnerBrowY);
}

function frowningPuppet(hand) {
  let indexFingerTipX = hand.index_finger_tip.x;
  let indexFingerTipY = hand.index_finger_tip.y;
  let ringFingerTipX = hand.ring_finger_tip.x;
  let ringFingerTipY = hand.ring_finger_tip.y;
  let indexFingerDipX = hand.index_finger_dip.x;
  let indexFingerDipY = hand.index_finger_dip.y;
  let ringFingerDipX = hand.ring_finger_dip.x;
  let ringFingerDipY = hand.ring_finger_dip.y;

  push();
  noFill();
  stroke(0);
  strokeWeight(10);
  curve(indexFingerDipX, indexFingerDipY+distance*2, indexFingerTipX, indexFingerTipY+0.4*distance, ringFingerTipX, ringFingerTipY+0.4*distance, ringFingerDipX, ringFingerDipY+distance*2);
  pop();
}

function smilingPuppet(hand) {
  let indexFingerTipX = hand.index_finger_tip.x;
  let indexFingerTipY = hand.index_finger_tip.y;
  let ringFingerTipX = hand.ring_finger_tip.x;
  let ringFingerTipY = hand.ring_finger_tip.y;
  let indexFingerDipX = hand.index_finger_dip.x;
  let indexFingerDipY = hand.index_finger_dip.y;
  let ringFingerDipX = hand.ring_finger_dip.x;
  let ringFingerDipY = hand.ring_finger_dip.y;

  push();
  noFill();
  stroke(0);
  strokeWeight(10);
  curve(indexFingerDipX, indexFingerDipY-distance*0.3, indexFingerTipX, indexFingerTipY+distance*0.3, ringFingerTipX, ringFingerTipY+distance*0.3, ringFingerDipX, ringFingerDipY-distance*0.3);
  pop();
}

function angryPuppet(hand, rotation) {
  let indexFingerTipX = hand.index_finger_tip.x;
  let indexFingerTipY = hand.index_finger_tip.y;
  let ringFingerTipX = hand.ring_finger_tip.x;
  let ringFingerTipY = hand.ring_finger_tip.y;
  push();
  fill(0);
  stroke(0);
  strokeWeight(10);
  translate(indexFingerTipX, indexFingerTipY-0.2*distance);
  if (handedness === "Left") {
    rotate(rotation+70);
  }
  if (handedness === "Right") {
    rotate(rotation-70);
  }
  rect(0, 0, 0.35*distance, 0.1*distance);
  pop();

  push();
  fill(0);
  stroke(0);
  strokeWeight(10);
  translate(ringFingerTipX, ringFingerTipY-0.2*distance);
  if (handedness === "Left") {
    rotate(rotation-70);
  }
  if (handedness === "Right") {
    rotate(rotation+70);
  }
  rect(0, 0, 0.35*distance, 0.1*distance);
  pop();
}

function rightRageMode(){
  rightDamageMulti = 2;
  rightEyeColour = color(48, 92, 227);
  rightIsRaging = true;
}

function leftRageMode(){
  leftDamageMulti = 2;
  leftEyeColour = color(237, 53, 40);
  leftIsRaging = true;
}

function puppetBlockInteraction(hand) {
  if (hand.handedness === "Left") {
    leftThumbTipX = hand.thumb_tip.x;
    leftThumbTipY = hand.thumb_tip.y; 

    leftPinkyTipX = hand.pinky_finger_tip.x;
    leftPinkyTipY = hand.pinky_finger_tip.y; 
  }

  if (hand.handedness === "Right") {
    rightThumbTipX = hand.thumb_tip.x;
    rightThumbTipY = hand.thumb_tip.y;

    rightPinkyTipX = hand.pinky_finger_tip.x;
    rightPinkyTipY = hand.pinky_finger_tip.y; 
  }
  

  if (leftThumbTipX < rightThumbTipX+0.4*distance && leftThumbTipY < rightThumbTipY+0.4*distance && leftThumbTipX > rightThumbTipX-0.4*distance && leftThumbTipY > rightThumbTipY-0.4*distance){
    image(punchImpactImage, leftThumbTipX-distance*0.5, leftThumbTipY-distance*0.5, distance, distance);
    blockIFrames = 2;
  }

  if (leftPinkyTipX < rightPinkyTipX+0.4*distance && leftPinkyTipY < rightPinkyTipY+0.4*distance && leftPinkyTipX > rightPinkyTipX-0.4*distance && leftPinkyTipY > rightPinkyTipY-0.4*distance){
    image(punchImpactImage, leftPinkyTipX-distance*0.5, leftPinkyTipY-distance*0.5, distance, distance);
    blockIFrames = 2;
  }

 if (leftThumbTipX < rightPinkyTipX+0.4*distance && leftThumbTipY < rightPinkyTipY+0.4*distance && leftThumbTipX > rightPinkyTipX-0.4*distance && leftThumbTipY > rightPinkyTipY-0.4*distance){
    fill(200,200,10);
    image(punchImpactImage, leftThumbTipX-distance*0.5, leftThumbTipY-distance*0.5, distance, distance);
    blockIFrames = 2;
  }

  if (leftPinkyTipX < rightThumbTipX+0.4*distance && leftPinkyTipY < rightThumbTipY+0.4*distance && leftPinkyTipX > rightThumbTipX-0.4*distance && leftPinkyTipY > rightThumbTipY-0.4*distance){
    image(punchImpactImage, rightPinkyTipX-distance*0.5, rightPinkyTipY-distance*0.5, distance, distance);
    blockIFrames = 2;
  }

  //ProjectileBlock
 if (RightBallX < LeftBallX + LeftBallSize && RightBallY < LeftBallY + LeftBallSize && RightBallX > LeftBallX - LeftBallSize && RightBallY > LeftBallX - LeftBallSize){
    fill(200,200,10);
    if (LeftBallSize > RightBallSize && firingBallRight === true){
    createImpact(RightBallX, RightBallY, RightBallSize*2, punchImpactImage, 30);
    firingBallRight = false;
    RightBallX = -3500;
    }
    if (RightBallSize > LeftBallSize && firingBallLeft === true){
    createImpact(LeftBallX, LeftBallY, LeftBallSize*2, punchImpactImage, 30);
    firingBallLeft = false;
    LeftBallX = -3500;
    }
    
  }

  if (firingBallRight === true){
  if (leftThumbTipX < RightBallX + RightBallSize*0.5 && leftThumbTipY < RightBallY + RightBallSize*0.5 && leftThumbTipX > RightBallX - RightBallSize*0.5 && leftThumbTipY > RightBallX - RightBallSize*0.5){
    fill(200,200,10);
    createImpact(leftThumbTipX, leftThumbTipY, RightBallSize, punchImpactImage, 30);
    firingBallRight = false;
    blockIFrames = 5;
    RightBallX = -3500;
  }
  if (leftPinkyTipX < RightBallX + RightBallSize*0.5 && leftPinkyTipY < RightBallY + RightBallSize*0.5 && leftPinkyTipX > RightBallX - RightBallSize*0.5 && leftPinkyTipY > RightBallX - RightBallSize*0.5){
    fill(200,200,10);
    createImpact(leftPinkyTipX, leftPinkyTipY, RightBallSize, punchImpactImage, 30);
    firingBallRight = false;
    blockIFrames = 5;
    RightBallX = -3500;
  }
}

 if (firingBallLeft === true){
  if (rightThumbTipX < LeftBallX + LeftBallSize*0.5 && rightThumbTipY < LeftBallY + LeftBallSize*0.5 && rightThumbTipX > LeftBallX - LeftBallSize*0.5 && rightThumbTipY > LeftBallX - LeftBallSize*0.5){
    fill(200,200,10);
    createImpact(rightThumbTipX, rightThumbTipY, LeftBallSize, punchImpactImage, 30);
    firingBallLeft = false;
    blockIFrames = 5;
    LeftBallX = -3500;
  }
  if (rightPinkyTipX < LeftBallX + LeftBallSize && rightPinkyTipY < LeftBallY + LeftBallSize && rightPinkyTipX > LeftBallX - LeftBallSize && rightPinkyTipY > LeftBallX - LeftBallSize){
    fill(200,200,10);
    createImpact(rightPinkyTipX, rightPinkyTipY, LeftBallSize, punchImpactImage, 30);
    firingBallLeft = false;
    blockIFrames = 5;
    LeftBallX = -3500;
  }
  }

  fill(11, 162, 20);
  ellipse(rightThumbTipX, rightThumbTipY, 10, 10);

  fill(121, 12, 1);
  ellipse(leftThumbTipX, leftThumbTipY, 10, 10);
}

function Background1() {
   cloudX1 = cloudX1+ 0.5*(101 - leftHandHealth);
   cloudX2 = cloudX2+ 0.5*(101 - rightHandHealth);
   fill(71, 136, 186);
    noStroke();
    rectMode(CENTER);
    rect(640, 480, 1280, 960);
    fill(185, 186, 173);
    ellipse(cloudX1, 140, 500, 180);
    fill(226, 227, 218);
    ellipse(cloudX1+50, 120, 400, 150);
    ellipse(cloudX1+40, 95, 200, 200);

    fill(185, 186, 173);
    ellipse(cloudX2-200, 220, 400, 180);
    fill(226, 227, 218);
    ellipse(cloudX2-225, 210, 300, 160);
    ellipse(cloudX2-210, 180, 180, 200);

  while (cloudX1 > 1500){
    cloudX1 = -80;
  }
  
  while (cloudX2 > 1500){
    cloudX2 = -180;
  }

    fill(39, 71, 42);
    ellipse(300, 610, 1100, 500);
    ellipse(1000, 530, 1400, 500);
    fill(60, 110, 65);
    ellipse(100, 700, 1200, 400);
    ellipse(1300, 600, 2000, 500);
    fill(66, 130, 72);
    ellipse(300, 900, 1400, 600);
    ellipse(1210, 900, 1600, 800);
}

function HealthBars(rightHandHealth, leftHandHealth) {
  push();
  stroke(0);
  fill(209, 48, 48);
  rect(310, 40, 5.5*leftHandHealth, 50);
  fill(100, 96, 209);
  rect(960, 40, 5.5*rightHandHealth, 50);
  pop();

  if (rightHandHealth < 1) {
    rightheadanim = rightheadanim + 7;
    rightHandHealth = 0;
  }
  if (leftHandHealth < 1) {
    leftheadanim = leftheadanim - 7;
    leftHandHealth = 0;
  }
}

function HitBox(hand) {
if (hand.handedness === "Left") {
    leftThumbTipX = hand.thumb_tip.x;
    leftThumbTipY = hand.thumb_tip.y; 

    leftPinkyTipX = hand.pinky_finger_tip.x;
    leftPinkyTipY = hand.pinky_finger_tip.y; 

    leftHeadX = hand.middle_finger_dip.x;
    leftHeadY = hand.middle_finger_dip.y;
  }

if (hand.handedness === "Right") {
    rightThumbTipX = hand.thumb_tip.x;
    rightThumbTipY = hand.thumb_tip.y;

    rightPinkyTipX = hand.pinky_finger_tip.x;
    rightPinkyTipY = hand.pinky_finger_tip.y;

    rightHeadX = hand.middle_finger_dip.x;
    rightHeadY = hand.middle_finger_dip.y;
  }
if (blockIFrames < 0 || rightIsRaging == true){
  if (leftPinkyTipX < rightHeadX+0.8*distance*rightFullBlockHB && leftPinkyTipY < rightHeadY+0.3*distance*rightFullBlockHB && leftPinkyTipX > rightHeadX-0.8*distance*rightFullBlockHB && leftPinkyTipY > rightHeadY-0.3*distance*rightFullBlockHB){
   createImpact(rightHeadX, rightHeadY, 2*distance, headImpactImage, 40);
    rightHandHealth = rightHandHealth - 0.1*leftDamageMulti;
  }
  if (leftThumbTipX < rightHeadX+0.8*distance*rightFullBlockHB && leftThumbTipY < rightHeadY+0.3*distance*rightFullBlockHB && leftThumbTipX > rightHeadX-0.8*distance*rightFullBlockHB && leftThumbTipY > rightHeadY-0.3*distance*rightFullBlockHB){
   createImpact(rightHeadX, rightHeadY, 2*distance, headImpactImage, 40);
    rightHandHealth = rightHandHealth - 0.1*leftDamageMulti;
  }
    ////Ball Attack Right
    if (firingBallRight == true){
    if (RightBallX - RightBallSize*0.5 < leftHeadX+0.8*distance*leftFullBlockHB && RightBallY - RightBallSize*0.5 < leftHeadY+0.3*distance*leftFullBlockHB && RightBallX + RightBallSize*0.5 > leftHeadX-0.8*distance*leftFullBlockHB && RightBallY + RightBallSize*0.5 > leftHeadY-0.3*distance*leftFullBlockHB){
      createImpact(RightBallX, RightBallY, RightBallSize*2, explosionImage, 75); 
      leftHandHealth = leftHandHealth - 8*leftDamageMulti;
      rightHasGottenStart = true;
      RightBallX = 3500;
      firingBallRight = false;
    }
  }
}

if (blockIFrames < 0 || leftIsRaging == true){
  if (rightPinkyTipX < leftHeadX+0.8*distance*leftFullBlockHB && rightPinkyTipY < leftHeadY+0.3*distance*leftFullBlockHB && rightPinkyTipX > leftHeadX-0.8*distance*leftFullBlockHB && rightPinkyTipY > leftHeadY-0.3*distance*leftFullBlockHB){
   createImpact(leftHeadX, leftHeadY, 2*distance, headImpactImage, 40);
    leftHandHealth = leftHandHealth - 0.1*rightDamageMulti;
  }
  if (rightThumbTipX < leftHeadX+0.8*distance*leftFullBlockHB && rightThumbTipY < leftHeadY+0.3*distance*leftFullBlockHB && rightThumbTipX > leftHeadX-0.8*distance*leftFullBlockHB && rightThumbTipY > leftHeadY-0.3*distance*leftFullBlockHB){
    createImpact(leftHeadX, leftHeadY, 2*distance, headImpactImage, 40);
    leftHandHealth = leftHandHealth - 0.1*rightDamageMulti;
  }

    ////Ball Attack Left
    if (firingBallLeft == true){
    if (LeftBallX - LeftBallSize*0.5 < rightHeadX+0.8*distance*rightFullBlockHB && LeftBallY - LeftBallSize*0.5 < rightHeadY+0.3*distance*rightFullBlockHB && LeftBallX + LeftBallSize*0.5 > rightHeadX-0.8*distance*rightFullBlockHB && LeftBallY + LeftBallSize*0.5 > rightHeadY-0.3*distance*rightFullBlockHB){
      createImpact(LeftBallX, LeftBallY, LeftBallSize*2, explosionImage, 75);
      rightHandHealth = rightHandHealth - 4*rightDamageMulti;
      leftHasGottenStart = true;
      LeftBallX = 3500;
      firingBallLeft = false;
    }
  }
}


  blockIFrames = blockIFrames - 1;

}

function LeftBallAttack(hand)
{
  firingBallLeft = false;

  if (handedness === "Right"){
  LeftTargetX = hand.middle_finger_dip.x;
  LeftTargetY = hand.middle_finger_dip.y;
  }

  if (handedness === "Left"){
  let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  leftCenterX = (finger.x + thumb.x) / 2;
  leftCenterY = (finger.y + thumb.y) / 2;
  leftPinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  Ldistance = distance;
  }

  leftBallTimer = leftBallTimer + 1;
  //  circle size controlled by "pinch" gesture
  fill(181, 73, 65, 200);
  stroke(0);
  circle(leftCenterX, leftCenterY, leftPinch);

  if (leftPinch > Ldistance) {
    LeftStartingLocationX = leftCenterX;
    LeftStartingLocationY = leftCenterY;
    LeftBallSize = leftPinch+0.1*Ldistance*leftDamageMulti;
    firingBallLeft = true;
    leftChargingAttack = false;
  }
}

function RightBallAttack(hand)
{
  firingBallRight = false;

  if (handedness === "Left"){
  RightTargetX = hand.middle_finger_dip.x;
  RightTargetY = hand.middle_finger_dip.y;
  }

  if (handedness === "Right"){
  let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  rightCenterX = (finger.x + thumb.x) / 2;
  rightCenterY = (finger.y + thumb.y) / 2;
  rightPinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  Rdistance = distance;
  }

  rightBallTimer = rightBallTimer + 1.5;
  fill(150, 210, 255, 200);
  stroke(0);
  circle(rightCenterX, rightCenterY, rightPinch);

  if (rightPinch > Rdistance) {
    RightStartingLocationX = rightCenterX;
    RightStartingLocationY = rightCenterY;
    RightBallSize = rightPinch+0.1*Rdistance*rightDamageMulti;
    firingBallRight = true;
    rightChargingAttack = false;
  }
}

function FireBallL(LeftBallSize, StartX, StartY, TargetX, TargetY, LeftBallTimer){
  if (leftHasGottenStart == true){
  LeftBallX = StartX;
  LeftBallY = StartY; 
  LeftTargetX = TargetX;
  LeftTargetY = TargetY;
  LeftEaseMulti = LeftBallTimer;
  
  leftHasGottenStart = false; 
  }

  
  let leftEasing = map(LeftEaseMulti, 0, 640, 0.001, 0.05);

  let dx = LeftTargetX - LeftBallX;
  let dy = LeftTargetY - LeftBallY;
  LeftBallX += dx * leftEasing;
  LeftBallY += dy * leftEasing;
  if (LeftBallX < TargetX + 0.1*distance && LeftBallY < TargetY + 0.1*distance && LeftBallX > TargetX - 0.1*distance && LeftBallY > TargetY - 0.1*distance){
    firingBallLeft = false;
  }

  stroke(255);
  fill(220+leftEasing*2000, 63+leftEasing*2000, 52+leftEasing*2000);
  circle(LeftBallX, LeftBallY, LeftBallSize+LeftEaseMulti*0.1);
}

function FireBallR(RightBallSize, StartX, StartY, TargetX, TargetY, RightBallTimer){
  if (rightHasGottenStart == true){
  RightBallX = StartX;
  RightBallY = StartY; 
  RightTargetX = TargetX;
  RightTargetY = TargetY;
  RightEaseMulti = RightBallTimer;
  
  console.log("Has gotten Start");
  rightHasGottenStart = false; 
  }

  console.log(RightBallX);
  
  let rightEasing = map(RightEaseMulti, 0, 640, 0.001, 0.05);

  let dx = RightTargetX - RightBallX;
  let dy = RightTargetY - RightBallY;
  RightBallX += dx * rightEasing;
  RightBallY += dy * rightEasing;
  if (RightBallX < TargetX + 0.1*distance && RightBallY < TargetY + 0.1*distance && RightBallX > TargetX - 0.1*distance && RightBallY > TargetY - 0.1*distance){
    firingBallRight = false;
  }

  stroke(255);
  fill(120+rightEasing*2000, 208+rightEasing*2000, 225+rightEasing*2000);
  circle(RightBallX, RightBallY, RightBallSize+RightEaseMulti*0.1);
}

function createImpact(x, y, Size, Image, time) {
  activeImpacts.push({
    x: x,
    y: y,
    size: Size,
    lifetime: time, // how many frames it stays visible (adjust for full gif duration)
    timer: 0,
    img: Image
  });
}

function drawPoints(feature) {
  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 5);
  }
  pop()
}