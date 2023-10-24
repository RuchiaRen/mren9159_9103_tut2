let rectangles = [];
let song;
let fft;
let lerpAmount;

function preload() {
  song = loadSound("audio/sample-visualisation.mp3");
}

function setup() {
  createCanvas(800, 800);
  fft = new p5.FFT(0.8, 16);

  let angle = TWO_PI / 24; // Distribute rectangles around a circle.
  for (let i = 0; i < 24; i++) {
    let x = width / 2 + 300 * cos(angle * i);
    let y = height / 2 + 300 * sin(angle * i);
    let colour = color(random(255), random(255), random(255));
    rectangles.push(new Rectangle(x, y, colour));
  }
  song.connect(fft);
}

function draw() {
  if (getAudioContext().state !== "running") {
    background(0);
    fill(255);
    textSize(24); // Make the instruction text bigger
    textAlign(CENTER, CENTER); // Center the instruction text
    text("Tap here to start sound playback", width / 2, height / 2);
    return;
  }

  background(255, 180, 180);
  let spectrum = fft.analyze();
  lerpAmount = map(mouseX, 0, width, 0, 1);

  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].display(spectrum[i]);
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    background(255, 0, 0);
  } else {
    song.play();
    background(0, 255, 0);
  }
}

class Rectangle {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.currentSize = 0;
    this.colour = colour;
    this.rotation = 0;
  }

  display(amp) {
    let targetSize = map(amp, 0, 255, 0, 100);
    this.currentSize = lerp(this.currentSize, targetSize, lerpAmount);
    this.rotation = lerp(this.rotation, targetSize / 100, lerpAmount);
    
    // Change color based on amplitude
    this.colour.setAlpha(amp); 

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    stroke(0);
    fill(this.colour);
    rect(0 - this.currentSize / 2, 0 - this.currentSize / 2, this.currentSize, this.currentSize);
    pop();
  }
}

