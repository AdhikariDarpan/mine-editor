import { speechToText } from "https://unpkg.com/speech-into-text@latest/index.js";

const voiceTyping = document.getElementById("voiceTyping");
let isClicked = false;
voiceTyping.addEventListener("click", (e) => {
  if(isClicked){
    document.getElementById('startVoiceTyping').textContent = "Start";
    isClicked = false;
    hideDialogueBox();
    return;
  }
  e.stopPropagation();
  e.preventDefault();
  let content = `
  <div class="text-content">Voice Typing Language Selection</div>
  <div style="display:flex; align-items:center;">
    <label for="selectLang">Choose Your Language:</label>
    <select id="selectLang"></select>
  </div>
  <div class="btns">
    <button id="startVoiceTyping">Start</button>
  </div>`;
  showDialog(content); 
  speechToText({
    outPut:'#text-field',
    startBtn:'#startVoiceTyping',
    langSelection:'#selectLang',
    stopBtn:'#voiceTyping',
    recIndicator:"#voiceTyping",
    });
    document.getElementById('startVoiceTyping')?.addEventListener('click',(e)=>{
      e.preventDefault();
      if(!isClicked){
        document.getElementById('startVoiceTyping').textContent = "Stop";
        isClicked = true;
        hideDialogueBox();
      }
    });
  });