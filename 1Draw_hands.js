// ----=  HANDS  =----
/* load images here */
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
}

function drawInteraction(faces, hands) {
  // hands part
  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    //console.log(hand);
    if (showKeypoints) {
      drawConnections(hand)
    }

    // This is how to load in the x and y of a point on the hand.
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;
    let ringFingerTipX = hand.ring_finger_tip.x;
    let ringFingerTipY = hand.ring_finger_tip.y;
    let middleFingerDipX = hand.middle_finger_dip.x;
    let middleFingerDipY = hand.middle_finger_dip.y;
    let pinkyFingerMcpX = hand.pinky_finger_mcp.x;
    let thumbCmcX = hand.thumb_cmc.x;
    let distance = pinkyFingerMcpX - thumbCmcX; 

    //let pinkyFingerTipX = hand.pinky_finger_tip.x;
    //let pinkyFingerTipY = hand.pinky_finger_tip.y;


    /*
    Start drawing on the hands here
    */
    PuppetBody(hand);
    

    fill(255);
    ellipse(middleFingerDipX, middleFingerDipY, 200*(distance*0.01), 100*(distance*0.01));

    fill(0, 0, 0);
    ellipse(indexFingerTipX, indexFingerTipY, 30*(distance*0.01), 30*(distance*0.01));
    ellipse(ringFingerTipX, ringFingerTipY, 30*(distance*0.01), 30*(distance*0.01));

    PuppetArmThumb(hand);
    // drawPoints(hand)

    //fingerPuppet(indexFingerTipX, indexFingerTipY);
    //fingerPuppet(pinkyFingerTipX, pinkyFingerTipY);

    //chameleonHandPuppet(hand)

    
    /*
    Stop drawing on the hands here
    */
  }
  // You can make addtional elements here, but keep the hand drawing inside the for loop. 
  //------------------------------------------------------
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

let shoulderY = (thumbCmcY +  indexFingerMcpY)*0.5;

  strokeWeight(10);
  line(thumbCmcX, shoulderY, thumbMcpX, thumbMcpY);
  line(thumbMcpX, thumbMcpY, thumbIpX, thumbIpY);
  line(thumbIpX, thumbIpY, thumbTipX, thumbTipY);
}



function fingerPuppet(x, y) {
  fill(255, 38, 219) // pink
  ellipse(x, y, 100, 20)
  ellipse(x, y, 20, 100)

  fill(255, 252, 48) // yellow
  ellipse(x, y, 20) // draw center 

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

function chameleonHandPuppet(hand) {
  // Find the index finger tip and thumb tip
  // let finger = hand.index_finger_tip;

  let finger = hand.middle_finger_tip; // this finger now contains the x and y infomation! you can access it by using finger.x 
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

  let indexFingerTipX = hand.index_finger_tip.x;
  let indexFingerTipY = hand.index_finger_tip.y;
  fill(0)
  circle(indexFingerTipX, indexFingerTipY, 20);

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


// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {
  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 10);
  }
  pop()

}