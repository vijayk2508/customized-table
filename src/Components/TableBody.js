import PropTypes from "prop-types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useMemo } from "react";
import DraggableRow from "./DraggableRow";
import TableLoader from "./TableLoader";

function TableBody({ table, columnOrder, loading }) {
  const rows = table.getRowModel().rows;

  let content = useMemo(() => {
    if (loading) {
      return <TableLoader columns={columnOrder} />;
    } else if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={columnOrder.length} className="text-center align-middle">
            No data available
          </td>
        </tr>
      );
    } else {
      return rows.map((row) => (
        <DraggableRow key={row.id} row={row} columnOrder={columnOrder} />
      ));
    }
  }, [columnOrder, loading, rows]);

  return (
    <SortableContext
      items={rows.map((row) => row.id)} // Ensure the item IDs are unique (row.id directly)
      strategy={verticalListSortingStrategy}
    >
      <tbody>{content}</tbody>
    </SortableContext>
  );
}

TableBody.propTypes = {
  columnOrder: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  table: PropTypes.object.isRequired,
};

export default TableBody;