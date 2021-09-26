// src/lib.ts
function getTables() {
  return [...document.querySelectorAll("table")];
}
function getFirstRow(table) {
  const tr = table.querySelector("tr");
  if (tr == null) {
    throw new Error("table doesn't have any tr");
  }
  return tr;
}
function getCells(row) {
  return [...row.querySelectorAll("th, td")];
}
var BAR_WIDTH = 10;
function createSliderStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
.table-column-slider {
    cursor: col-resize;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: ${BAR_WIDTH}px;
    transform: translateX(calc(${BAR_WIDTH / 2}px + var(--border-width) / 2));
}

.table-column {
  width: var(--width)
}
`;
  return style;
}
function calcBorderRightWidth(cell) {
  const style = window.getComputedStyle(cell);
  return parseInt(style.borderRightWidth);
}
function getData(table) {
  const firstRow = getFirstRow(table);
  return {
    cols: [...table.querySelectorAll("col")],
    firstRowCells: getCells(firstRow)
  };
}
var startPoint = { x: NaN, y: NaN };
var currentCol = null;
var currentColIndex = null;
function setOriginalWidth(table) {
  const data = getData(table);
  for (let i = 0; i < data.cols.length; i++) {
    const col = data.cols[i];
    const cell = data.firstRowCells[i];
    col.style.setProperty("--original-width", `${cell.offsetWidth}px`);
  }
}
function updateColWidth(table, colIndex) {
  const data = getData(table);
  const col = data.cols[colIndex];
  const cell = data.firstRowCells[colIndex];
  const width = `${cell.offsetWidth}px`;
  col.style.setProperty("--original-width", width);
  col.style.setProperty("--width", width);
}
function setColWidth(delta) {
  if (currentCol === null) {
    return;
  }
  currentCol.style.setProperty("--width", `max(calc(var(--original-width) + ${delta}px), 1em)`);
}
function mouseMoveHandler(e) {
  e.preventDefault();
  console.log("mousemove");
  const delta = e.clientX - startPoint.x;
  console.log(`delta: {x: ${delta}}`);
  setColWidth(delta);
}
function insertColGroup(table) {
  const colgroup = document.createElement("colgroup");
  const firstRow = getFirstRow(table);
  for (let i = 0; i < getCells(firstRow).length; i++) {
    const col = document.createElement("col");
    col.setAttribute("data-col-number", (i + 1).toString());
    col.classList.add("table-column");
    col.style.setProperty("--width", "auto");
    colgroup.appendChild(col);
  }
  table.prepend(colgroup);
}
function createSliderNob(borderWidth) {
  const div = document.createElement("div");
  div.classList.add("table-column-slider");
  div.style.setProperty("--border-width", `${borderWidth}px`);
  div.addEventListener("pointerdown", (e) => {
    console.log("pointerdown");
    console.log(e);
    startPoint.x = e.clientX;
    startPoint.y = e.clientY;
    const parentCell = div.closest("th, td");
    const parentRow = div.closest("tr");
    const parentTable = div.closest("table");
    if (parentCell === null || parentRow === null || parentTable === null) {
      return;
    }
    const colIndex = [...parentRow.children].indexOf(parentCell);
    const colCandidate = [...parentTable.querySelectorAll("col")][colIndex];
    if (colCandidate === void 0) {
      throw new Error("colCandidate is undefined");
    }
    currentCol = colCandidate;
    currentColIndex = colIndex;
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("pointerup", () => {
      console.log("pointerup");
      document.removeEventListener("mousemove", mouseMoveHandler);
      const table = div.closest("table");
      if (table === null || currentColIndex === null) {
        return;
      }
      updateColWidth(table, currentColIndex);
    }, { once: true });
  });
  return div;
}
function setCellStyle(cell) {
  cell.style.position = "relative";
}

// src/main.ts
function main() {
  const tables = getTables();
  if (tables.length === 0) {
    return;
  }
  for (const table of tables) {
    const firstRow = getFirstRow(table);
    for (const cell of getCells(firstRow)) {
      const borderRightWidth = calcBorderRightWidth(cell);
      const nob = createSliderNob(borderRightWidth);
      cell.appendChild(nob);
      setCellStyle(cell);
    }
    insertColGroup(table);
    setOriginalWidth(table);
  }
  document.head.appendChild(createSliderStyle());
}
main();
