import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";

const RowDragHandleCell = (props) => {
  const { rowId, icon: Icon = null } = props;
  const { attributes, listeners } = useSortable({ id: rowId });

  return (
    <button {...attributes} {...listeners} className="btn">
      {Icon ? <Icon /> : "🟰"}
    </button>
  );
};

RowDragHandleCell.propTypes = {
  icon: PropTypes.elementType, // Ensure icon is a valid React component
  rowId: PropTypes.any,
};

export default RowDragHandleCell;