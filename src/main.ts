import {
  getTables,
  getEditableCells,
  setCellStyle,
  createSliderStyle,
  insertColGroup,
  createSliderNob,
  calcBorderRightWidth,
  setOriginalWidth,
} from "./lib.js";

function main() {
  const tables = getTables();

  if (tables.length === 0) {
    return;
  }

  for (const table of tables) {
    const targetCells = getEditableCells(table);

    for (const cell of targetCells) {
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
