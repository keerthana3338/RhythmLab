// Preload sounds for smoother experience
const soundFiles = {
  w: "sounds/crash.mp3",
  a: "sounds/kick-bass.mp3",
  s: "sounds/snare.mp3",
  d: "sounds/tom-1.mp3",
  j: "sounds/tom-2.mp3",
  k: "sounds/tom-3.mp3",
  l: "sounds/tom-4.mp3"
};

const sounds = {};
for (let key in soundFiles) {
  sounds[key] = new Audio(soundFiles[key]);
}

// Attach click and key listeners
document.querySelectorAll(".drum").forEach(button => {
  button.addEventListener("click", () => handleInput(button.innerHTML));
  button.addEventListener("touchstart", () => handleInput(button.innerHTML));
});

document.addEventListener("keydown", event => handleInput(event.key));

// Handle input (key or button)
function handleInput(key) {
  if (sounds[key]) {
    playSound(key);
    buttonAnimation(key);
    recordHit(key);
  } else {
    wrongKeyEffect();
  }
}

// Play sound
function playSound(key) {
  const audio = sounds[key].cloneNode(); // clone so multiple can play at once
  audio.play();
}

// Animate button
function buttonAnimation(currentKey) {
  const activeButton = document.querySelector("." + currentKey);
  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(() => activeButton.classList.remove("pressed"), 100);
  }
}

// Wrong key effect
function wrongKeyEffect() {
  document.body.classList.add("game-over");
  setTimeout(() => document.body.classList.remove("game-over"), 200);
}

// ------------------
// 🎵 Recording Feature
// ------------------
let isRecording = false;
let recordStartTime = 0;
let recordedSequence = [];

const recordBtn = document.getElementById("record-btn");
const playbackBtn = document.getElementById("playback-btn");

recordBtn.addEventListener("click", toggleRecording);
playbackBtn.addEventListener("click", playRecording);

function toggleRecording() {
  if (!isRecording) {
    // Start recording
    isRecording = true;
    recordedSequence = [];
    recordStartTime = Date.now();
    recordBtn.textContent = "⏹ Stop";
    playbackBtn.disabled = true;
  } else {
    // Stop recording
    isRecording = false;
    recordBtn.textContent = "⏺ Record";
    playbackBtn.disabled = recordedSequence.length === 0;
  }
}

function recordHit(key) {
  if (isRecording) {
    recordedSequence.push({
      key,
      time: Date.now() - recordStartTime
    });
  }
}

function playRecording() {
  if (recordedSequence.length === 0) return;

  recordedSequence.forEach(hit => {
    setTimeout(() => {
      playSound(hit.key);
      buttonAnimation(hit.key);
    }, hit.time);
  });
}
