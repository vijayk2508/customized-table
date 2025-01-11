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
import RowDragHandleCell from "./Components/RowDragHandleCell";
import TableHeader from "./Components/TableHeader";
import TableBody from "./Components/TableBody";
import TableFooter from "./Components/TableFooter";

function CustomizeTable({
  fetchData,
  columns: customColumns = [],
  icon = null,
}) {
  console.log(customColumns);

  const columns = useMemo(
    () => [
      {
        id: "column-drag-handle",
        header: "",
        cell: (row) => (
          <RowDragHandleCell rowId={row.id} {...{ row }} icon={icon} />
        ),
        size: 60,
      },
      ...customColumns,
    ],
    [customColumns, icon]
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
      
        <table className="table table-bordered">
          <TableHeader {...{ table, columnOrder }} />
          <TableBody {...{ table, columnOrder, loading }} />
          <TableFooter {...{ table, columnOrder}} />
        </table>
      </div>
    </DndContext>
  );
}

CustomizeTable.propTypes = {
  columns: PropTypes.any,
  fetchData: PropTypes.func.isRequired,
  icon: PropTypes.any,
};

export default memo(CustomizeTable);
