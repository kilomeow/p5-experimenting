/*
Particle movement based on work from 
  The Nature of Code
    by Daniel Shiffman
  http://natureofcode.com
*/

/* now we can add visuals with our sound by uncommenting lines 29 and 47-50 */
let oscs = [];
let filts = [];
let freqs = [];
let envs = [];
let bubbles = [];
let notes = [50, 55, 57, 61, 62, 67, 69, 73, 78, 62, 67, 61, 73];
//let notes = [];
let num = notes.length;
let inc = 0;
let prevPitch;
let rev, dly, pan;

const width = 800
const height = 600


function setup() {
  createCanvas(width, height);
  background(200, 250, 230)

  blendMode(OVERLAY);
  
  // add reverb and delay
  rev = new p5.Reverb();
  rev.drywet(0.5);
  dly = new p5.Delay();
  dly.drywet(0.5);
  
  for (i = 0; i < num; i++) {
    oscs[i] = new p5.Oscillator('triangle');
    // must have full p5.sound library
    oscs[i].freq(midiToFreq(notes[i]));
    envs[i] = new p5.Envelope();
    oscs[i].amp(envs[i]);
    envs[i].setADSR(3, 0.5, 0.15, 3);
    envs[i].setRange(0.1);
    oscs[i].disconnect();
    oscs[i].start();
    filts[i] = new p5.Filter();
    filts[i].freq(midiToFreq(notes[i]*2));
    oscs[i].connect(filts[i]);
    let w = width*0.5 + random(-width*0.4, width*0.4);
    let h = height*0.5 + random(-height*0.2, height*0.2);
    bubbles[i] = new Bubble(w, h, 15, oscs[i]);
    rev.process(oscs[i], 5, 8);
    dly.process(oscs[i], 0.8, 0.8);
  }
}

function draw() {
  // modulate how often we look for a new note
  //let interval = map(sin(frameCount*0.01), -1, 1, 10, 20);
  const interval = 30
  if (frameCount % int(interval) == 0) {
    console.log(interval)
  // if (frameCount % 10 == 0) {
    let newPitch = random(notes);
    // if we get the same note twice, pick a new random note
    if(newPitch == prevPitch) newPitch = random(notes);
    let cycle = inc % notes.length;
    // print(cycle, newPitch);
    inc++;
    console.log(inc)
    //oscs[cycle].freq(midiToFreq(newPitch));
    envs[cycle].play();
    prevPitch = newPitch;
  }
  
  for(i of bubbles) {
    i.update();
    i.checkEdges();
    i.display();
    i.listen();
  }  
}

function mouseClicked() {

  const mx = mouseX/width
  const my = mouseY/height

  // sound
  const osc = new p5.Oscillator('triangle');

  osc.freq(midiToFreq(Math.floor(mx*50+50)));
  const env = new p5.Envelope();
  osc.amp(env);
  env.setADSR(3, 3*my, 0.15, 3);
  env.setRange(0.1);
  osc.disconnect();
  osc.start();
  filt = new p5.Filter();
  filt.freq(midiToFreq(notes[i]*2));
  oscs.connect(filts[i]);
  rev.process(oscs[i], 5, 8);
  dly.process(oscs[i], 0.8, 0.8);


  // bubble
  const bubble = new Bubble(mouseX, mouseY, 15, oscs[0]);
  bubbles.push(bubble)

  return false;
}

// can we choose to change the key after a certain interval or if we give some input?
// can the balls bounce off one another?
