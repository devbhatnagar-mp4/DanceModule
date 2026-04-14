(function () {

let isMirrored = false;
let loopInterval = null;
let loopStart = null;
let loopEnd = null;

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Always get fresh video reference
function getVideo() {
  return document.querySelector("video");
}

// Keep applying mirror (THIS is key)
setInterval(() => {
  const video = getVideo();
  if (!video) return;

  if (isMirrored) {
    video.style.transform = "scaleX(-1)";
  }
}, 500); // runs every 0.5 sec

// Listen to popup actions
chrome.runtime.onMessage.addListener((msg) => {
  const video = getVideo();

  if (!video) {
    alert("Play a video first");
    return;
  }

  switch (msg.action) {
    case "MIRROR":
      isMirrored = true;
      video.style.transform = "scaleX(-1)";
      break;

    case "OFF":
      isMirrored = false;
      video.style.transform = "scaleX(1)";
      clearInterval(loopInterval);
      break;

    case "LOOP":
      applyLoop(msg.start, msg.end);
      break;

    case "FAST":
      changeSpeed("up");
      break;

    case "SLOW":
      changeSpeed("down");
      break;
  }
});

// Loop logic
function applyLoop(startStr, endStr) {
  const video = getVideo();

  const start = parseTime(startStr);
  const end = parseTime(endStr);

  if (start == null || end == null || start >= end) {
    alert("Invalid time");
    return;
  }

  loopStart = start;
  loopEnd = end;

  clearInterval(loopInterval);

  loopInterval = setInterval(() => {
    if (video.currentTime >= loopEnd) {
      video.currentTime = loopStart;
    }
  }, 100);
}

// Time parser
function parseTime(str) {
  const parts = str.split(":").map(Number);

  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];

  return null;
}

// Speed control
function changeSpeed(direction) {
  const video = getVideo();

  let index = speeds.indexOf(video.playbackRate);
  if (index === -1) index = 3;

  if (direction === "up" && index < speeds.length - 1) index++;
  if (direction === "down" && index > 0) index--;

  video.playbackRate = speeds[index];
}

})();