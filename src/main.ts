import { getTables, getHeaderCells, init } from "./lib.js";

function main() {
  const tables = getTables();

  if (tables.length === 0) {
    return;
  }

  for (const table of tables) {
    const targetCells = getHeaderCells(table);

    for (const cell of targetCells) {
      init(cell);
    }
  }
}

main();
