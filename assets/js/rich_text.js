window.addEventListener('load', function() {
  const loadingDiv = document.getElementById('loading');
  loadingDiv.style.display = 'none';
});
const textField = document.querySelector("#text-field");
window.onload = function () {
  textField.focus();
};
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelectorAll(".nav-item").forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("show-submenu");
      }
    });
    this.classList.add("show-submenu");
  });
  document.addEventListener("click", function (e) {
    if (!item.contains(e.target)) {
      item.classList.remove("show-submenu");
    }
  });
  item.querySelectorAll(".submenu").forEach((submenu) => {
    submenu.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
  });
});

const searchTxt = document.getElementById("searchText"),
  undoBtn = document.getElementById("undoBtn"),
  redoBtn = document.getElementById("redoBtn"),
  printDoc = document.getElementById("printDoc"),
  fontDrop = document.getElementById("fontDrop"),
  zooIn = document.getElementById("zoomIn"),
  zoomOut = document.getElementById("zoomOut"),
  changeTextStyle = document.getElementById("changeTextStyle"),
  changeFontFamily = document.getElementById("changeFontFamily"),
  changeFontSize = document.getElementById("fontSize"),
  boldBtn = document.getElementById("boldBtn"),
  italicBtn = document.getElementById("italicBtn"),
  underlineBtn = document.getElementById("underlineBtn"),
  colorBtnEl = document.getElementById("textColorInput"),
  highlightBtnEl = document.getElementById("highlightColorInput"),
  Strikethrough = document.getElementById("Strikethrough"),
  SuperScript = document.getElementById("SuperScript"),
  SubScript = document.getElementById("SubScript"),
  capitalizeBtn = document.querySelectorAll("#capitalizeBtn li"),
  insertLink = document.getElementById("insertLink"),
  attachImage = document.getElementById("attachImage"),
  leftBtn = document.getElementById("leftBtn"),
  centerBtn = document.getElementById("centerBtn"),
  rightBtn = document.getElementById("rightBtn"),
  justifyBtn = document.getElementById("justifyBtn"),
  ordList = document.getElementById("ordList"),
  unordList = document.getElementById("unordList"),
  outdentBtn = document.getElementById("outdentBtn"),
  indentBtn = document.getElementById("indentBtn"),
  removeBtn = document.getElementById("removeBtn"),
  fullScrBtn = document.getElementById("fullScrBtn"),
  horizontalBtn = document.getElementById("horizontalBtn"),
  codeBtn = document.getElementById("codeBtn"),
  lineHeight = document.querySelectorAll("#lineHeight li"),
  cutBtn = document.getElementById("cutBtn"),
  copyBtn = document.getElementById("copyBtn"),
  pasteBtn = document.getElementById("pasteBtn"),
  pasteWtBtn = document.getElementById("pasteWtBtn"),
  emailSend = document.getElementById("emailSend"),
  deleteFile = document.getElementById("deleteFile"),
  selectAll = document.getElementById("selectAll"),
  countData = document.getElementById("countData"),
  newTab = document.getElementById("newTab"),
  newFile = document.getElementById("openFile"),
  dialogContainer = document.getElementById("dialogOverlay"),
  downloadBtn = document.getElementById("downloadBtn"),
  pageSetup = document.getElementById("pageSetup"),
  localSave = document.getElementById("localSave");

document.addEventListener("mousedown", function (event) {
  var isClickInside =
    textField.contains(event.target) || textField === event.target;
  var isInputOrSelect =
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "SELECT";

  if (!isClickInside && !isInputOrSelect) {
    event.preventDefault();
  }
});
searchTxt.addEventListener("click", (e) => {
  e.stopPropagation();
  findReplace.click();
});

