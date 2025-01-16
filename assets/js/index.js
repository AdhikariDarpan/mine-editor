import { spellObj, dictionaryObj, checkWord, getWordSenses } from "./main.js";
  const editor = document.querySelector("#text-field");
  const checkBtnEl = document.querySelector("#check-np-spell");
  const dictBtnEl = document.querySelector("#nepaliDict");
  const contextStyle = document.createElement("style");
  const contextStyleUl = `.context-menu {
    display: none;
    position: fixed;
    background: #f0f0f0;
    border: 1px solid #ccc;
    padding: 5px 0;
    min-width: 120px;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
    border-radius: 5px;
    list-style: none;
    z-index: 10;
    width: 140px;
  }
  .context-menu li {
    cursor: pointer;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    font-family: 'Times New Roman', Times, serif;
    line-height: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
  }
  .context-menu li:hover {
    background-color: #f0f0f0;
  }
  .dictionaryPopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .dictionaryPopup-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: popup-show 0.3s ease-out;
    position: relative;
  }
  .dictionaryPopup-close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 18px;
    cursor: pointer;
  }
  #meaning-word-title {
    margin-bottom: 10px;
    font-size: 22px;
    color: #333;
  }
  .meaning-search-box {
    display: flex;
    gap: 5px;
    margin-bottom: 20px;
  }
  #meaning-search-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  #meaning-search-btn {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  #meaning-search-btn:hover {
    background-color: #0056b3;
  }
  #meaning-word-meanings {
    list-style-type: square
    padding: 0;
    margin: 0;
  }
  #meaning-word-meanings li {
    text-align: left;
    margin: 5px 0;
    font-size: 16px;
    color: #555;
  }
  @keyframes popup-show {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  span[spell-wrong] {
    text-decoration: underline wavy red;
  }
;`;
  contextStyle.innerHTML = contextStyleUl;
  document.head.appendChild(contextStyle);
  let checkedWords = new Set();
  editor.addEventListener("input", (e) => {
    let words = editor.innerText.normalize("NFC").split(/\s+/);
    words.forEach((wrd) => {
      let trimmedWord = wrd.trim();
      if (trimmedWord !== "" && !checkedWords.has(trimmedWord)) {
        if (/^[^a-zA-Z0-9]+$/.test(trimmedWord)) {
          const removeSym = removeSymbols(trimmedWord);
          checkedWords.add(removeSym);
          checkWord(removeSym.normalize("NFC"));
          getWordSenses(removeSym.normalize("NFC"));
        }
      }
    });
  });
  const removeSymbols = (paragraph) => {
    const cleanedParagraph = paragraph.replace(/[^\u0900-\u097F\s]+/g, ''); 
    return cleanedParagraph;
};
  // ----------asign wrong data
  function validateWord() {
    if (!spellObj || !dictionaryObj) {
      console.error("spellObj or dictionaryObj is not loaded.");
      return;
    }
  
    function removeSymbols(input) {
      return input.replace(/[^\u0900-\u097F\u0041-\u005A\u0061-\u007A0-9]/g, "");
    }
  
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.textContent
          .normalize("NFC")
          .replace(/\u00A0/g, " ");
        const words = textContent.split(/\s+/);
        const fragments = document.createDocumentFragment();
  
        words.forEach((word, index) => {
          const cleanedWord = removeSymbols(word);
          if (cleanedWord && spellObj[cleanedWord]) {
            const span = document.createElement("span");
            span.setAttribute("spell-wrong", "");
            span.textContent = word;
            fragments.appendChild(span);
          } else {
            fragments.appendChild(document.createTextNode(word));
          }
          if (index < words.length - 1) {
            fragments.appendChild(document.createTextNode(" "));
          }
        });
  
        node.replaceWith(fragments);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  
    processNode(editor);
  
    document.querySelectorAll("span[spell-wrong]").forEach((span) => {
      const words = span.textContent.trim().normalize("NFC").split(/\s+/);
      if (words.length > 1) {
        span.textContent = words[0];
        span.insertAdjacentText("afterend", " " + words.slice(1).join(" "));
      }
    });
  }
  
  checkBtnEl.addEventListener("click", () => {
    if (spellObj && dictionaryObj) {
      validateWord();
    }
  });

  const contextMenu = document.createElement("ul");
  contextMenu.className = "context-menu";
  document.body.appendChild(contextMenu);
  editor.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextMenu.innerHTML = "";
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (range && editor.textContent.trim() !== "") {
      range.expand("word");
      const word = range.toString().trim().normalize("NFC");
      if (word && !word.includes(" ")) {
        if (spellObj[word]) {
          const suggestions = spellObj[word.normalize("NFC")];
          if (suggestions.length > 0) {
            let selectedIndex = 0;
            suggestions.forEach((option, index) => {
              const menuItem = document.createElement("li");
              menuItem.textContent = option.normalize("NFC");
              menuItem.style.cursor = "pointer";
              menuItem.style.padding = "3px 5px";
              const handleMenuItemClick = () => {
                const parentSpan = range.startContainer.parentNode;
                if (
                  parentSpan.tagName === "SPAN" &&
                  parentSpan.hasAttribute("spell-wrong")
                ) {
                  const textNode = document.createTextNode(option);
                  parentSpan.replaceWith(textNode);
                } else {
                  range.deleteContents();
                  range.insertNode(document.createTextNode(option));
                }
                contextMenu.style.display = "none";
              };
              menuItem.addEventListener("click", handleMenuItemClick);
              menuItem.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                handleMenuItemClick();
              });
              if (index === 0) {
                menuItem.setAttribute("tabindex", "0");
                menuItem.focus();
              }
              contextMenu.appendChild(menuItem);
            });
            contextMenu.addEventListener("keydown", (event) => {
              const menuItems = Array.from(contextMenu.querySelectorAll("li"));
              if (event.key === "ArrowDown") {
                selectedIndex = (selectedIndex + 1) % menuItems.length;
              } else if (event.key === "ArrowUp") {
                selectedIndex =
                  (selectedIndex - 1 + menuItems.length) % menuItems.length;
              } else if (event.key === "Enter") {
                const selectedItem = menuItems[selectedIndex];
                const selectedOption = selectedItem.textContent;
                range.deleteContents();
                range.insertNode(document.createTextNode(selectedOption));
                contextMenu.style.display = "none";
              }
              menuItems.forEach((item, index) => {
                item.style.backgroundColor =
                  index === selectedIndex ? "lightblue" : "";
              });
              menuItems[selectedIndex].scrollIntoView({ block: "nearest" });
            });
          }
        } else if (dictionaryObj[word]) {
          const menuItem = document.createElement("li");
          menuItem.textContent = "अर्थ जान्नुहोस्";
          menuItem.style.cursor = "pointer";
          menuItem.style.padding = "3px 5px";
          menuItem.addEventListener("click", () => {
            createMeaningListAndDisplay(word);
          });
          contextMenu.appendChild(menuItem);
        } else {
          contextMenu.style.display = "none";
        }
        const menuHeight = contextMenu.offsetHeight || 100;
        const screenHeight = window.innerHeight;
        if (e.clientY + menuHeight > screenHeight) {
          contextMenu.style.top = `${e.clientY - menuHeight}px`;
        } else {
          contextMenu.style.top = `${e.clientY}px`;
        }
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = "block";
        contextMenu.setAttribute("tabindex", "0");
        contextMenu.focus();
      }
      if (contextMenu.querySelectorAll("li").length < 1) {
        contextMenu.style.display = "none";
      }
    }
  });

  const dictionaryPopupHTML = `
  <div class="dictionaryPopup">
    <div class="dictionaryPopup-content">
      <span class="dictionaryPopup-close-btn">&times;</span>
      <h2 id="meaning-word-title">वर्णमाला</h2>

      <div class="meaning-search-box">
        <input type="text" id="meaning-search-input" placeholder="Search for a word..." />
        <button id="meaning-search-btn">Search</button>
      </div>
      <ul id="meaning-word-meanings"></ul>
    </div>
  </div>
`;
document.body.insertAdjacentHTML("beforeend", dictionaryPopupHTML);
const dictFieldEl = document.querySelector(".dictionaryPopup-content");
  function createMeaningListAndDisplay(key) {
    const meanings = dictionaryObj[key];
    const meaningsList = document.getElementById("meaning-word-meanings");
    meaningsList.innerHTML = "";
    if (meanings) {
      meanings.forEach((meaning) => {
        const li = document.createElement("li");
        li.textContent = meaning;
        meaningsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Empty.";
      meaningsList.appendChild(li);
    }
    document.getElementById("meaning-search-input").value = key;
    document.querySelector(".dictionaryPopup").style.display = "flex";
  }
  dictBtnEl?.addEventListener("click", (e) => {
    createMeaningListAndDisplay("");
  });
  document
    .getElementById("meaning-search-btn")
    .addEventListener("click", function () {
      const searchInput = document
        .getElementById("meaning-search-input")
        .value.trim();
      getWordSenses(searchInput);
      setTimeout(() => {
        createMeaningListAndDisplay(searchInput);
      }, 300);
    });
  document
    .querySelector(".dictionaryPopup-close-btn")
    .addEventListener("click", () => {
      document.querySelector(".dictionaryPopup").style.display = "none";
    });
  editor.addEventListener("copy", function (e) {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    let copyContent = container.innerHTML.replace(
      /<span[^>]*(spell-wrong)[^>]*>(.*?)<\/span>/g,
      "$2"
    );
    e.clipboardData.setData("text/html", copyContent);
    e.clipboardData.setData("text/plain", container.textContent.trim());
  });
  document.addEventListener("click", (e) => {
    contextMenu.style.display = "none";
    if (
      !dictFieldEl.contains(e.target) &&
      !dictBtnEl.contains(e.target) &&
      !contextMenu.contains(e.target)
    ) {
      document.querySelector(".dictionaryPopup").style.display = "none";
    }
  });