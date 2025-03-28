const audioFile = "/Mohager-Project/src/audio/good-night.mp3"

const audio = new Audio(audioFile)
const audioContext = new AudioContext();
const anal = audioContext.createAnalyser();
anal.fftSize = 256;

const analyserBufferLength = anal.frequencyBinCount;
const dataArray = new Uint8Array(analyserBufferLength);

const source = audioContext.createMediaElementSource(audio);
source.connect(anal);
audio.play();
setTimeout(() => anal.getByteFrequencyData(dataArray), 8000)