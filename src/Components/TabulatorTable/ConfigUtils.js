import { createRoot } from "react-dom/client";

// .prettierignore    (to keep relevant props together)
const NOOPS = () => {};

function syncRender(comp, el) {
  return new Promise((resolve, reject) => {
    try {
      const root = createRoot(el);
      root.render(comp);
      resolve(el); // Resolve immediately after rendering
    } catch (error) {
      reject(error);
    }
  });
}

// get callbacks from props (default: NOOP) to set them to Tabulator options later.
export const propsToOptions = async (props) => {
  const output = {};

  const defaultOptions = [
    "height",
    "layout",
    "layoutColumnsOnNewData",
    "columnMinWidth",
    "columnVertAlign",
    "resizableColumns",
    "resizableRows",
    "autoResize",
    "tooltips",
    "tooltipsHeader",
    "tooltipGenerationMode",
    "initialSort",
    "initialFilter",
    "initialHeaderFilter",
    "footerElement",
    "index",
    "keybindings",
    "clipboard",
    "clipboardCopyStyled",
    "clipboardCopySelector",
    "clipboardCopyFormatter",
    "clipboardCopyHeader",
    "clipboardPasteParser",
    "clipboardPasteAction",
    "rowFormatter",
    "placeholder",
    "selectable",
  ];

  for (const opt of defaultOptions) {
    if (typeof props[opt] !== "undefined") {
      output[opt] = props[opt];
    }
  }

  const callbackNames = [
    "tableBuilt",
    "rowClick",
    "rowDblClick",
    "rowContext",
    "rowTap",
    "rowDblTap",
    "rowTapHold",
    "rowAdded",
    "rowDeleted",
    "rowMoved",
    "rowUpdated",
    "rowSelectionChanged",
    "rowSelected",
    "rowDeselected",
    "rowResized",
    "cellClick",
    "cellDblClick",
    "cellContext",
    "cellTap",
    "cellDblTap",
    "cellTapHold",
    "cellEditing",
    "cellEditCancelled",
    "columnMoved",
    "columnResized",
    "columnTitleChanged",
    "columnVisibilityChanged",
    "htmlImporting",
    "htmlImported",
    "dataLoading",
    "dataLoaded",
    "ajaxRequesting",
    "ajaxResponse",
    "dataFiltering",
    "dataFiltered",
    "dataSorting",
    "dataSorted",
    "renderStarted",
    "renderComplete",
    "pageLoaded",
    "localized",
    "dataGrouping",
    "dataGrouped",
    "groupVisibilityChanged",
    "groupClick",
    "groupDblClick",
    "groupContext",
    "groupTap",
    "groupDblTap",
    "groupTapHold",
    "movableRowsSendingStart",
    "movableRowsSent",
    "movableRowsSentFailed",
    "movableRowsSendingStop",
    "movableRowsReceivingStart",
    "movableRowsReceived",
    "movableRowsReceivedFailed",
    "movableRowsReceivingStop",
    "validationFailed",
    "clipboardCopied",
    "clipboardPasted",
    "clipboardPasteError",
    "downloadReady",
    "downloadComplete",
  ]; // don't add "selectableCheck" here, it will break "rowSelectionChanged"

  for (const callbackName of callbackNames) {
    if (typeof props[callbackName] !== "undefined") {
      output[callbackName] = props[callbackName] || NOOPS;
    }
  }
  if (typeof props["footerElement"] === "object") {
    // convert from JSX to HTML string (tabulator's footerElement accepts string)
    const el = await syncRender(
      props["footerElement"],
      document.createElement("div")
    );
    output["footerElement"] = el.innerHTML;
  }
  return output;
};
