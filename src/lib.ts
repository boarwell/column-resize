export function getTables(): HTMLTableElement[] {
  return [...document.querySelectorAll<HTMLTableElement>("table")];
}

export function getHeaderCells(
  table: HTMLTableElement
): HTMLTableCellElement[] {
  const getFirstRow = (table: HTMLTableElement): HTMLTableRowElement => {
    const tr = table.querySelector("tr");
    if (tr == null) {
      throw new Error("table doesn't have any tr");
    }

    return tr;
  };

  const extractCells = (tr: HTMLTableRowElement): HTMLTableCellElement[] => {
    const cells = tr.querySelectorAll<HTMLTableCellElement>("th, td");
    return [...cells];
  };

  // ==========================================================================

  const firstRow = getFirstRow(table);
  return extractCells(firstRow);
}

export function init(cell: HTMLTableCellElement): void {
  const applyStyle = (cell: HTMLTableCellElement): void => {
    cell.style.position = "relative";
  };

  const createSliderNob = (): HTMLDivElement => {
    const div = document.createElement("div");
    // TODO: styling

    nob.addEventListener("dragstart", () => {
      // TODO:
    });
    nob.addEventListener("dragend", () => {
      // TODO:
    });
    return div;
  };

  // ==========================================================================
  applyStyle(cell);
  const nob = createSliderNob();
  cell.appendChild(nob);
}
