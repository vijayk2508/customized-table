import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

const DraggableTableHeader = ({ header }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      className="text-center"
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
};

DraggableTableHeader.propTypes = {
  header: PropTypes.shape({
    colSpan: PropTypes.any,
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        header: PropTypes.any,
      }),
      getSize: PropTypes.func,
      id: PropTypes.string,
    }),
    getContext: PropTypes.func,
    isPlaceholder: PropTypes.any,
  }),
};

export default DraggableTableHeader;