// ----------------------------------------------------------------
document.querySelectorAll(".tooltip").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    btn.classList.toggle("active");
  });
});
cutBtn.addEventListener("click", (e) => {
  if (!preventCopy) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const selectedText = selection.toString();
      navigator.clipboard.writeText(selectedText).then(() => {
        const range = selection.getRangeAt(0);
        range.deleteContents();
      }).catch(err => console.error("Failed to cut text: ", err));
    }
  }
});
copyBtn.addEventListener("click", (e) => {
  if (!preventCopy) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const selectedText = selection.toString();
      navigator.clipboard.writeText(selectedText);
    }
  }
});
pasteBtn.addEventListener("click", (e) => {
  navigator.clipboard
    .read()
    .then((items) => {
      for (let item of items) {
        if (item.types.includes("text/html")) {
          item.getType("text/html").then((blob) => {
            blob.text().then((html) => {
              document.execCommand("insertHTML", false, html);
            });
          });
        } else if (item.types.includes("text/plain")) {
          item.getType("text/plain").then((blob) => {
            blob.text().then((text) => {
              document.execCommand("insertText", false, text);
            });
          });
        }
      }
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
});
pasteWtBtn.addEventListener("click", (e) => {
  navigator.clipboard
    .readText()
    .then((text) => {
      document.execCommand("insertText", false, text);
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
});
textField.addEventListener("paste", function (e) {
  e.preventDefault();
  let clipboardData =
    e.clipboardData.getData("text/html") ||
    e.clipboardData.getData("text/plain");
  if (!clipboardData) {
    return;
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = clipboardData;
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    currentNode.textContent = currentNode.textContent.normalize("NFC");
  }
  const elementsWithBackground = tempDiv.querySelectorAll(
    '[style*="background"]'
  );
  elementsWithBackground.forEach((el) => {
    el.style.background = "";
  });
  try {
    document.execCommand("insertHTML", false, tempDiv.innerHTML);
  } catch (error) {
    console.error("Error executing insertHTML:", error);
  }
});

// ----------------------------------------------------------------------------------
document.getElementById("insertTable").addEventListener("click", insertTable);
function insertTable() {
  let content = `
    <div class="dialog">
      <div class="text-content">Create Table</div>
      <div class="input-field">
        <label>Horizontal</label>
        <label>Vertical</label>
      </div>
      <div class="input-field">
        <input type="number" step="1" value="5" id="tblRows" style="--width:50px;;">
        <input type="number" step="1" value="5" id="tblCols" style="--width:50px;;">
      </div>
      <hr>
      <div class="input-field">
        <label>Table Width (%)</label>
        <input type="number" step="1" value="100" id="tblWidth" style="--width:50px;;">
      </div>
      <div class="input-field">
        <label>Include Header Row</label>
        <input type="checkbox" id="tblHeader" checked>
      </div>
      <div class="input-field">
        <label>Odd Row Color</label>
        <input type="color" list="popularColors" style="--width:50px;" value="#f0f0f0" id="tdColors">
      </div>
      <div class="input-field">
        <label>Table Caption</label>
        <textarea type="text" id="tblCaption" placeholder="Optional"></textarea>
      </div>
      <hr><hr>
      <div class="btns">
        <button onclick="createTable()">Create</button>
      </div>
    </div>
  `;
  showDialog(content);
}
let tableCount = 1;
function createTable() {
  var rows = document.getElementById("tblRows").value;
  var cols = document.getElementById("tblCols").value;
  var width = document.getElementById("tblWidth").value;
  var tdColor = document.getElementById("tdColors").value;
  var hasHeader = document.getElementById("tblHeader").checked;
  var caption = document.getElementById("tblCaption").value;
  let table = `<table border="1" id="tbl${tableCount}" class="customTbl" style="border-collapse: collapse; border: 1px solid #000; width: ${width}%; --td-back:${tdColor};">`;
  if (caption) {
    table += `<caption>${caption}</caption>`;
  }
  for (let i = 0; i < rows; i++) {
    table += "<tr>";
    for (let j = 0; j < cols; j++) {
      if (i === 0 && hasHeader) {
        table += `<th>&nbsp;</th>`;
      } else {
        table += `<td>&nbsp;</td>`;
      }
    }
    table += "</tr>";
  }
  table += "</table><br>";
  tableCount++;
  const editor = document.querySelector(".text-field");
  editor.focus();
  document.execCommand("insertHTML", false, table);
  const firstCell = document.querySelector(
    `#tbl${tableCount - 1} td:first-child`
  );
  if (firstCell) {
    firstCell.focus();
  }
  hideDialogueBox();
}
// ------------------------------------------------------------
let savedSelectionRange, savedSelectionNode;
document.getElementById("insertChart").addEventListener("click", () => {
  saveSelection();
  const content = `
    <div class="chart-form">
      <h3 class="text-content">Create Chart</h3>
      <div id="chartInfoFomr">
        <div class="input-field">
          <label>Width</label>
          <label>Height</label>
        </div>
        <div class="input-field">
          <input type="number" step="1" value="800" id="chartWidth" style="--width:50px;;">
          <input type="number" step="1" value="400" id="chartHeight" style="--width:50px;;">
        </div>
        <div class="input-field">
         <label>Label</label>
         <label>Value</label>
        </div>
        <div class="input-field">
          <input type="text" name="label[]" placeholder="Label" required>
          <input type="number" name="value[]" placeholder="Value" required>
        </div>
      </div>
      <button type="button" onclick="addChartInfoField()">Add More</button>
      <select id="chartType">
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="line">Line Chart</option>
      </select>
      <button type="button" onclick="generateChart()">Generate Chart</button>
    </div>
  `;
  showDialog(content);
});
function addChartInfoField() {
  const formFields = document.getElementById("chartInfoFomr");
  const newField = document.createElement("div");
  newField.classList.add("input-field");
  newField.innerHTML = `
    <input type="text" name="label[]" placeholder="Label" required>
    <input type="number" name="value[]" placeholder="Value" required>
  `;
  formFields.appendChild(newField);
}
function generateChart() {
  const formFields = document.getElementById("chartInfoFomr");
  const labels = Array.from(
    formFields.querySelectorAll("input[name='label[]']")
  );
  const values = Array.from(
    formFields.querySelectorAll("input[name='value[]']")
  );
  let chartWidth = parseInt(document.getElementById("chartWidth").value, 10);
  chartWidth = (chartWidth < 100) ? 800 : chartWidth;
  let chartHeight = parseInt(document.getElementById("chartHeight").value, 10);  
  chartHeight = (chartHeight < 100) ? 800 : chartHeight;
  const chartType = document.getElementById("chartType").value;
  let isValid = true;

  labels.forEach((input) => {
    if (input.value.trim() === "") {
      let alert = "Please fill out all label fields.";
      document.getElementById("alert-msg").textContent = alert;
      isValid = false;
      return;
    }
  });
  values.forEach((input) => {
    if (input.value.trim() === "" || isNaN(Number(input.value))) {
      let alert = "Please fill out all value fields with numbers.";
      document.getElementById("alert-msg").textContent = alert;
      isValid = false;
      return;
    }
  });
  if (chartType.trim() === "") {
    let alert = "Please select a chart type.";
    document.getElementById("alert-msg").textContent = alert;
    isValid = false;
  }
  if (!isValid) {
    return;
  }

  const labelValues = labels.map((input) => input.value);
  const valueNumbers = values.map((input) => Number(input.value));

  restoreSelection();
  const chartId = `chart-${Date.now()}`; // Always generate a new unique chart ID
  const canvasHTML = `<canvas id="${chartId}" width="${chartWidth}" height="${chartHeight}"></canvas>`;
  
  insertHTMLAtCursor(canvasHTML);  // Insert the new canvas into the document
  
  const ctx = document.getElementById(chartId).getContext("2d");
  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labelValues,
      datasets: [
        {
          label: "Values",
          data: valueNumbers,
          backgroundColor: labels.map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
          borderColor: "#333",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: chartType !== "bar" },
        tooltip: { enabled: true },
      },
      scales:
        chartType === "bar" || chartType === "line"
          ? {
              x: { beginAtZero: true },
              y: { beginAtZero: true },
            }
          : {},
    },
  });
}
function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    savedSelectionRange = sel.getRangeAt(0);
    savedSelectionNode = sel.anchorNode;
  }
}
function restoreSelection() {
  const sel = window.getSelection();
  sel.removeAllRanges();
  if (savedSelectionRange) {
    sel.addRange(savedSelectionRange);
  }
}
function insertHTMLAtCursor(html) {
  const range = savedSelectionRange;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const fragment = document.createDocumentFragment();
  Array.from(tempDiv.childNodes).forEach((node) => fragment.appendChild(node));
  range.deleteContents();
  range.insertNode(document.createElement("br"));
  range.insertNode(fragment);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  textField.focus();
}
function editChart(chartId) {
  const chartCanvas = document.getElementById(chartId);
  if (!chartCanvas) {
    return;
  }
  const chartInstance = Chart.getChart(chartId);
  if (!chartInstance) {
    let alert = "Chart instance not found!";
    document.getElementById("alert-msg").textContent = alert;
    return;
  }

  const existingLabels = chartInstance.data.labels;
  const existingValues = chartInstance.data.datasets[0].data;
  const existingType = chartInstance.config.type;
  const existingWidth = chartCanvas.width;
  const existingHeight = chartCanvas.height;

  const editFormContent = `
    <div class="chart-form">
      <h3>Edit Chart</h3>
      <div id="chartInfoFomr">
        <div class="input-field">
          <label>Width</label>
          <label>Height</label>
        </div>
        <div class="input-field">
          <input type="number" step="1" value="${existingWidth}" id="chartWidth" style="--width:50px;">
          <input type="number" step="1" value="${existingHeight}" id="chartHeight" style="--width:50px;">
        </div>
        ${existingLabels
          .map(
            (label, index) => `
          <div class="input-field">
            <input type="text" name="label[]" value="${label}" required>
            <input type="number" name="value[]" value="${existingValues[index]}" required>
          </div>
        `
          )
          .join("")}
      </div>
      <button type="button" onclick="addChartInfoField()">Add More</button>
      <select id="chartType">
        <option value="bar" ${existingType === "bar" ? "selected" : ""}>Bar Chart</option>
        <option value="pie" ${existingType === "pie" ? "selected" : ""}>Pie Chart</option>
        <option value="line" ${existingType === "line" ? "selected" : ""}>Line Chart</option>
      </select>
      <button type="button" onclick="updateChart('${chartId}')">Update Chart</button>
    </div>
  `;

  showDialog(editFormContent);
}

function updateChart(chartId) {
  const chartCanvas = document.getElementById(chartId);
  if (!chartCanvas) {
    return;
  }
  const chartInstance = Chart.getChart(chartId);
  if (!chartInstance) {
    return;
  }
  
  const chartWidth = parseInt(document.getElementById("chartWidth").value, 10);
  const chartHeight = parseInt(document.getElementById("chartHeight").value, 10);
  chartCanvas.width = chartWidth;
  chartCanvas.height = chartHeight;
  chartInstance.resize();  // Resize the chart to the new dimensions
}

function deleteChart(chartId) {
  document.getElementById(chartId).remove();
}
// --------------------------------------------------------------
document.getElementById("insertDrawing").addEventListener("click", () => {
  saveSelection();
  displayDrawingFiled();
  manageDrawing();
});
function displayDrawingFiled(drawingId = null) {
  let content = `
  <div class="controls">
      <button id="eraseAll">Erase All</button>
      <button id="undo">Undo</button>
      <button id="redo">Redo</button>
      <input type="color" id="colorPicker" list="popularColors" value="#000000" style="--width:50px;">
  </div>
  <canvas id="signatureCanvas" width="400" height="200" style="border: 1px solid #000; background: #fff; cursor: crosshair;"></canvas>
  <br>
  <button id="saveCanvas">Save</button>
  `;
  showDialog(content);
  if (drawingId) {
    loadCanvasFromImageURL(drawingId);
  }
}
function loadCanvasFromImageURL(drawingId) {
  const existingCanva = document.getElementById(drawingId);
  const signatureCanvas = document.getElementById("signatureCanvas");
  const ctx = signatureCanvas.getContext("2d");
  const img = new Image();
  img.src = existingCanva.src;
  img.onload = () => {
    ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    ctx.drawImage(img, 0, 0, signatureCanvas.width, signatureCanvas.height);
  };
  manageDrawing(existingCanva);
}
function manageDrawing(imageExist = null) {
  const signatureCanvas = document.getElementById("signatureCanvas");
  const ctx = signatureCanvas.getContext("2d");
  const saveCanvasButton = document.getElementById("saveCanvas");
  const eraseAllButton = document.getElementById("eraseAll");
  const undoButton = document.getElementById("undo");
  const redoButton = document.getElementById("redo");
  const colorPicker = document.getElementById("colorPicker");
  let isDrawing = false;
  let currentColor = colorPicker.value;
  let isErasing = false;
  let drawHistory = [];
  let redoHistory = [];
  signatureCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    if (!isErasing) {
      drawHistory.push(signatureCanvas.toDataURL());
      redoHistory = [];
    }
  });
  signatureCanvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = isErasing ? "#fff" : currentColor;
      ctx.lineWidth = isErasing ? 20 : 2;
      ctx.stroke();
    }
  });
  signatureCanvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });
  signatureCanvas.addEventListener("mouseout", () => {
    isDrawing = false;
  });
  eraseAllButton.addEventListener("click", () => {
    drawHistory.push(signatureCanvas.toDataURL());
    redoHistory = [];
    resetCanvas();
  });
  undoButton.addEventListener("click", () => {
    if (drawHistory.length > 0) {
      redoHistory.push(signatureCanvas.toDataURL());
      const lastState = drawHistory.pop();
      const img = new Image();
      img.src = lastState;
      img.onload = () => {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        ctx.drawImage(img, 0, 0, signatureCanvas.width, signatureCanvas.height);
      };
    }
  });
  redoButton.addEventListener("click", () => {
    if (redoHistory.length > 0) {
      drawHistory.push(signatureCanvas.toDataURL());
      const nextState = redoHistory.pop();
      const img = new Image();
      img.src = nextState;
      img.onload = () => {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        ctx.drawImage(img, 0, 0, signatureCanvas.width, signatureCanvas.height);
      };
    }
  });
  colorPicker.addEventListener("change", (e) => {
    currentColor = e.target.value;
    isErasing = false;
  });
  saveCanvasButton.addEventListener("click", () => {
    const dataURL = signatureCanvas.toDataURL();
    if (!imageExist) {
      const canvasHTML = `<img src="${dataURL}" id="drawing_${Date.now()}" alt="Drawing" style="max-width:100%; height:auto;">`;
      restoreSelection(); 
      insertHTMLAtCursor(canvasHTML);
    } else {
      imageExist.src = dataURL;
    }
    hideDialogueBox();
  });  

  function resetCanvas() {
    ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  }
}
// ---------------------------------------------------------------
changeTextStyle.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.value === "") {
    document.execCommand("formatBlock", false, "p");
  }
  document.execCommand("formatBlock", false, e.target.value);
});

