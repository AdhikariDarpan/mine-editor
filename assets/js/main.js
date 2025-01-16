const worker = new Worker("./assets/js/worker.js");
export let spellObj = {};
export let dictionaryObj = {};
let isTrieReady = false;
let lastUpdatedTime = Date.now();
let timeoutId;
let wordTracker;
worker.onmessage = function (e) {
  const { type, exists, senses, progress, word } = e.data;

  if (type === "progress") {
    createProgressbar(100, progress.toFixed(2));
  }

  if (type === "insertComplete") {
    isTrieReady = true;
    console.log(
      "%cNepali Spell Checker is Ready to Use! \nhttps://darpanadhikari.com.np",
      "font-size: 40px; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.4); background: linear-gradient(to right, blue, purple); padding: 10px; border-radius: 10px;"
    );
  }

  if (type === "searchResult") {
    const { exists, word } = event.data;
    if (exists.length > 0) {
      if (!spellObj.hasOwnProperty(word)) {
        spellObj[word] = exists;
      }
    }
  }

  if (type === "sensesResult") {
    const { senses, word } = event.data;
    const result =
      Array.isArray(senses) && senses.length > 0 ? senses.join(", ") : false;

    if (result) {
      dictionaryObj[word] = senses;
    }
  }
  if (type === "wordFinished") {
    if (!wordTracker) {
      wordTracker = document.createElement("div");
      wordTracker.style.position = "fixed";
      wordTracker.style.bottom = "0";
      wordTracker.style.left = "10px";
      wordTracker.style.backgroundColor = "#a3a1a1";
      wordTracker.style.padding = "5px";
      wordTracker.style.color = "#fff";
      wordTracker.style.borderRadius = "5px";
      wordTracker.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.1)";
      document.body.appendChild(wordTracker);
    }
    wordTracker.textContent = "जाँचगर्दै: "+ word;
    clearTimeout(timeoutId);
    lastUpdatedTime = Date.now();
    timeoutId = setTimeout(() => {
      wordTracker.style.background = "green";
      wordTracker.textContent = "सकियो";
      setTimeout(()=>{
        wordTracker.remove();
        wordTracker = null;
      },200)
    }, 5000);
  }
};
fetch("./assets/js/data.json")
  .then((response) => response.json())
  .then((data) => {
    worker.postMessage({ type: "initialize", data, modifiers });
  })
  .catch((err) => alertMessage("Failed to load data:", err));

const modifiers = [
  "ा",
  "ि",
  "ी",
  "ु",
  "ू",
  "े",
  "ै",
  "ो",
  "ौ",
  "ं",
  "ः",
  "ृ",
  "ॄ",
  "ॢ",
  "ॣ",
  "ँ",
  "्",
  "अ",
  "आ",
  "उ",
  "र्",
  "ऊ",
  "ए",
  "इ",
  "ई",
  "्ध",
];
export async function checkWord(word) {
  if (!isTrieReady) {
    alertMessage("We are not ready yet! Wait for a second please");
    return;
  }
  word = removeSymbols(word);
  worker.postMessage({ type: "search", word, modifiers: modifiers });
}
export async function getWordSenses(word) {
  if (!isTrieReady) {
    alertMessage("We are not ready yet! Wait for a second please");
    return;
  }
  word = removeSymbols(word);
  worker.postMessage({ type: "getSenses", word });
}
function removeSymbols(input) {
  return input.replace(/[^\u0900-\u097F\u0041-\u005A\u0061-\u007A0-9]/g, "");
}
// -------------------------------------------------------------
let progressBarContainer, popup, progress;
function createProgressbar(totalProgress, currentProgress) {
  if (!progressBarContainer) {
    progressBarContainer = document.createElement("div");
    progressBarContainer.style.position = "fixed";
    progressBarContainer.style.left = "50%";
    progressBarContainer.style.top = "50%";
    progressBarContainer.style.transform = "translate(-50%,-50%)";
    progressBarContainer.style.width = "150px";
    progressBarContainer.style.height = "18px";
    progressBarContainer.style.backgroundColor = "#f3f3f3";
    progressBarContainer.style.border = "1px solid #ddd";
    progressBarContainer.style.borderRadius = "10px";
    progressBarContainer.style.overflow = "hidden";
    progressBarContainer.style.margin = "80px auto";
    progressBarContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    progressBarContainer.style.zIndex = "999999";
    document.body.appendChild(progressBarContainer);
    progress = document.createElement("div");
    progress.style.width = "0%";
    progress.style.height = "100%";
    progress.style.background = "linear-gradient(90deg, #ff7e5f, #feb47b)";
    progress.style.borderRadius = "10px";
    progress.style.transition = "width 0.5s ease";
    progressBarContainer.appendChild(progress);
    popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.top = "0";
    popup.style.left = "5px";
    popup.style.color = "#fff";
    popup.style.fontSize = "12px";
    popup.style.fontWeight = "bold";
    popup.style.zIndex = "10";
    popup.style.whiteSpace = "nowrap";
    popup.style.transition = "opacity 0.3s ease";
    progressBarContainer.appendChild(popup);
  }
  progress.style.width = `${(currentProgress / totalProgress) * 100}%`;
  const loadingText = `लोड हुँदैछ: ${Math.min(
    currentProgress,
    totalProgress
  )}%`;
  popup.innerText = loadingText;
  popup.style.opacity = "1";
  if (currentProgress >= totalProgress) {
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => {
        progressBarContainer.remove();
      }, 300);
    }, 500);
  }
}
function alertMessage(text) {
  if (text == "") {
    return;
  }
  const warningDiv = document.createElement("div");
  warningDiv.id = "warningDiv";
  warningDiv.textContent = text ? text : "";
  warningDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: max-content;
    background-color: #ffcc00;
    color: #000;
    text-align: center;
    padding: 10px;
    font-size: 16px;
    z-index: 1000;
    border: 1px solid #000;
    border-radius: 5px;
  `;
  document.body.appendChild(warningDiv);
  setTimeout(() => {
    warningDiv.remove();
  }, 5000);
}
