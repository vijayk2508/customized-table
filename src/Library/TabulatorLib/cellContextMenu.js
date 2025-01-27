import { addRowMenu } from "./TabulatorHelper";

function copy(_e, cell) {
  const cellValue = cell.getValue(); // Get the cell value
  const cellElement = cell.getElement();

  // Get only content-related styles (exclude width, height, padding, margin)
  const cellStyle = cellElement.style.cssText
    .split(";")
    .filter(
      (style) =>
        !style.includes("width") &&
        !style.includes("height") &&
        !style.includes("padding") &&
        !style.includes("margin")
    )
    .join(";");

  const copiedData = { value: cellValue, style: cellStyle };

  // Store the copied data in clipboard
  navigator.clipboard
    .writeText(JSON.stringify(copiedData))
    .then(() => {
      console.log("Copied to clipboard:", copiedData);

      // Highlight the cell by adding a CSS class
      cellElement.classList.add("highlight-border");

      // Remove the highlight after 2 seconds
      setTimeout(() => {
        cellElement.classList.remove("highlight-border");
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text to clipboard:", err);
    });
}

function paste(e, cell) {
  // Skip pasting if the column is an "ID" column
  if (cell.getColumn().getField() === "id") {
    console.log("Cannot paste into ID column.");
    return; // Do nothing if the column is "ID"
  }

  navigator.clipboard
    .readText()
    .then((text) => {
      const copiedData = JSON.parse(text); // Parse the copied data
      cell.setValue(copiedData.value); // Set the copied value
      const cellElement = cell.getElement();

      // Preserve the current width and height before applying styles
      const currentWidth = cellElement.style.width;
      const currentHeight = cellElement.style.height;

      // Apply the copied style (content-related styles, excluding layout styles)
      const newStyle = copiedData.style
        .split(";")
        .filter(
          (style) =>
            !style.includes("width") &&
            !style.includes("height") &&
            !style.includes("padding") &&
            !style.includes("margin")
        )
        .join(";");

      cellElement.style.cssText = newStyle;

      // Restore the width and height of the cell
      cellElement.style.width = currentWidth;
      cellElement.style.height = currentHeight;
    })
    .catch((err) => {
      console.error("Failed to paste text from clipboard:", err);
    });
}

export const cellContextMenu = function (_e) {
  return [
    ...addRowMenu,
    {
      label: "Copy",
      action: copy,
    },
    {
      label: "Paste",
      action: paste,
    },
    {
      label: "Reset Value",
      action: function (e, cell) {
        cell.setValue(""); // Resets the cell's value
        const cellElement = cell.getElement();
        cellElement.style.cssText = ""; // Remove any applied styles
      },
    },
  ];
};