changeFontFamily.addEventListener("change", (e) => {
  e.stopPropagation();
  if (e.target.value == "arial") {
    document.execCommand("fontName", false, "Arial, sans-serif");
  }
  document.execCommand("fontName", false, e.target.value);
});

// font size changing
let disableSelectionChange = false;
document.addEventListener("selectionchange", () => {
  if (disableSelectionChange) return;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedElement = range.commonAncestorContainer.parentElement;
    if (textField.contains(selectedElement)) {
      const computedStyle = window
        .getComputedStyle(selectedElement, null)
        .getPropertyValue("font-size");
      changeFontSize.value = parseInt(computedStyle, 10);
    }
  }
});

function changeSize(change) {
  let currentSize = parseInt(changeFontSize.value, 10);
  let newSize = currentSize + change;

  if (newSize < 1) {
    newSize = 1;
  } else if (newSize > 100) {
    newSize = 100;
  }

  changeFontSize.value = newSize;
  setFontSize(newSize);

  disableSelectionChange = true;
  setTimeout(() => {
    disableSelectionChange = false;
  }, 100);
}

function setFontSize(size) {
  let selection = window.getSelection();
  if (!selection.rangeCount) return;

  let range = selection.getRangeAt(0);
  let span = document.createElement("span");
  span.style.fontSize = size + "px";
  span.textContent = range.toString();

  range.deleteContents();
  range.insertNode(span);
}
document.getElementById("fontSizeOptions").addEventListener("change", (e) => {
  e.stopPropagation();
  setFontSize(e.target.value);
});
// end of changing font
boldBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("bold");
});

italicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("italic");
});

underlineBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("underline");
});

SuperScript.addEventListener("click", (e) => {
  document.execCommand("superscript");
});

SubScript.addEventListener("click", (e) => {
  document.execCommand("subscript");
});

Strikethrough.addEventListener("click", (e) => {
  document.execCommand("strikethrough");
});

function transformText(transformation) {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let selectedText = range.toString();

    let transformedText;
    if (transformation === "uppercase") {
      transformedText = selectedText.toUpperCase();
    } else if (transformation === "lowercase") {
      transformedText = selectedText.toLowerCase();
    } else if (transformation === "capitalize") {
      transformedText =
        selectedText.charAt(0).toUpperCase() +
        selectedText.slice(1).toLowerCase();
    }

    range.deleteContents();
    range.insertNode(document.createTextNode(transformedText));
  }
}
capitalizeBtn.forEach((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.textContent.trim().toLowerCase();
    transformText(value);
  });
});

function toggleColorInput(inputId) {
  const input = document.getElementById(inputId);
  input.click();
}

colorBtnEl.addEventListener("input", (e) => {
  const color = e.target.value;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    if (selectedContent.childNodes.length === 1 && selectedContent.firstChild.nodeType === Node.ELEMENT_NODE) {
      const existingSpan = selectedContent.firstChild;
      if (existingSpan.tagName === "SPAN" && existingSpan.style.color) {
        existingSpan.style.color = color;
        range.insertNode(existingSpan);
        return;
      }
    }
    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(selectedContent);
    range.insertNode(span);
  }
});
highlightBtnEl.addEventListener("input", (e) => {
  const color = e.target.value;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    if (selectedContent.childNodes.length === 1 && selectedContent.firstChild.nodeType === Node.ELEMENT_NODE) {
      const existingSpan = selectedContent.firstChild;
      if (existingSpan.tagName === "SPAN" && existingSpan.style.backgroundColor) {
        existingSpan.style.backgroundColor = color;
        range.insertNode(existingSpan);
        return;
      }
    }
    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.appendChild(selectedContent);
    range.insertNode(span);
  }
});
function applyGradientText() {
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.background = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
    span.style.webkitBackgroundClip = "text";
    span.style.color = "transparent";
    range.surroundContents(span);
  }
}
let savedRange;
insertLink.addEventListener("click", (e) => {
  e.stopPropagation();
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0);
  }

  let content = `
    <div class="text-content">Insert Link</div>
    <div style="display:flex; justify-content:space-between; align-items:center; gap:3px;">
      <label>Paste Link:</label>
      <select id="linkType">
        <option value="http://">Link</option>
        <option value="mailto:">Mail</option>
        <option value="tel:+">Phone</option>
      </select>
      <input type="url" id="linkUrl"/>
    </div>
    <div class="btns">
      <button onclick="createLink()">Insert Link</button>
    </div>
  `;
  showDialog(content);
  document.getElementById("linkUrl").focus();
});

function createLink() {
  var url = document.getElementById("linkUrl").value;
  var linkType = document.getElementById("linkType").value;

  if (url) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);

    if (linkType === "mailto:" || linkType === "tel:+") {
      url = linkType + url;
    }

    document.execCommand("createLink", false, url);
    hideDialogueBox();
  }
}

// ------------------------------------------------------
let imgRange;
attachImage.addEventListener("click", (e) => {
  e.stopPropagation();
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    imgRange = selection.getRangeAt(0);
  }

  let content = `
    <div class="text-content">
      Choose how you would like to add Image.
    </div>
    <div class="btns">
      <button onclick="imageReader()">Upload
        <input type="file" accept="image/*" id="imageUpload" multiple hidden>
      </button>
      <button onclick="imageViaUrl()">Via Url</button>
    </div>
  `;
  showDialog(content);
});

function imageReader() {
  let imageUploadButton = document.getElementById("imageUpload");
  imageUploadButton.click();
  imageUploadButton.addEventListener("change", (e) => {
    e.stopImmediatePropagation();
    readImages(imageUploadButton);
  });
}

function readImages(input) {
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        insertImageAtCursor(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
}
function insertImageAtCursor(dataUrl) {
  textField.focus();
  const selection = window.getSelection();
  if (imgRange) {
    selection.removeAllRanges();
    selection.addRange(imgRange);
  }
  var img = document.createElement("img");
  img.src = dataUrl;
  var range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(img);
  range.setStartAfter(img);
  range.setEndAfter(img);
  selection.removeAllRanges();
  selection.addRange(range);
  imgRange = null;
  hideDialogueBox();
}
function replaceImg(index) {
  const img = textField.querySelectorAll("img")[index];
  if (img) {
    const range = document.createRange();
    range.selectNode(img);
    imgRange = range;
    img.remove();

    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.accept = "image/*";
    newInput.multiple = true;
    newInput.style.display = "none";
    document.body.appendChild(newInput);
    newInput.click();
    newInput.addEventListener("change", (e) => {
      e.stopImmediatePropagation();
      readImages(newInput);
      document.body.removeChild(newInput);
    });
  }
}

function imageViaUrl() {
  let add = `
    <br><br><hr>
    <div class="input-field">
      <label>Image Url</label>
      <input id="imgUrl" type="url"/>
    </div>
    <div class="btns">
      <button onclick="imgUrlSubmit()">Add</button>
    </div>
  `;
  document
    .getElementById("dialogueMainContent")
    .insertAdjacentHTML("beforeend", add);
}

function imgUrlSubmit() {
  var url = document.getElementById("imgUrl").value;
  if (url) {
    insertImageAtCursor(url);
  }
}
// images inserted-------------------------------------------------------------------

leftBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyLeft");
});

centerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyCenter");
});

rightBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("justifyRight");
});
justifyBtn.addEventListener("click", (e) => {
  var alignment = document.queryCommandValue("justify");
  if (alignment === "left") {
    document.execCommand("justifyCenter", false, null);
  } else {
    document.execCommand("justifyLeft", false, null);
  }
});
ordList.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("insertOrderedList");
});

unordList.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("insertUnorderedList");
});

outdentBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("outdent");
});

indentBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("indent");
});

removeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.execCommand("removeFormat");
});

