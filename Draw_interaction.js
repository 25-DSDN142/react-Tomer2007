let Background1active = false;
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
let distance;
let d;

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

function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
  punchImpactImage = loadImage('/images/PunchImpact.gif');
  headImpactImage = loadImage('/images/Head_hit.gif');
}

function drawInteraction(faces, hands) {
  //Background1()
  
  // ----=  HANDS PART  =----
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    
    handedness = hand.handedness;

    // Get hand keypoints
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
    PuppetBody(hand);
    
    push();
    translate(middleFingerDipX, middleFingerDipY);
    rotate(RotationAmount);
    fill(255);
    if (handedness === "Left"){
    ellipse(leftheadanim, leftheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }
    if (handedness === "Right"){
    ellipse(rightheadanim, rightheadanim, 100*(distance*0.01), 200*(distance*0.01));
    }
    pop();

    fill(0, 0, 0);
    ellipse(indexFingerTipX, indexFingerTipY, (distance*0.2), (distance*0.2));
    ellipse(ringFingerTipX, ringFingerTipY, (distance*0.2), (distance*0.2));

    PuppetArmThumb(hand);
    PuppetArmPinky(hand);
    puppetBlockInteraction(hand);
   
    HitBox(hand);
    
    // Draw facial expressions on puppet (if face detected)
    if (faces.length > 0) {
      if (isFrowning) {
        frowningPuppet(hand);
      }
      if (isSmiling) {
        smilingPuppet(hand);
      }
    }
  }
  
  HealthBars(rightHandHealth, leftHandHealth);

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

    // Display mouth text if open
    if (isMouthOpen && face.keypoints[287]) {
      push();
      fill(0);
      textSize(16);
      text("blah blah", face.keypoints[287].x, face.keypoints[287].y);
      pop();
    }

    // Visual feedback for angry
    if (isAngry) {
      push();
      fill(255, 0, 0, 100);
      ellipse(500, 500, 200, 200);
      pop();
    }

    // Draw face features if they exist
    if (face.leftEye) drawPoints(face.leftEye);
    if (face.leftEyebrow) drawPoints(face.leftEyebrow);
    if (face.lips) drawPoints(face.lips);
    if (face.rightEye) drawPoints(face.rightEye);
    if (face.rightEyebrow) drawPoints(face.rightEyebrow);
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

function pinchCircle(hand) {
  let finger = hand.index_finger_tip;
  let thumb = hand.thumb_tip;

  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);
}

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

  let shoulderY = (thumbCmcY + indexFingerMcpY) * 0.5;
  let shoulderX = (thumbCmcX + indexFingerMcpX) * 0.5;

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

  let shoulderY = (pinkyFingerMcpY + ringFingerMcpY) * 0.5;
  let shoulderX = (pinkyFingerMcpX + ringFingerMcpX) * 0.5;

  strokeWeight(10);
  line(shoulderX, shoulderY, pinkyFingerPipX, pinkyFingerPipY);
  line(pinkyFingerPipX, pinkyFingerPipY, pinkyFingerDipX, pinkyFingerDipY);
  line(pinkyFingerDipX, pinkyFingerDipY, pinkyFingerTipX, pinkyFingerTipY);
  fill(255);
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

