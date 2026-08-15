// --- 1. Element Selectors ---
const video = document.querySelector('.vid-container video');
const playPauseBtn = document.getElementById('play-pause');
const playIcon = playPauseBtn.querySelector('i');
const progressBar = document.getElementById('range');
const currentTimeDisplay = document.getElementById('time');
const durationDisplay = document.getElementById('duration'); // Targets your new duration span

// --- 2. Helper Function: Format Time ---
// Converts seconds (e.g., 95) into clean timestamp strings (e.g., "1:35")
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ===========================
// PHASE 1: PLAY & PAUSE LOGIC
// ===========================

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
  } else {
    video.pause();
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
  }
  
}

// Triggers playback when clicking the button OR clicking directly on the video screen
playPauseBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

//controls setup
video.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(video.duration);
  progressBar.min = 0;
  durationDisplay.innerText = formatTime(video.duration);
});

//ui update on timeupate 
video.addEventListener('timeupdate', () => {
  progressBar.value = parseFloat(video.currentTime);
  currentTimeDisplay.textContent = formatTime(video.currentTime);
});

//progressBar interactivity
// Listens for manual user adjustments on the slider (Scrubbing)
progressBar.addEventListener('input', (e) => {
  // 1. Force the slider value from a string into a floating-point number
  const targetTime = parseFloat(e.target.value);
  
  // 2. Only update if the number is valid and within the video's bounds
  if (!isNaN(targetTime) && targetTime <= video.duration) {
    video.currentTime = targetTime;
  }
  
  // 3. Keep the visual time display perfectly synced while dragging
  currentTimeDisplay.textContent = formatTime(targetTime);
});

// ==========================================
// PHASE 3: VOLUME & FULLSCREEN LOGIC
// ==========================================

// --- Element Selectors ---
const muteBtn = document.getElementById('mute-btn');
const volumeIcon = muteBtn.querySelector('i');
const volumeSlider = document.getElementById('volume-slider');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const vidContainer = document.querySelector('.vid-container'); // Need the container for true fullscreen

// --- Volume Slider Control ---
volumeSlider.addEventListener('input', (e) => {
  const targetVolume = parseFloat(e.target.value);
  video.volume = targetVolume;

  // Unmute automatically if the user drags the slider up
  if (targetVolume > 0) {
    video.muted = false;
  }

  // Dynamically change the volume icon based on loudness
  if (targetVolume === 0) {
    volumeIcon.className = 'fas fa-volume-mute';
  } else if (targetVolume < 0.5) {
    volumeIcon.className = 'fas fa-volume-down';
  } else {
    volumeIcon.className = 'fas fa-volume-up';
  }
});

// --- Mute/Unmute Toggle Button ---
muteBtn.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false;
    volumeSlider.value = video.volume; // Restore slider position
    volumeIcon.className = video.volume < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
  } else {
    video.muted = true;
    volumeSlider.value = 0; // Drop slider to zero
    volumeIcon.className = 'fas fa-volume-mute';
  }
});

// --- Fullscreen Toggle ---
function toggleFullscreen() {
  // Check if the browser is already in fullscreen mode
  if (!document.fullscreenElement) {
    // We request fullscreen on the CONTAINER so our custom controls go full screen too!
    vidContainer.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// Optional: Double click the video screen to go fullscreen
video.addEventListener('dblclick', toggleFullscreen);

