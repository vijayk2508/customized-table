import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender } from "@tanstack/react-table";
import PropTypes from "prop-types";
import React from "react";

const DragAlongCell = ({ cell }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.id,
  });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td style={style} ref={setNodeRef} className="text-center">
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

DragAlongCell.propTypes = {
  cell: PropTypes.shape({
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        cell: PropTypes.any,
      }),
      getSize: PropTypes.func,
    }),
    getContext: PropTypes.func,
    id: PropTypes.any,
  }),
};
export default DragAlongCell;
