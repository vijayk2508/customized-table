import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";

const RowDragHandleCell = (props) => {
  const { row } = props;
  const data = useSortable({ id: `row-${row.id}` });

  const { attributes, listeners } = data;
  return (
    <span {...attributes} {...listeners}>
      {row.index + 1}
    </span>
  );
};

RowDragHandleCell.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    index: PropTypes.number,
  }),
};

export default RowDragHandleCell;
