flock.init()


var synth = flock.synth({
	synthDef:{
		ugen: "flock.ugen.freeverb",
		mix: 0.5,
		room: 0.75,
		damp: 0.9,
		source: {
			ugen : "flock.ugen.dust",
			id: "dusty",
			density: 50,
			mul: 0.25
		}
	}
});

var kick = flock.synth({
    synthDef: {
        ugen: "flock.ugen.sinOsc",
	id: "kicky",
        freq: 200,
        mul: {
            ugen: "flock.ugen.envGen",
            envelope: {
                type: "flock.envelope.adsr",
		attack: 0.01,
                decay: 0.5,
                sustain: 0,
                release: 0,
            },
            mul: 0.25
        }
    }
});


function setup() {
    var canvas = createCanvas(300,300);
	synth.play();
	kick.play();
}

function draw() {
  background(0);
  fill(255);
  ellipse(mouseX, mouseY, 10, 10);
  synth.set("dusty.density", mouseX);
  synth.set("dusty.mul", 1 - (mouseY/height));
  kick.set("kicky.freq", mouseY + 100);
}

function mousePressed(){
    kick.set("kicky.mul.gate", 1);
}

function mouseReleased(){
    kick.set("kicky.mul.gate", 0);
}
