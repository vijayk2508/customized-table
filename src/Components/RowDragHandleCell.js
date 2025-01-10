import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";

const RowDragHandleCell = (props) => {
  const { rowId } = props;
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    <button {...attributes} {...listeners} className="btn">
      🟰
    </button>
  );
};

RowDragHandleCell.propTypes = {
  rowId: PropTypes.any,
};

export default RowDragHandleCell;
