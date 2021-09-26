import {
  getTables,
  setCellStyle,
  createSliderStyle,
  insertColGroup,
  createSliderNob,
  calcBorderRightWidth,
  setOriginalWidth,
  getFirstRow,
  getCells,
} from "./lib.js";

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
