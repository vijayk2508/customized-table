import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "./fakeDate/makeData";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* column order functions */
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
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.id === "column-drag-handle" ? (
        <></>
      ) : (
        <button {...attributes} {...listeners} className="btn">
          🟰
        </button>
      )}
    </th>
  );
};

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
/* column order functions */

/* row order functions */
// Cell Component
const RowDragHandleCell = (props) => {
  const { rowId } = props;
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    <button {...attributes} {...listeners} className="btn">
      🟰
    </button>
  );
};

// Row Component
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
/* row order functions */

function CustomizeTable() {
  const columns = useMemo(
    () => [
      {
        id: "column-drag-handle",
        header: "",
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} {...{ row }} />,
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        id: "column-firstName",
        size: 150,
      },
      {
        accessorFn: (row) => row.lastName,
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        id: "column-lastName",
        size: 150,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        id: "column-age",
        size: 120,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        id: "column-visits",
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        id: "column-status",
        size: 150,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        id: "column-progress",
        size: 180,
      },
    ],
    []
  );

  const [data, setData] = useState(() => makeData(20));
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((c) => c.id)
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getRowId: (row) => `row-${row.id}`,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // reorder columns and rows after drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;

    if (
      !over ||
      active?.id === "column-drag-handle" ||
      over?.id === "column-drag-handle"
    )
      return;

    if (active.id.startsWith("column-") && over.id.startsWith("column-")) {
      if (active.id !== over.id) {
        setColumnOrder((columnOrder) => {
          const oldIndex = columnOrder.indexOf(active.id);
          const newIndex = columnOrder.indexOf(over.id);
          return arrayMove(columnOrder, oldIndex, newIndex);
        });
      }
    } else if (active.id.startsWith("row-") && over.id.startsWith("row-")) {
      if (active.id !== over.id) {
        setData((data) => {
          const oldIndex = data.findIndex(
            (row) => `row-${row.id}` === active.id
          );
          const newIndex = data.findIndex((row) => `row-${row.id}` === over.id);
          return arrayMove(data, oldIndex, newIndex);
        });
      }
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="p-2">
      test
        <table className="table table-bordered">
          <thead className="thead-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <SortableContext
            items={table.getRowModel().rows.map((row) => `row-${row.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow
                  key={row.id}
                  row={row}
                  columnOrder={columnOrder}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>
    </DndContext>
  );
}

export default CustomizeTable;