let hrRange;
horizontalBtn.addEventListener("click", (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    hrRange = selection.getRangeAt(0);
  }
  e.preventDefault();
  e.stopPropagation();
  let content = `
   <div class="input-field">
    <label>Line Type</label>
    <select id="lineType">
     <option value="solid">Plane</option>
     <option value="dashed">Dashed</option>
     <option value="dotted">Dotted</option>
     <option value="groove">Groove</option>
     <option value="ridge">Ridge</option>
    </select>
   </div>
   <div class="input-field">
    <label>Line Width(%)</label>
    <input type="number" value="100" style="--width:50px;" id="HLineWidth" step="10"/>
   </div>
   <div class="input-field">
    <label>Line Thickness(px)</label>
    <input type="number" value="2" style="--width:50px;" id="HLinethickNess"/>
   </div>
   <div class="input-field">
    <label>Choose Color</label>
    <input type="color" list="popularColors" style="--width:50px;" id="hColor">
   </div>
   <div class="btns">
   <button onclick="changeLineStyle()">Apply</button>
   </div>
  `;
  showDialog(content);
});
function changeLineStyle() {
  let lineType = document.getElementById("lineType").value;
  let lineWidth = document.getElementById("HLineWidth").value;
  let lineThickness = document.getElementById("HLinethickNess").value;
  let lineColor = document.getElementById("hColor").value;

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(hrRange);

  const hr = document.createElement("hr");
  hr.contentEditable = false;
  hr.style.width = `${lineWidth}%`;
  hr.style.borderStyle = `${lineType}`;
  hr.style.borderWidth = `${lineThickness}px`;
  hr.style.borderColor = `${lineColor}`;

  var range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(hr);
  range.setStartAfter(hr);
  range.collapse(true);
  range.setEndAfter(hr);
  selection.removeAllRanges();
  selection.addRange(range);
  hideDialogueBox();
}

lineHeight.forEach((button) => {
  button.addEventListener("click", (e) => {
    const lineHeightValue = e.target.textContent;
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.lineHeight = lineHeightValue;

      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (err) {
        console.error("Error surrounding selection with span:", err);
      }
    }
  });
});

fullScrBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!document.fullscreenElement) {
    document
      .getElementById("editor-container")
      .requestFullscreen()
      .catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
  } else {
    document.exitFullscreen();
  }
});

let sourceCode = true;
let preventCopy = false;

codeBtn.addEventListener("click", (e) => {
  if (sourceCode === true) {
    const editorHTML = textField.innerHTML;
    originalHTML = editorHTML;
    const escapedHTML = escapeHtml(editorHTML);
    document.querySelector(".text-field").innerHTML = escapedHTML;
    sourceCode = false;
    document.title = "Mero Document - source";
    preventCopy = true;
  } else {
    textField.innerHTML = originalHTML;
    sourceCode = true;
    document.title = "Mero Document";
    preventCopy = false;
  }
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

countData.addEventListener("click", showDataInfo);
function showDataInfo() {
  let data = textField.textContent.trim();
  let letterCount = data.length;
  let wordCount = data.split(/\s+/).filter((word) => word !== "").length;
  let sentenceCount = data
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "").length;
  let imageCount = textField.getElementsByTagName("img").length;
  let content = `
  <div class="text-content">
   Document Information
  </div>
  <ul>
   <li>Letters <span>${letterCount}</span></li>
   <li>Words <span>${wordCount}</span></li>
   <li>Sentences <span>${sentenceCount}</span></li>
   <li>Images <span>${imageCount}</span></li>
  <ul>
 `;
  showDialog(content);
}
// --------------------edit size of image and table
textField.addEventListener('click', function(event) {
  let target = event.target;
  const wrapper = target.closest('.resizable');
  if (!wrapper && document.querySelector('.resizable')) {
    removeWrapper();
  }
  if (target.closest('table')) {
    identifiedElement(target.closest('table')); 
  } else if (target.tagName === 'IMG') {
    identifiedElement(target); 
  }
});
function removeWrapper() {
  const wrapper = document.querySelector('.resizable');
  if (wrapper) {
    const element = wrapper.querySelector('img') || wrapper.querySelector('table') || wrapper.querySelector('canvas');
    const currentTransform = wrapper.style.transform;
    if (currentTransform && element) {
      element.style.transform = currentTransform;
    }
    wrapper.parentNode.insertBefore(element, wrapper); 
    wrapper.remove(); 
  }
}

function identifiedElement(element) {
  if (!element.closest('.resizable')) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('resizable');
    if (element.tagName === 'TABLE') {
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);
    } else if (element.tagName === 'IMG') {
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);
    }
    const handles = [
      { class: 'top-left' },
      { class: 'top-right' },
      { class: 'bottom-left' },
      { class: 'bottom-right' },
    ];
    handles.forEach(handle => {
      const resizeHandle = document.createElement('div');
      resizeHandle.classList.add('resize-handle', handle.class);
      wrapper.appendChild(resizeHandle);
    });
    const rotateHandle = document.createElement('div');
    rotateHandle.classList.add('rotate-handle');
    wrapper.appendChild(rotateHandle);
    addResizeFunctionality(wrapper, element);
  }
}
function addResizeFunctionality(wrapper, element) {
  const handles = wrapper.querySelectorAll('.resize-handle');
  const rotateHandle = wrapper.querySelector('.rotate-handle');
  let currentHandle, startX, startY, startWidth, startHeight, startAngle;
  handles.forEach(handle => {
    handle.addEventListener('mousedown', function(e) {
      currentHandle = e.target;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = element.offsetWidth;
      startHeight = element.offsetHeight;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    });
  });
  function resize(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (currentHandle.classList.contains('top-left')) {
      element.style.width = startWidth - dx + 'px';
      element.style.height = startHeight - dy + 'px';
    } else if (currentHandle.classList.contains('top-right')) {
      element.style.width = startWidth + dx + 'px';
      element.style.height = startHeight - dy + 'px';
    } else if (currentHandle.classList.contains('bottom-left')) {
      element.style.width = startWidth - dx + 'px';
      element.style.height = startHeight + dy + 'px';
    } else if (currentHandle.classList.contains('bottom-right')) {
      element.style.width = startWidth + dx + 'px';
      element.style.height = startHeight + dy + 'px';
    }
  }
  function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }
  rotateHandle.addEventListener('mousedown', function(e) {
    startX = e.clientX;
    startY = e.clientY;
    startAngle = getAngle(e.clientX, e.clientY);
    document.addEventListener('mousemove', rotate);
    document.addEventListener('mouseup', stopRotate);
  });
  function rotate(e) {
    const angle = getAngle(e.clientX, e.clientY);
    const rotateDegree = angle - startAngle;
    wrapper.style.transform = `rotate(${rotateDegree}deg)`; 
  }
  function stopRotate() {
    document.removeEventListener('mousemove', rotate);
    document.removeEventListener('mouseup', stopRotate);
  }
  function getAngle(x, y) {
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  }
}
// by default capitalize when sentence completed
let capitalizeRange;
textField.addEventListener("keydown", function (event) {
  if ((event.metaKey || event.ctrlKey) && event.key === "h") {
    event.preventDefault();
    horizontalBtn.click();
  }
  if ((event.metaKey || event.ctrlKey) && event.key === "l") {
    event.preventDefault();
    insertLink.click();
  }
});
function placeCaretAtEnd(el) {
  el.focus();
  if (
    typeof window.getSelection !== "undefined" &&
    typeof document.createRange !== "undefined"
  ) {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
// send email to user
emailSend.addEventListener("click", (e) => {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  let content = `
    <div class="input-field">
     <label>To:</label>
     <input type="email" id="emailId" placeholder="receiver email"/>
    </div>
    <div class="input-field">
     <label>Subject</label>
     <input id="subjectEm" placeholder="subject of email">
    </div>
    <div class="btns">
     <button onclick="sendEmail()">Send</button>
    </div>
  `;
  showDialog(content);
});
function sendEmail() {
  const body = textField.innerHTML;
  const to = document.getElementById("emailId").value;
  const subject = document.getElementById("subjectEm").value;
  const encodedBody = encodeURIComponent(body);
  const encodedSubject = encodeURIComponent(subject);
  const encodedTo = encodeURIComponent(to);

  if (to && subject) {
    openMailClient(encodedTo, encodedSubject, encodedBody);
  } else {
    let alert = "Reciever email and subject of email both are required.";
    document.getElementById("alert-msg").textContent = alert;
  }
}
function testMailtoSupport() {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    iframe.onload = () => {
      document.body.removeChild(iframe);
      resolve(false);
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      resolve(true);
    };

    iframe.src = "mailto:test@example.com";
    setTimeout(() => resolve(false), 2000);
  });
}

async function openMailClient(encodedTo, encodedSubject, encodedBody) {
  const isSupported = await testMailtoSupport();
  if (isSupported) {
    window.open(
      `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`,
      "_blank"
    );
  } else {
    var alert = "Your browser does not support opening email clients directly.";
    document.getElementById("alert-msg").textContent = alert;
  }
}

