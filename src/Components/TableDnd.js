import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "bootstrap/dist/css/bootstrap.min.css";

// Initial Data
const initialColumns = ["ID", "Name", "Age", "Email"];
const initialRows = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 28, email: "charlie@example.com" },
];

export default function TableDnd() {
  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;

    if (activeType === "column") {
      setColumns((prevColumns) => {
        const oldIndex = prevColumns.indexOf(active.id);
        const newIndex = prevColumns.indexOf(over.id);
        return arrayMove(prevColumns, oldIndex, newIndex);
      });
    } else if (activeType === "row") {
      setRows((prevRows) => {
        const oldIndex = prevRows.findIndex((row) => row.id === active.id);
        const newIndex = prevRows.findIndex((row) => row.id === over.id);
        return arrayMove(prevRows, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Drag and Drop Table</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="table table-bordered">
          {/* Draggable Columns */}
          <SortableContext
            items={columns}
            strategy={horizontalListSortingStrategy}
          >
            <thead className="table-primary">
              <tr>
                {columns.map((column) => (
                  <SortableColumn key={column} id={column}>
                    {column}
                  </SortableColumn>
                ))}
              </tr>
            </thead>
          </SortableContext>

          {/* Draggable Rows */}
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {rows.map((row) => (
                <SortableRow key={row.id} id={row.id}>
                  {columns.map((column) => (
                    <td key={`${row.id}-${column}`}>{row[column.toLowerCase()]}</td>
                  ))}
                </SortableRow>
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  );
}

function SortableColumn({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: "column" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-center"
    >
      {children}
    </th>
  );
}

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: "row" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  );
}