function drawHouse(face) {
  if (!face.keypoints || face.keypoints.length < 5) return;
  
  noseTipY = face.keypoints[4].y;
  noseTipX = face.keypoints[4].x;
  push();
  rect(noseTipX, noseTipY, 300, 300);
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
  curve(indexFingerDipX, indexFingerDipY-distance*0.4, indexFingerTipX, indexFingerTipY+distance*0.4, ringFingerTipX, ringFingerTipY+distance*0.4, ringFingerDipX, ringFingerDipY-distance*0.4);
  pop();
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
    //ellipse(leftThumbTipX, leftThumbTipY, distance, distance);
      console.log("BANG");
  }

  if (leftPinkyTipX < rightPinkyTipX+0.4*distance && leftPinkyTipY < rightPinkyTipY+0.4*distance && leftPinkyTipX > rightPinkyTipX-0.4*distance && leftPinkyTipY > rightPinkyTipY-0.4*distance){
    image(punchImpactImage, leftPinkyTipX-distance*0.5, leftPinkyTipY-distance*0.5, distance, distance);
  }

 if (leftThumbTipX < rightPinkyTipX+0.4*distance && leftThumbTipY < rightPinkyTipY+0.4*distance && leftThumbTipX > rightPinkyTipX-0.4*distance && leftThumbTipY > rightPinkyTipY-0.4*distance){
    fill(200,200,10);
    image(punchImpactImage, leftThumbTipX-distance*0.5, leftThumbTipY-distance*0.5, distance, distance);
    //ellipse(leftThumbTipX, leftThumbTipY, distance, distance);
      console.log("BANG");
  }

  if (leftPinkyTipX < rightThumbTipX+0.4*distance && leftPinkyTipY < rightThumbTipY+0.4*distance && leftPinkyTipX > rightThumbTipX-0.4*distance && leftPinkyTipY > rightThumbTipY-0.4*distance){
    image(punchImpactImage, rightThumbTipX-distance*0.5, rightThumbTipY-distance*0.5, distance, distance);
    //ellipse(leftThumbTipX, leftThumbTipY, distance, distance);
      console.log("BANG");
  }

  fill(11, 162, 20);
  ellipse(rightThumbTipX, rightThumbTipY, 10, 10);

  fill(121, 12, 1);
  ellipse(leftThumbTipX, leftThumbTipY, 10, 10);
}

function Background1() {
  if (Background1active === true) {
    fill(255);
    rectMode(CENTER);
    rect(640, 480, 1280, 960);
  }
}

function HealthBars(rightHandHealth, leftHandHealth) {
  push();
  fill(209, 48, 48);
  rect(20, 10, 5*rightHandHealth, 50);
  fill(48, 96, 209);
  rect(660, 10, 5*leftHandHealth, 50);
  pop();

  if (rightHandHealth < 1) {
    rightheadanim = rightheadanim + 5;
    rightHandHealth = 0;
  }
  if (leftHandHealth < 1) {
    leftheadanim = leftheadanim - 5;
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

  if (leftPinkyTipX < rightHeadX+0.8*distance && leftPinkyTipY < rightHeadY+0.3*distance && leftPinkyTipX > rightHeadX-0.8*distance && leftPinkyTipY > rightHeadY-0.3*distance){
    image(headImpactImage, leftPinkyTipX-distance*0.8, leftPinkyTipY-distance*0.8, distance, distance);
    rightHandHealth = rightHandHealth - 0.1;
  }
  if (leftThumbTipX < rightHeadX+0.8*distance && leftThumbTipY < rightHeadY+0.3*distance && leftThumbTipX > rightHeadX-0.8*distance && leftThumbTipY > rightHeadY-0.3*distance){
    image(headImpactImage, leftThumbTipX-distance*0.8, leftThumbTipY-distance*0.8, distance, distance);
    rightHandHealth = rightHandHealth - 0.1;
  }

  if (rightPinkyTipX < leftHeadX+0.8*distance && rightPinkyTipY < leftHeadY+0.3*distance && rightPinkyTipX > leftHeadX-0.8*distance && rightPinkyTipY > leftHeadY-0.3*distance){
    image(headImpactImage, rightPinkyTipX-distance*0.8, rightPinkyTipY-distance*0.8, distance, distance);
    leftHandHealth = leftHandHealth - 0.1;
  }
  if (rightThumbTipX < leftHeadX+0.8*distance && rightThumbTipY < leftHeadY+0.3*distance && rightThumbTipX > leftHeadX-0.8*distance && rightThumbTipY > leftHeadY-0.3*distance){
    image(headImpactImage, rightThumbTipX-distance*0.8, rightThumbTipY-distance*0.8, distance, distance);
    leftHandHealth = leftHandHealth - 0.1;
  }
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