deleteFile.addEventListener("click", (e) => {
  document.execCommand("insertHTML", false, "");
});

selectAll.addEventListener("click", (e) => {
  const range = document.createRange();
  range.selectNodeContents(textField);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});

newTab.addEventListener("click", (e) => {
  window.open(window.location.href, "_blank");
});
// read file from users device
let fileRange;
document.getElementById("openFile").addEventListener("click", function () {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    fileRange = selection.getRangeAt(0);
  }
  document.getElementById("newFile").click();
});
let openedFileName = '';
document.getElementById("newFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    openedFileName = file.name;
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      if (file.type === "text/plain") {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(fileRange);
        document.execCommand("insertHTML", false, content);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        mammoth
          .convertToHtml({ arrayBuffer: reader.result })
          .then(function (result) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(fileRange);
            document.execCommand("insertHTML", false, result.value);
          })
          .catch(function (err) {
            console.log(err);
          });
      } else if (file.name.endsWith(".mydoc")) {
        const decryptedContent = decryptMyDoc(content);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(fileRange);
        textField.innerHTML = decryptedContent;
      } else {
        let content = `
          <div class="text-content">File type not supported currently.</div>
        `;
        showDialog(content);
      }
    };
    if (file.type === "text/plain") {
      reader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".mydoc")) {
      reader.readAsText(file);
    }
  }
});

function decryptMyDoc(encryptedContent) {
  const encryptionKey = 145324; // Same key used for encryption
  return xorEncryptDecrypt(encryptedContent, encryptionKey);
}
function xorEncryptDecrypt(input, key) {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key);
  }
  return output;
}

const tooltips = document.querySelectorAll("tooltip"),
  navItems = document.querySelectorAll(".nav-item"),
  ownMenu = document.getElementById("custom-menu"),
  dialogueBox = document.getElementById("dialogBox");
document.addEventListener("click", (e) => {
  let clickedOutside = true;
  tooltips.forEach((tooltip) => {
    if (tooltip.contains(e.target)) {
      clickedOutside = false;
    }
  });
  navItems.forEach((navItem) => {
    if (navItem.contains(e.target)) {
      clickedOutside = false;
    }
  });
  if (dialogueBox.contains(e.target)) {
    clickedOutside = false;
  }
  if (ownMenu.contains(e.target)) {
    clickedOutside = false;
  }
  if (clickedOutside) {
    hideDialogueBox();
  }
});

const findReplace = document.getElementById("findReplace");
findReplace.addEventListener("click", (e) => {
  e.stopPropagation();
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  showSeachTextField();
});
function showSeachTextField(text = null){
  let content = `
    <div class="input-field">
      <label>Find:</label>
      <input id="findTxt">
    </div>
    <div class="input-field">
      <label>Replace:</label>
      <input id="replaceTxt">
    </div>
    <div class="btns">
      <button onclick="findNext()">Next</button>
      <button onclick="findAndReplace()">Replace</button>
      <button onclick="findAndReplaceAll()">Replace All</button>
      <button onclick="clearHighlights()">Clean</button>
    </div>
  `;
  showDialog(content);
  document.getElementById("findTxt").focus();
  findText();
}
function findText() {
  let searchInput = document.getElementById("findTxt");
  searchInput.addEventListener("input", (e) => {
    var reqTxt = e.target.value;
    var content = textField.innerHTML;
    clearHighlights();
    if (reqTxt && content.includes(reqTxt)) {
      let regex = new RegExp(reqTxt, "g");
      let newContent = content.replace(
        regex,
        `<span class="highlight">${reqTxt}</span>`
      );
      textField.innerHTML = newContent;
      const textNode = textField.querySelector(".highlight");
      if (textNode) {
        textNode.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      var alert = "There is no text related to " + reqTxt;
      document.getElementById("alert-msg").innerText = alert;
    }
  });
}
function findNext() {
  let highlightedText = document.querySelectorAll(".highlight");
  if (highlightedText.length > 0) {
    let currentIndex = [...highlightedText].findIndex((el) =>
      el.classList.contains("selected")
    );
    if (currentIndex === -1) {
      currentIndex = 0;
      highlightedText[currentIndex].classList.add("selected");
    } else {
      highlightedText[currentIndex].classList.remove("selected");
      do {
        currentIndex = (currentIndex + 1) % highlightedText.length;
      } while (highlightedText[currentIndex].classList.contains("selected"));
      highlightedText[currentIndex].classList.add("selected");
    }
    const nextMatch = highlightedText[currentIndex];
    nextMatch.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(nextMatch);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
function findAndReplace() {
  var reqTxt = document.getElementById("findTxt").value;
  var repTxt = document.getElementById("replaceTxt").value;
  let highlightedText = document.querySelector(".highlight.selected");
  if (highlightedText) {
    let highlightedTextArray = [...document.querySelectorAll(".highlight")];
    let currentHighlighted = highlightedTextArray.indexOf(highlightedText);
    highlightedText.innerHTML = highlightedText.innerHTML.replace(reqTxt, repTxt);
    highlightedText.classList.remove("highlight", "selected");
    let nextIndex = (currentHighlighted + 1) % highlightedTextArray.length;
    highlightedTextArray[nextIndex].classList.add("selected");
    const nextMatch = highlightedTextArray[nextIndex];
    nextMatch.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(nextMatch);
    selection.removeAllRanges();
    selection.addRange(range);
    highlightedText.classList.remove("highlight");
  } else {
    var alert = "No highlighted text found to replace.";
    document.getElementById("alert-msg").innerText = alert;
  }
}
function findAndReplaceAll() {
  var reqTxt = document.getElementById("findTxt").value;
  var repTxt = document.getElementById("replaceTxt").value;
  var content = textField.innerHTML;
  if (content.includes(reqTxt)) {
    var regex = new RegExp(reqTxt, "g");
    var newContent = content.replace(regex, repTxt);
    textField.innerHTML = newContent;
    clearHighlights();
    findText();
  } else {
    var alert = "There is no text related to " + reqTxt;
    document.getElementById("alert-msg").innerText = alert;
  }
}
function clearHighlights() {
  textField.innerHTML = textField.innerHTML.replace(
    /<span class="highlight(?: selected)?">|<\/span>/g,
    ""
  );
}

textField.addEventListener("copy", function (e) {
  e.preventDefault();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const container = document.createElement("div");
  container.appendChild(range.cloneContents());
  let copyContent = container.innerHTML.replace(
    /<span class="highlight">|<\/span>/g,
    ""
  );
  e.clipboardData.setData("text/html", copyContent);
  e.clipboardData.setData("text/plain", container.textContent.trim());
});
// ------------------------------------------------------
pageSetup.addEventListener("click", (e) => {
  e.stopPropagation();
  let margLeft = 0.5;
  let margRight = 0.5;
  let margTop = 0.5;
  let margBottom = 0.5;
  let pageWidth = 8.5;
  let pageBackColor = "#FFFFFF";
  if (textField.style.paddingLeft) {
    margLeft = textField.style.paddingLeft.replace(/[^\d.]/g, "");
    margRight = textField.style.paddingRight.replace(/[^\d.]/g, "");
    margBottom = textField.style.paddingBottom.replace(/[^\d.]/g, "");
    margTop = textField.style.paddingTop.replace(/[^\d.]/g, "");
  }
  if (textField.style.width) {
    pageWidth = textField.style.width.replace(/[^\d.]/g, "");
  }
  let content = `
   <div class="text-content">Customize Your Page</div>
   <div class="text-content">Margin<sub>(inch)</sub></div>
   <div class="input-field">
    <label>Left</label>
    <input type="number" value="${margLeft}" step="0.1" id="marLeft" style="--width:50px;;">
    <label>Right</label>
    <input type="number" value="${margRight}" step="0.1" id="marRight" style="--width:50px;;">
   </div>
   <hr>
   <div class="input-field" style="--field-for:'hari';">
   <label>Top</label>
   <input type="number" value="${margTop}" step="0.1" id="marTop" style="--width:50px;;">
   <label>Bottom</label>
   <input type="number" value="${margBottom}" step="0.1" id="marBottom" style="--width:50px;;">
  </div>
  <div class="btns">
    <button onclick="pageFormat()">Change</button>
  </div>
  <div class="text-content">Page Format</div>
  <div class="input-field">
   <label>Page Size</label>
   <select id="pageSize">
    <option value="8.5*11" ${
      pageWidth == "8.5" ? "selected" : ""
    }>letter (8.5x11)</option>
    <option value="5.5*8.5" ${
      pageWidth == "5.5" ? "selected" : ""
    }>Statement (5.5x8.5)</option>
    <option value="11.69*16.54" ${
      pageWidth == "11.69" ? "selected" : ""
    }>A3 (11.69x16.54)</option>
    <option value="8.27*11.69" ${
      pageWidth == "8.27" ? "selected" : ""
    }>A4 (8.27x11.69)</option>
    <option value="5.83*8.27"  ${
      pageWidth == "5.83" ? "selected" : ""
    }>A5 (5.83x8.27)</option>
    </select>
  </div>
  <div class="input-field">
    <label>Background</label>
    <input type="color" value="${pageBackColor}" list="popularColors" style="--width:50px;" id="pageBack">
  </div>
  `;
  showDialog(content);

  var pageSize = document.getElementById("pageSize");
  var pageBack = document.getElementById("pageBack");
  pageSize.addEventListener("change", (e) => {
    var page = e.target.value;
    let [width, height] = page.split("*");
    applyPageSize(width, height);
  });
  pageBack.addEventListener("change", (e) => {
    applyBackground(e.target.value);
  });
});

function pageFormat() {
  var margLeft = document.getElementById("marLeft").value;
  var margRight = document.getElementById("marRight").value;
  var margTop = document.getElementById("marTop").value;
  var margBottom = document.getElementById("marBottom").value;
  applyMargin(margLeft, margRight, margTop, margBottom);
}
function applyMargin(margLeft, margRight, margTop, margBottom) {
  let pages = document.querySelectorAll(".text-field");
  pages.forEach((page) => {
    page.style.paddingLeft = margLeft + "in";
    page.style.paddingRight = margRight + "in";
    page.style.paddingTop = margTop + "in";
    page.style.paddingBottom = margBottom + "in";
  });
}
function applyBackground(colorCode) {
  textField.style.backgroundColor = colorCode;
}
function applyPageSize(width, height) {
  var editor = document.querySelectorAll(".text-field");
  editor.forEach((edit) => {
    edit.style.width = width + "in";
  });

  let printStyle = document.getElementById("print-style");
  if (printStyle) {
    printStyle.remove();
  }
  printStyle = document.createElement("style");
  printStyle.id = "print-style";
  printStyle.innerHTML = `@page { size: ${width}in ${height}in; margin: 20mm; }`;
  document.head.appendChild(printStyle);
}

// ---------------------------------------------------------------------------------------------------
downloadBtn.addEventListener("click", saveDocument);
function saveDocument(e) {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  e.preventDefault();
  let content = `
      <div>
        <label for="fileName">File Name:</label>
        <input type="text" value="${openedFileName.slice(0, openedFileName.lastIndexOf('.'))}" id="fileName">
        <select id="fileType">
         <option value=".mydoc">.mydoc</option>
         <option value=".doc">.doc</option>
         <option value=".pdf">.pdf</option>
         <option value=".jpeg">.jpeg</option>
         <option value=".html">.html</option>
         <option value=".txt">.txt</option>
        </select>
      </div>
      <div class="btns">
        <button onclick="saveFile()">Download</button>
      </div>
    `;
  showDialog(content);
  document.getElementById("fileName").focus();
}
function saveFile() {
  let fileName = document.getElementById("fileName").value;
  let fileType = document.getElementById("fileType").value;
  let htmlContent = textField.innerHTML;

  switch (fileType) {
    case ".mydoc":
      saveAsMyDoc(fileName);
      break;
    case ".doc":
      saveAsDoc(textField.id, fileName);
      break;
    case ".txt":
      saveAsTxt(fileName);
      break;
    case ".pdf":
      saveAsPdf(fileName, textField);
      break;
    case ".jpeg":
      saveAsJpeg(fileName, textField);
      break;
    case ".html":
      saveAsHtml(fileName, htmlContent);
      break;
  }
  hideDialogueBox();
}
function xorEncryptDecrypt(input, key) {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key);
  }
  return output;
}
function saveAsMyDoc(filename) {
  const editorContent = textField.innerHTML
    .replace(/<span class="highlight">|<\/span>/g, "") 
    .replace(/<span[^>]*(spell-wrong)[^>]*>(.*?)<\/span>/g, "$2");
  const encryptionKey = 145324;
  const encryptedContent = xorEncryptDecrypt(editorContent, encryptionKey);
  const blob = new Blob([encryptedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.mydoc`;
  link.click();
}
function saveAsDoc(elementId, fileName) {
  Export2Word(elementId, fileName);
}

function saveAsTxt(fileName) {
  let blob = new Blob([textField.textContent], { type: "text/html" });
  downloadBlob(fileName + ".txt", blob);
}

function saveAsPdf(fileName, element) {
  html2pdf(element, {
    filename: fileName + ".pdf",
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait" },
  });
}

function saveAsJpeg(fileName, element) {
  html2canvas(element).then(function (canvas) {
    canvas.toBlob(function (blob) {
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.jpg`;
      link.click();
    }, "image/jpeg");
  });
}

