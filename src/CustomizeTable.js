import PropTypes from "prop-types";
import React, { useMemo, useState, useEffect, memo } from "react";
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
import { arrayMove } from "@dnd-kit/sortable";
import TableHeader from "./Components/TableHeader";
import TableFooter from "./Components/TableFooter";
import TableBody from "./Components/TableBody";

function CustomizeTable({ fetchData, columns: customColumns = [] }) {
  const columns = useMemo(
    () => [
      {
        id: "drag-handle",
        header: "",
        cell: ({ row }) => {
          return row.index + 1;
        },
        size: 60,
      },
      ...customColumns,
    ],
    [customColumns]
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
    columnResizeMode: "onChange",
  });

  // reorder columns and rows after drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (typeof active.id !== "string" || typeof over.id !== "string") return;

    if (active.id.startsWith("column-") && over.id.startsWith("column-")) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    } else if (active.id.startsWith("row-") && over.id.startsWith("row-")) {
      setData((data) => {
        const oldIndex = data.findIndex(
          (row) => row.id === parseInt(active.id.split("-")[1])
        );
        const newIndex = data.findIndex(
          (row) => row.id === parseInt(over.id.split("-")[1])
        );
        return arrayMove(data, oldIndex, newIndex);
      });
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
        <table className="table table-bordered" style={{ height: 500 }}>
          <TableHeader {...{ table, columnOrder }} />
          <TableBody {...{ table, columnOrder, loading }} />
          <TableFooter {...{ table, columnOrder }} />
        </table>
      </div>
    </DndContext>
  );
}

CustomizeTable.propTypes = {
  columns: PropTypes.array,
  fetchData: PropTypes.func.isRequired,
};

export default memo(CustomizeTable);
