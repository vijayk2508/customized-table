import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
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
} from "@dnd-kit/sortable";
import DraggableTableHeader from "./Components/DraggableTableHeader";
import DraggableRow from "./Components/DraggableRow";
import RowDragHandleCell from "./Components/RowDragHandleCell";

function CustomizeTable({ fetchData }) {
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((c) => c.id)
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchData();
      setData(result);
      setLoading(false);
    }
    loadData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnOrder },
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
        {loading ? (
          <div>Loading...</div>
        ) : (
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
        )}
      </div>
    </DndContext>
  );
}

CustomizeTable.propTypes = {
  fetchData: PropTypes.func.isRequired,
};

export default CustomizeTable;
