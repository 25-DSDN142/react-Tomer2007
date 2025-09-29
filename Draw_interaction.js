// ----=  HANDS  =----
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
  Background1active = false;
  rightheadanim = 0;
  leftheadanim = 0;
}

    

function drawInteraction(faces, hands) {
    //Background1()
  
  // hands part
  // USING THE GESTURE DETECTORS (check their values in the debug menu)
  // detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];


    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    
    handedness = hand.handedness;
    // console.log(hand);
    /*
    Start drawing on the hands here
    */

  //pinchCircle(hand)

    ////HAND//////
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;
    let indexFingerMcpX = hand.index_finger_mcp.x;
    let indexFingerMcpY = hand.index_finger_mcp.y;
    let ringFingerTipX = hand.ring_finger_tip.x;
    let ringFingerTipY = hand.ring_finger_tip.y;
    let middleFingerDipX = hand.middle_finger_dip.x;
    let middleFingerDipY = hand.middle_finger_dip.y;
    let pinkyFingerMcpX = hand.pinky_finger_mcp.x;
    let pinkyFingerMcpY = hand.pinky_finger_mcp.y;
    let thumbCmcX = hand.thumb_cmc.x;
    let middleFingerDipZ = hand.middle_finger_dip.z3D;
    
    let middleFingerMcpX = hand.middle_finger_mcp.x;
    let middleFingerMcpY = hand.middle_finger_mcp.y; 
    let wristX = hand.wrist.x;
    let wristY = hand.wrist.y;

    d = dist(middleFingerMcpX, middleFingerMcpY, wristX, wristY); 
    distance = map(d, 0, 100, 1, 100);
    //let pinkyFingerTipX = hand.pinky_finger_tip.x;
    //let pinkyFingerTipY = hand.pinky_finger_tip.y;

let RotationAmount; 
let dy = (middleFingerMcpY - wristY);
let dx = (middleFingerMcpX - wristX);

RotationAmount = Math.atan2(dy, dx);

    /*
    Start drawing on the hands here
    */
    PuppetBody(hand);
    
push();
    translate(middleFingerDipX, middleFingerDipY);
    rotate(RotationAmount);
    fill(255);
    if (handedness === "Right"){
    ellipse(rightheadanim, rightheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }
    if (handedness === "Left"){
    ellipse(leftheadanim, leftheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }


    pop();


    fill(0, 0, 0);
    ellipse(indexFingerTipX, indexFingerTipY, (distance*0.2), (distance*0.2));
    ellipse(ringFingerTipX, ringFingerTipY, (distance*0.2), (distance*0.2));


    PuppetArmThumb(hand);
    PuppetArmPinky(hand);

    if (isFrowning) {
      frowningPuppet(hand);
    }
    if (isSmiling) {
      smilingPuppet(hand);
    }

    leftHandHealth = 100;
    rightHandHealth = 100;

    puppetBlockInteraction(hand);
    
    HealthBars();

    /*
    Stop drawing on the hands here
    */
  }



  //------------------------------------------------------------
  //facePart
  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face

    if (showKeypoints) {
      drawPoints(face)
    }
    // console.log(face);
    /*
    Once this program has a face, it knows some things about it.
    This includes how to draw a box around the face, and an oval. 
    It also knows where the key points of the following parts are:
     face.leftEye
     face.leftEyebrow
     face.lips
     face.rightEye
     face.rightEyebrow
    */

    /*
    Start drawing on the face here
    */
    ////FACE////
    checkIfMouthOpen(face);
    if (isMouthOpen) {
      text("blah blah", face.keypoints[287].x, face.keypoints[287].y)
    }

    checkIsSmiling(face);
    

    checkIsFrowning(face);
   

   checkIsAngry(face);
   if (isAngry){
    fill(0);
    ellipse(500,500,200,200);
   }

   //fill(50,67,210);
   //drawHouse(face);
    // fill(225, 225, 0);
    // ellipse(leftEyeCenterX, leftEyeCenterY, leftEyeWidth, leftEyeHeight);

    drawPoints(face.leftEye);
    drawPoints(face.leftEyebrow);
    drawPoints(face.lips);
    drawPoints(face.rightEye);
    drawPoints(face.rightEyebrow);
    /*
    Stop drawing on the face here
    */

  }
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
}


function drawConnections(hand) {
  // Draw the skeletal connections
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

function pinchCircle(hand) { // adapted from https://editor.p5js.org/ml5/sketches/DNbSiIYKB
  // Find the index finger tip and thumb tip
  let finger = hand.index_finger_tip;
  //let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  // Calculate the pinch "distance" between finger and thumb
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);

}

/////// FUNCTIONS //////////////
function PuppetBody(hand) {
    let indexFingerDipX = hand.index_finger_dip.x;
    let indexFingerDipY = hand.index_finger_dip.y;
    let ringFingerDipX = hand.ring_finger_dip.x;
    let ringFingerDipY = hand.ring_finger_dip.y;
    let wristX = hand.wrist.x;
    let wristY = hand.wrist.y;

 beginShape();
 vertex(ringFingerDipX, ringFingerDipY);
 vertex(indexFingerDipX, indexFingerDipY);
 vertex(indexFingerDipX, wristY);
 vertex(ringFingerDipX, wristY);
 endShape();

  //circle(wristX, wristY, 300, 400);
}

function PuppetArmThumb(hand) {
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

let shoulderY = (thumbCmcY +  indexFingerMcpY)*0.5;
let shoulderX = (thumbCmcX +  indexFingerMcpX)*0.5;

  strokeWeight(10);
  line(shoulderX, shoulderY, thumbMcpX, thumbMcpY);
  line(thumbMcpX, thumbMcpY, thumbIpX, thumbIpY);
  line(thumbIpX, thumbIpY, thumbTipX, thumbTipY);
  fill(255);
  ellipse(thumbTipX, thumbTipY, 0.4*distance, 0.4*distance);
}

