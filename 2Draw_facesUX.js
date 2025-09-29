// ----=  Faces  =----
/* load images here */
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
}
let isMouthOpen = false;

function drawInteraction(faces, hands) {

  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face\
    //  console.log(face);
    if (showKeypoints) {
      drawPoints(face)
    }

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
    checkIfMouthOpen(face);
    if (isMouthOpen) {
      text("blah blah", face.keypoints[287].x, face.keypoints[287].y)
    }

    checkIsSmiling(face);
    if (isSmiling) {
      fill(20,200,20);
      ellipse(200,200,200,200);
    }

    checkIsFrowning(face);
    if (isFrowning) {
      fill(200,20,20);
      ellipse(200,200,200,200);
    }

   checkIsAngry(face);
   if (isAngry){
    fill(0);
    ellipse(500,500,200,200);
   }

   fill(50,67,210);
   drawHouse(face);

    /*
    Stop drawing on the face here
    */

  }
  
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
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
function drawX(X, Y) {
  push()

  strokeWeight(15)
  line(X - 20, Y - 20, X + 20, Y + 20)
  line(X - 20, Y + 20, X + 20, Y - 20)

  pop()
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
function drawX(X, Y) {
  push()

  strokeWeight(15)
  line(X - 20, Y - 20, X + 20, Y + 20)
  line(X - 20, Y + 20, X + 20, Y - 20)

  pop()
}

function drawHouse(face) {
  noseTipY = face.keypoints[4].y;
  noseTipX = face.keypoints[4].x;
  push();

  rect(noseTipX, noseTipY, 300,300); // turn into png of house for background details. Background will be displayed above the face with a variable being able to reveal face
  pop();
}

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