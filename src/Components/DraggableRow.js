import { useSortable } from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import React from "react";
import DragAlongCell from "./DragAlongCell";
import { CSS } from "@dnd-kit/utilities";

const DraggableRow = ({ row }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <DragAlongCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};

DraggableRow.propTypes = {
  row: PropTypes.shape({
    getVisibleCells: PropTypes.func,
    id: PropTypes.any,
  }),
};

export default DraggableRow;