function saveAsHtml(fileName, htmlContent) {
  let blob = new Blob([htmlContent], { type: "text/html" });
  downloadBlob(fileName + ".html", blob);
}

function downloadBlob(fileName, blob) {
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// export / download document file
function Export2Word(element, filename = "") {
  var htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Document ${filename}</title>
        <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
            </w:WordDocument>
          </xml>
        <![endif]-->
      </head>
      <body>${document.getElementById(element).innerHTML}</body>
    </html>
  `;
  var blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword",
  });
  var url = URL.createObjectURL(blob);
  filename = filename ? filename + ".doc" : "document.doc";
  var downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    saveDocument(e);
  }
  if (e.ctrlKey && e.key === "p") {
    e.preventDefault();
    printTextField();
  }
  if ((e.ctrlKey && e.key === "c") || (e.ctrlKey && e.key === "x")) {
    if (preventCopy) {
      e.preventDefault();
    }
  }
  if (e.key === "f" && e.ctrlKey) {
    e.preventDefault();
    let selectedText = "";
    if (textField && textField.selectionStart !== undefined) {
      const start = textField.selectionStart;
      const end = textField.selectionEnd;
      selectedText = textField.value.substring(start, end);
    } else {
      selectedText = window.getSelection().toString();
    }
    showSeachTextField(selectedText);
  }
});
function removeWindow() {
  window.close();
}

let tableEdit = true;
const customMenu = document.getElementById("custom-menu");
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("contextmenu", function (event) {
    dialogContainer.classList.remove("active");
    event.preventDefault();
    customMenu.innerHTML = "";
    let content = "";
    if (event.target.closest("#text-field")) {
      if (event.target.tagName === "HR") {
        let hr = event.target;
        let hrs = Array.from(textField.querySelectorAll("hr"));
        let hrIndex = hrs.indexOf(hr);
        content = `
        <li class="custom-menu-item" onclick="removeHr(${hrIndex})">Remove Line</li> <hr>`;
      }
      if (event.target.tagName === "IMG") {
        let image = event.target;
        let images = Array.from(textField.querySelectorAll("img"));
        let imageIndex = images.indexOf(image);
        content = `<li class="custom-menu-item" onclick="editImg(${imageIndex})">Edit Image</li>
        <li class="custom-menu-item" onclick="deleteImg(${imageIndex});">Delete Image</li>`;
        if(image.id.startsWith('drawing_')){
          content +=`<li class="custom-menu-item" onclick="displayDrawingFiled('${image.id}');">Draw</li>`;
        }else{
          content += `<li class="custom-menu-item" onclick="replaceImg(${imageIndex})">Replace Image</li>`;
        }
        content += `<hr>`;
      }
      if (checkTable(event)) {
        let tblId = event.target.parentElement;
        let tblBody = tblId.parentElement;
        let table = tblBody.parentElement;
        let tr = Array.from(tblBody.querySelectorAll("tr"));
        let rowIndex = tr.indexOf(tblId);
        let cellIndex = Array.from(tblId.children).indexOf(event.target);
        content = `
        ${
          !tableEdit
            ? ""
            : `
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'addRow', ${rowIndex}, ${cellIndex})">Add Row</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'addCol', ${rowIndex}, ${cellIndex})">Add Column</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'delRow', ${rowIndex}, ${cellIndex})">Delete Row</li>
        <li class="custom-menu-item" onclick="changeTbl(${table.id}, 'delCol', ${rowIndex}, ${cellIndex})">Delete Column</li>
        `
        }
        <li class="custom-menu-item" onclick="changeTbl(${
          table.id
        }, 'delTbl', ${rowIndex}, ${cellIndex})">Delete Table</li>
        <hr>
        `;
      }
      if (event.target.tagName === "CANVAS") {
        const canvasId = event.target.id;
        content = `
          <li class="custom-menu-item" onclick="editChart('${canvasId}')">Edit</li>
          <li class="custom-menu-item" style="color:red;" onclick="deleteChart('${canvasId}')">Delete</li>
          <hr>
        `;
      }
      content += `
        <li class="custom-menu-item" onclick="">Copy <span>(ctrl+c)</span></li>
        <li class="custom-menu-item" onclick="">Paste <span>(ctrl+v)</span></li>
        <li class="custom-menu-item" onclick="applyGradientText()">Gradient Color</li>
        ${
          checkTable(event) ||
          event.target.tagName === "IMG" ||
          event.target.tagName === "CANVAS"
            ? ""
            : `
        <hr>
        <li class="custom-menu-item" onclick="document.getElementById('attachImage').click();">Insert Image <span>(alt+I)</span></li>
        <li class="custom-menu-item" onclick="document.getElementById('insertLink').click();">Link <span>(ctrl+L)</span></li>
        <hr>
        <li class="custom-menu-item" onclick="document.getElementById('printDoc').click();">Print <span>(ctrl+p)</span></li>
        `
        }
      `;
      customMenu.innerHTML = content;
    } else {
      let defaultContent = `
      <li class="custom-menu-item" onclick="document.getElementById('downloadBtn').click();">Save <span class="fas fa-save"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('openFile').click();">Open <span class="fas fa-file-import"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('printDoc').click();">Print <span class="fas fa-print"></span></li>
      <li class="custom-menu-item" onclick="document.getElementById('emailSend').click();">Send E-mail <span class="fas fa-envelope"></span></li>
      <hr>
      <li class="custom-menu-item" onclick="document.getElementById('pageSetup').click();">pageSetup <span class="fas fa-file-lines"></span></li>
      `;
      customMenu.innerHTML = defaultContent;
    }
    this.document
      .querySelectorAll(".custom-menu-item")
      ?.forEach((customContextOptions) => {
        customContextOptions.addEventListener("contextmenu", (e) => {
          customContextOptions.click();
        });
      });
    const menuHeight = customMenu.offsetHeight || 100;
    const screenHeight = window.innerHeight;
    if (event.clientY + menuHeight > screenHeight) {
      customMenu.style.top = `${event.clientY - menuHeight}px`;
    } else {
      customMenu.style.top = `${event.clientY}px`;
    }
    customMenu.style.left = `${event.clientX}px`;
    if (!event.target.classList.contains("custom-menu-item")) {
      customMenu.style.display = "block";
    }
  });
  window.addEventListener("click", function () {
    customMenu.style.display = "none";
  });
});
function checkTable(event) {
  return (
    event.target.tagName === "TABLE" ||
    event.target.tagName === "TR" ||
    event.target.tagName === "TH" ||
    event.target.tagName === "TD"
  );
}

// ---------------------------------------------------------
let borderColorChanged = true;
function editImg(index) {
  let image = textField.querySelectorAll("img")[index];
  let width = image.style.width;
  width = width.replace(/[^0-9]/g, "");
  let height = image.style.height;
  height = height.replace(/[^0-9]/g, "");
  let padding = image.style.padding;
  padding = padding.replace(/[^0-9]/g, "");
  let border = image.style.borderWidth;
  let borderType = image.style.borderStyle;
  let borderColor = image.style.borderColor;
  let ImgRadius = image.style.borderRadius;
  let objectFit = image.style.objectFit;
  let float = image.style.float;
  let boxShadow = image.style.boxShadow;
  let filter = image.style.filter;
  let content = `
  <div class="text-content">Edit Image</div>
  <div class="input-field">
   <label>Side Space:</label>
   <label>Placement:</label>
  </div>
  <div class="input-field">
     <input type="number" value="${(padding)?padding:'0'}" id="paddImg" style="--width:50px;" step="2"/>
     <select id="floatImg">
       <option value="none" ${float == "none" ? "selected" : ""}>None</option>
       <option value="left" ${float == "left" ? "selected" : ""}>Left</option>
       <option value="right" ${float == "right" ? "selected" : ""}>Right</option>
    </select>
  </div>
  <div class="input-field">
   <label>Round <i class="far fa-square"></i>:</label>
   <label>Style:</label>
  </div>
  <div class="input-field">
   <input type="number" value="${ImgRadius ? parseInt(ImgRadius) : "0"}" id="ImgRadius" style="--width:50px;" step="5"/>
   <select id="objectFit">
     <option value="none" ${objectFit == "none" ? "selected" : ""}>None</option>
     <option value="contain" ${
       objectFit == "contain" ? "selected" : ""
     }>Fit</option>
     <option value="cover" ${
       objectFit == "cover" ? "selected" : ""
     }>Spread</option>
     <option value="fill" ${objectFit == "fill" ? "selected" : ""}>Full</option>
   </select>
  </div>
  <hr>
  <div style="display:flex; justify-content:space-between; align-items:center;">
  <label>Border:</label>
  <input type="number" value="${
    border ? parseInt(border) : "0"
  }" id="borderVal" style="--width:50px;" step=".5"/>
  <select id="borderType">
  <option value="none">none</option>
    <option value="solid"${
      borderType == "solid" ? "selected" : ""
    }>Solid</option>
    <option value="dashed" ${
      borderType == "dashed" ? "selected" : ""
    }>Dashed</option>
    <option value="dotted" ${
      borderType == "dotted" ? "selected" : ""
    }>Dotted</option>
    <option value="groove" ${
      borderType == "groove" ? "selected" : ""
    }>Groove</option>
    <option value="ridge" ${
      borderType == "ridge" ? "selected" : ""
    }>Ridge</option>
  </select>
  <input type="color" value="${(borderColor) ? borderColor : "" }" list="popularColors" id="borderColor" style="--width:50px;">
 </div>
 <br>
 <div style="display:flex; justify-content:space-between; align-items:center;">
  <label>Shadow:</label>
  <select id="imgShadow">
    <option value="none">None</option>
    <option value="inside" ${filter ? "selected" : ""}>Inside</option>
    <option value="outside" ${boxShadow ? "selected" : ""}>Outside</option>
  </select>
  <input type="color" id="shadowColor" list="popularColors" value="#4444dd" style="width: 50px;">
 </div>
  <hr><hr>
  <div class="btns">
    <button onclick="changeOnImg(${index})">Apply</button>
    <button onclick="hideDialogueBox()">Close</button>
  </div>
 `;
  showDialog(content);
  document.getElementById("borderColor").addEventListener("change", (e) => {
    borderColorChanged = true;
  });
}
function changeOnImg(id) {
  let image = textField.querySelectorAll("img")[id];
  let padding = document.getElementById("paddImg").value;
  let objectFit = document.getElementById("objectFit").value;
  let float = document.getElementById("floatImg").value;
  let border = document.getElementById("borderVal").value;
  let borderType = document.getElementById("borderType").value;
  let imgShadow = document.getElementById("imgShadow").value;
  let shadowColor = document.getElementById("shadowColor").value;
  switch (imgShadow) {
    case "inside":
      image.style.filter = `drop-shadow(0 0 4px ${shadowColor})`;
      break;
    case "outside":
      image.style.boxShadow = `0 2px 4px 0 ${shadowColor}`;
      break;
    default:
      image.style.filter = `none`;
      image.style.boxShadow = `none`;
  }
  if (borderColorChanged) {
    let borderColor = document.getElementById("borderColor").value;
    image.style.borderColor = `${borderColor}`;
  }
  let ImgRadius = document.getElementById("ImgRadius").value;
  image.style.padding = `${padding}px`;
  image.style.objectFit = `${objectFit}`;
  image.style.float = `${float}`;
  image.style.borderWidth = `${border}px`;
  image.style.borderStyle = `${borderType}`;
  image.style.borderRadius = `${ImgRadius}px`;
  borderColorChanged = false;
}
function deleteImg(index) {
  removeWrapper();
  textField.querySelectorAll("img")[index].remove();
}
// --------------------------------------------------------
function removeHr(index) {
  textField.querySelectorAll("hr")[index].remove();
}
// ---------------------------------------------------------

function changeTbl(e, side, rowIndex, cellIndex) {
  let table = document.getElementById(e.id);
  let tblRow = table.querySelectorAll("tr");
  if (tblRow.length < 3) {
    tableEdit = false;
    return;
  }
  let tblCol = tblRow[tblRow.length - 1].querySelectorAll("td");
  let padding = tblCol[0].style.padding;
  let tblBody = table.getElementsByTagName("tbody")[0];
  switch (side) {
    case "addRow":
      addRow(tblCol.length, padding, tblBody, rowIndex);
      break;
    case "addCol":
      addCol(tblRow, padding, cellIndex);
      break;
    case "delRow":
      delRow(tblBody, rowIndex);
      break;
    case "delCol":
      delCol(tblRow, cellIndex);
      break;
    case "delTbl":
      delTbl(table);
      break;
  }
}
function addRow(colCount, padding, tblBody, rowIndex) {
  let newRow = document.createElement("tr");
  for (let i = 0; i < colCount; i++) {
    let newCell = document.createElement("td");
    newCell.style.padding = padding;
    newCell.innerHTML = "&nbsp;";
    newRow.appendChild(newCell);
  }
  tblBody.insertBefore(newRow, tblBody.children[rowIndex + 1]);
}

function addCol(tblRow, padding, cellIndex) {
  tblRow.forEach((tr) => {
    let newCell;
    if (tr.querySelectorAll("th").length > 0) {
      newCell = document.createElement("th");
    } else {
      newCell = document.createElement("td");
    }
    newCell.style.padding = padding;
    newCell.innerHTML = "&nbsp;";
    tr.insertBefore(newCell, tr.children[cellIndex + 1]);
  });
}

function delRow(tblBody, rowIndex) {
  if (rowIndex >= 0 && rowIndex < tblBody.children.length) {
    tblBody.removeChild(tblBody.children[rowIndex]);
  }
}

function delCol(tblRow, cellIndex) {
  tblRow.forEach((tr) => {
    if (cellIndex >= 0 && cellIndex < tr.children.length) {
      tr.removeChild(tr.children[cellIndex]);
    }
  });
}
function delTbl(table) {
  removeWrapper();
  document.getElementById(table.id).remove();
}

// ---------------------------------------------------------------------------------------
localSave.addEventListener("click", (e) => {
  if (
    textField.textContent.trim() == "" &&
    textField.getElementsByTagName("img").length < 1
  ) {
    emptyDoc();
    return;
  }
  e.preventDefault();
  let content = `
  <div class="text-content">Save your file Locally.</div>
  <div class="input-field">
    <label>File Name:</label>
   <input id="localFileName">
 </div>
  <div class="btns">
   <button onclick="saveLocally()">Save</button>
  </div>
 `;
  showDialog(content);
  document.getElementById("localFileName").focus();
});
function saveLocally() {
  let localFileName = document.getElementById("localFileName").value;
  if (localFileName.trim() == "") {
    document.getElementById(
      "alert-msg"
    ).textContent = `File name cannot be empty.`;
    return;
  }
  let checkFile = JSON.parse(localStorage.getItem(localFileName));
  if (checkFile) {
    let alert = `This fileName is already exist`;
    document.getElementById("alert-msg").textContent = alert;
    return;
  }
  localStorage.setItem(localFileName, JSON.stringify(textField.innerHTML));
  hideDialogueBox();
}
const localFile = document.getElementById("localFile");
localFile.addEventListener("click", (e) => {
  e.preventDefault();
  getLocalData();
});
function getLocalData() {
  let content = `
 <div class="text-content">
   Saved Files
  </div>
  <ul>`;
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      content += `<li style="cursor:pointer;">
        <input type="checkBox" value="${localStorage.key(i)}" id="filesId">
        <a onclick="openLocalFile('${localStorage.key(
          i
        )}')"><i class="fas fa-fw fa-file"></i>${localStorage.key(i)}</a>
        <span onclick="deleteLocalFIle('${localStorage.key(
          i
        )}')" class="fas fa-trash" style="color:red;cursor:pointer;"></span>
        </li> `;
    }
    content += ` </ul>
    <div class="btns"><button class="red" id="deleteMultiple">Deltete Selected</button>`;
  } else {
    content += `<li style="color:red;">Empty database.</li></ul>`;
  }
  showDialog(content);
  document.getElementById("deleteMultiple").addEventListener("click", (e) => {
    let id = [];
    let checks = document.querySelectorAll("#filesId");
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        id.push(checks[i].value);
      }
    }
    deleteSelectedFiles(id);
  });
}

function openLocalFile(name) {
  let findFile = JSON.parse(localStorage.getItem(name));
  if (findFile) {
    textField.innerHTML = findFile;
    hideDialogueBox();
  }
}
function deleteLocalFIle(name) {
  let file = JSON.parse(localStorage.getItem(name));
  if (file) {
    localStorage.removeItem(name);
    getLocalData();
  }
}
function deleteSelectedFiles(files) {
  files.forEach((file) => {
    localStorage.removeItem(file);
    getLocalData();
  });
}
window.addEventListener("load", (e) => {
  var content = sessionStorage.getItem("content");
  if (content) {
    textField.innerHTML = content;
    sessionStorage.removeItem("content");
  }
});
// -------------------------show dialogue box---------------------------------------
function showDialog(content) {
  if (document.getElementById("custom-menu").classList.contains("show")) {
    document.getElementById("custom-menu").classList.remove("show");
  }
  document.getElementById("alert-msg").textContent = "";
  document.getElementById("dialogueMainContent").innerHTML = content;
  dialogContainer.classList.add("active");

  dialogContainer.addEventListener("mousedown", startDrag);
}
// ------------------------------------------------------------------
function startDrag(e) {
  if (
    e.target.tagName === "LABEL" ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "LI" ||
    e.target.tagName === "IMG" ||
    e.target.tagName === "CANVAS"
  ) {
    return;
  }
  const initialX = e.clientX;
  const initialY = e.clientY;
  const initialLeft = dialogContainer.offsetLeft;
  const initialTop = dialogContainer.offsetTop;

  function onDrag(e) {
    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;

    dialogContainer.style.left = `${initialLeft + deltaX}px`;
    dialogContainer.style.top = `${initialTop + deltaY}px`;
  }
  function stopDrag() {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function hideDialogueBox() {
  dialogContainer.classList.remove("active");
  dialogContainer.removeEventListener("mousedown", startDrag);
}

dialogContainer.addEventListener("mousedown", startDrag);

function emptyDoc() {
  let content = `
    <div class="text-content">Your document is empty.</div>
    `;
  showDialog(content);
}
// -------------------------------------------------------------
const inbuiltFormat = document.getElementById("inbuiltFormat");
inbuiltFormat.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let content = `
  <div class="text-content">Choose Template</div>
  <div class="templates">
    <picture onclick="filterTemplate('letter')"><img src="assets/templates/letter.jpg" alt=""><span>Letter</span></picture>
    <picture onclick="filterTemplate('businessLetter')"><img src="assets/templates/business letter.jpg" alt=""><span>Business Letter</span></picture>
    <picture onclick="filterTemplate('resume')"><img src="assets/templates/resume.jpg" alt=""><span>Resume</span></picture>
    <picture onclick="filterTemplate('swissResume')"><img src="assets/templates/swiss resume.jpg" alt=""><span>Swiss Resume</span></picture>
    <picture onclick="filterTemplate('modernResume')"><img src="assets/templates/modern resume.jpg" alt=""><span>Modern Resume</span></picture>
    <picture onclick="filterTemplate('essay')"><img src="assets/templates/essay.jpg" alt=""><span>Essay</span></picture>
    <picture onclick="filterTemplate('newsLetter')"><img src="assets/templates/newsletter.jpg" alt=""><span>News Letter</span></picture>
    <picture onclick="filterTemplate('report')"><img src="assets/templates/report.jpg" alt=""><span>Report</span></picture>
    <picture onclick="filterTemplate('recipe')"><img src="assets/templates/recipe.jpg" alt=""><span>Recipe</span></picture>
  </div>
  `;
  showDialog(content);
});
// --------------------------------------------
const filterTemplate = (templateKey) => {
  var content = pageTemplate[templateKey];
  if (content) {
    if (
      textField.textContent.trim() == "" &&
      textField.getElementsByTagName("img").length < 1
    ) {
      textField.innerHTML = content;
      hideDialogueBox();
    } else {
      sessionStorage.setItem("content", content);
      hideDialogueBox();
      window.open(window.location.href, "_blank");
    }
  }
};

// ------------------------------------------------------
printDoc.addEventListener("click", (e) => {
  e.stopPropagation();
  printTextField();
});
let printWindow;
function printTextField() {
  customMenu.classList.remove("active");
  const dimensions = {
    8.5: "11",
    5.5: "8.5",
    11.69: "16.54",
    8.27: "11.69",
    5.83: "8.27",
  };
  let width = (textField.offsetWidth || 595) / 96;
  width = width.toFixed(2);
  const height = dimensions[width] || (textField.offsetHeight || 842) / 96;
  const textFieldContent = textField.innerHTML;
  const styles = window.getComputedStyle(textField);
  const backgroundColor = styles.backgroundColor;
  const fontSize = styles.fontSize;
  const color = styles.color;
  printWindow = window.open("", "", `height=${842},width=${695}`);
  printWindow.document.write(`
    <html>
      <head>
        <link rel="stylesheet" href="./assets/css/rich_text.css" />
        <title>Mero Document</title>
        <style>
          @media print {
            @page { 
              size: ${width}in ${height}in; 
              margin: 20px; 
            }
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body style="background-color: ${backgroundColor}; color: ${color}; font-size: ${fontSize};">
       <div class="text-field" style="background-color: ${backgroundColor}; color: ${color}; font-size: ${fontSize};">
        ${textFieldContent}
       </div>
      </body>
    </html>
  `);
  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.print();
    printWindow.close();
  };
}
window.addEventListener('beforeunload', (event) => {
  if (textField && textField.innerHTML.trim() !== '') {
    event.preventDefault();
    event.returnValue = '';
  }
  if (printWindow && !printWindow.closed) {
    printWindow.close();
  }
});