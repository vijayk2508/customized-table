import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "../fakeDate/makeData";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  useSortable,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Drag handle component
const RowDragHandleCell = ({ rowId }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    <button {...attributes} {...listeners} style={{ cursor: "grab" }}>
      🟰
    </button>
  );
};

// Draggable row component
const DraggableRow = ({ row }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id, // Use row's ID directly here
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Main table component
function RowOrder() {
  const columns = useMemo(
    () => [
      {
        id: "drag-handle",
        header: "Move",
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
      },
    ],
    []
  );

  const [data, setData] = useState(() => makeData(20));
console.log(data);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id, // Make sure each row has a unique `id`
  });

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    console.log({ active, over });
  
    if (!over || active.id === over.id) return;

    setData((oldData) => {
      const oldIndex = oldData.findIndex((row) => `${row.id}` === active.id);
      const newIndex = oldData.findIndex((row) => `${row.id}` === over.id);
      return arrayMove(oldData, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <SortableContext
            items={data.map((row) => row.id)} // Ensure the item IDs are unique (use row.id)
            strategy={verticalListSortingStrategy}
          >
            {table.getRowModel().rows.map((row) => (
              <DraggableRow key={row.id} row={row} />
            ))}
          </SortableContext>
        </tbody>
      </table>
    </DndContext>
  );
}

export default RowOrder;