function PuppetArmPinky(hand) {
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

let shoulderY = (pinkyFingerMcpY +  ringFingerMcpY)*0.5;
let shoulderX = (pinkyFingerMcpX +  ringFingerMcpX)*0.5;

  strokeWeight(10);
  line(shoulderX, shoulderY, pinkyFingerPipX, pinkyFingerPipY);
  line(pinkyFingerPipX, pinkyFingerPipY, pinkyFingerDipX, pinkyFingerDipY);
  line(pinkyFingerDipX, pinkyFingerDipY, pinkyFingerTipX, pinkyFingerTipY);
  fill(255); // set to character colour
  ellipse(pinkyFingerTipX, pinkyFingerTipY, 0.4*distance, 0.4*distance);
}

function checkIfMouthOpen(face) {

  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

  let d = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
  //console.log(d)
  if (d < 10) {
    isMouthOpen = false;
  } else {
    isMouthOpen = true;
  }

}

function checkIsSmiling(face) {
  
  let middleInnerLipY = face.keypoints[13].y;
  let leftOuterLipY = face.keypoints[308].y;
  let rightOuterLipY = face.keypoints[61].y;
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

    if (rightOuterLipY < middleInnerLipY && leftOuterLipY < middleInnerLipY) {
      isSmiling = true;
    }
    else{
      isSmiling = false;
    } 
}

function checkIsFrowning(face) {
  
  let middleLowerLipY = face.keypoints[14].y;
  let leftOuterLipY = face.keypoints[308].y;
  let rightOuterLipY = face.keypoints[61].y;
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

    if (rightOuterLipY > middleLowerLipY && leftOuterLipY > middleLowerLipY) {
      isFrowning = true;
    }
    else{
      isFrowning = false;
    } 
}

function checkIsAngry(face) {
  
  let rightOuterBrowY = face.keypoints[70].y;
  let rightInnerBrowY = face.keypoints[55].y;
  let leftOuterBrowY = face.keypoints[300].y;
  let leftInnerBrowY = face.keypoints[285].y;
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

    if (rightOuterBrowY < rightInnerBrowY && leftOuterBrowY < leftInnerBrowY) {
      isAngry = true;
    }
    else{
      isAngry = false;
    } 
}

function drawHouse(face) {
  noseTipY = face.keypoints[4].y;
  noseTipX = face.keypoints[4].x;
  push();

  rect(noseTipX, noseTipY, 300,300); // turn into png of house for background details. Background will be displayed above the face with a variable being able to reveal face
  pop();
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
    let indexFingerMcpX = hand.index_finger_mcp.x
    let pinkyFingerMcpX = hand.pinky_finger_mcp.x;

    noFill();
    curve(indexFingerDipX, indexFingerDipY+distance*2, indexFingerTipX, indexFingerTipY+0.4*distance, ringFingerTipX, ringFingerTipY+0.4*distance, ringFingerDipX, ringFingerDipY+distance*2);

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
    let indexFingerMcpX = hand.index_finger_mcp.x
    let pinkyFingerMcpX = hand.pinky_finger_mcp.x;

    noFill();
    curve(indexFingerDipX, indexFingerDipY-distance*0.4, indexFingerTipX, indexFingerTipY+distance*0.4, ringFingerTipX, ringFingerTipY+distance*0.4, ringFingerDipX, ringFingerDipY-distance*0.4);

}

function puppetBlockInteraction(hand){
  if (handedness === "Left"){
  leftThumbTipX = hand.thumb_tip.x;
  leftThumbTipY = hand.thumb_tip.y;
   fill(121,12,1);
  ellipse(leftThumbTipX, leftThumbTipY, 100, 100);
  }

  if (handedness === "Right"){
  rightThumbTipX = hand.thumb_tip.x;
  rightThumbTipY = hand.thumb_tip.y;
  fill(11,162,20);
  ellipse(rightThumbTipX, rightThumbTipY, 100, 100);
  
  }
  
 // if (rightThumbTipX === leftThumbTipX && rightThumbTipY === leftThumbTipY){
  //  fill(200,10,10);
  //  ellipse(rightThumbTipX, rightThumbTipY, 100, 100);
 // }
  
}

function keyPressed() {
  if (key === 'b') {
//    Background1active = true;
    ellipse(100,100,100,100);
  }
}

function Background1(){
  if (Background1active = true){
  fill(255);
  rectMode(CENTER);
  rect(640,480,1280,960);
  }
  
}

function HealthBars() {
  fill(209, 48, 48);
  rect(20, 10, 5*rightHandHealth, 50);
  fill(48, 96, 209);
  rect(660, 10, 5*leftHandHealth, 50);

  if (rightHandHealth <= 1){
    rightheadanim = rightheadanim - 3;
  }
  if (leftHandHealth <= 1){
    leftheadanim = leftheadanim - 3;
  }
}

function HitBox () {
  let middleFingerDipX = hand.middle_finger_dip.x;
  let middleFingerDipY = hand.middle_finger_dip.y;
  
  if (handedness === "Right"){
  var rBoxX = middleFingerDipX;
  var rBoxY = middleFingerDipY;
  var rBoxW = 15;
  var rBoxH = 13;
  }
}



  /// for boxing game, you could add a knockback system where once hit, a variable is set to 1 which pushes all of the puppets parts to the edge of the screen before resetting.




// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
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