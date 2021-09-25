export function getTables(): HTMLTableElement[] {
  return [...document.querySelectorAll<HTMLTableElement>("table")];
}

function getFirstRow(table: HTMLTableElement): HTMLTableRowElement {
  const tr = table.querySelector("tr");
  if (tr == null) {
    throw new Error("table doesn't have any tr");
  }

  return tr;
}

function getCells(row: HTMLTableRowElement): HTMLTableCellElement[] {
  return [...row.querySelectorAll<HTMLTableCellElement>("th, td")];
}

export function getEditableCells(
  table: HTMLTableElement
): HTMLTableCellElement[] {
  const extractCells = (tr: HTMLTableRowElement): HTMLTableCellElement[] => {
    const cells = tr.querySelectorAll<HTMLTableCellElement>("th, td");
    return [...cells].slice(0, cells.length - 1);
  };

  // ==========================================================================

  const firstRow = getFirstRow(table);
  return extractCells(firstRow);
}

const BAR_WIDTH = 10;
export function createSliderStyle(): HTMLStyleElement {
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

export function calcBorderRightWidth(cell: HTMLTableCellElement): number {
  const style = window.getComputedStyle(cell);

  return parseInt(style.borderRightWidth);
}

type Data = {
  cols: HTMLTableColElement[];
  firstRowCells: HTMLTableCellElement[];
};

function getData(table: HTMLTableElement): Data {
  const firstRow = getFirstRow(table);

  return {
    cols: [...table.querySelectorAll("col")],
    firstRowCells: getCells(firstRow),
  };
}

const startPoint = { x: NaN, y: NaN };
let currentCol: HTMLTableColElement | null = null;
let currentColIndex: number | null = null;
export function setOriginalWidth(table: HTMLTableElement): void {
  const data = getData(table);

  for (let i = 0; i < data.cols.length; i++) {
    const col = data.cols[i];
    const cell = data.firstRowCells[i];
    col.style.setProperty("--original-width", `${cell.offsetWidth}px`);
  }
}

function updateColWidth(table: HTMLTableElement, colIndex: number): void {
  const data = getData(table);

  const col = data.cols[colIndex];
  const cell = data.firstRowCells[colIndex];

  const width = `${cell.offsetWidth}px`;
  col.style.setProperty("--original-width", width);
  col.style.setProperty("--width", width);
}

function setColWidth(delta: number): void {
  if (currentCol === null) {
    return;
  }

  currentCol.style.setProperty(
    "--width",
    `max(calc(var(--original-width) + ${delta}px), 1em)`
  );
}

function mouseMoveHandler(e: MouseEvent): void {
  e.preventDefault();
  console.log("mousemove");
  const delta = e.clientX - startPoint.x;
  console.log(`delta: {x: ${delta}}`);
  setColWidth(delta);
}

export function insertColGroup(table: HTMLTableElement): void {
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

export function createSliderNob(borderWidth: number): HTMLDivElement {
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
    if (colCandidate === undefined) {
      throw new Error("colCandidate is undefined");
    }
    currentCol = colCandidate;
    currentColIndex = colIndex;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener(
      "pointerup",
      () => {
        console.log("pointerup");
        document.removeEventListener("mousemove", mouseMoveHandler);

        const table = div.closest("table");
        if (table === null || currentColIndex === null) {
          return;
        }
        updateColWidth(table, currentColIndex);
      },
      { once: true }
    );
  });

  return div;
}

export function setCellStyle(cell: HTMLTableCellElement): void {
  cell.style.position = "relative";
}
