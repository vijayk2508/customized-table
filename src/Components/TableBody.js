import PropTypes from "prop-types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import DraggableRow from "./DraggableRow";
import TableLoader from "./TableLoader";

function TableBody({ table, columnOrder, loading }) {
  return (
    <SortableContext
      items={table.getRowModel().rows.map((row) => `row-${row.id}`)}
      strategy={verticalListSortingStrategy}
    >
      <tbody style={{ minHeight: "500px",  height: "500px" }}>
        {loading ? (
          <TableLoader columns={columnOrder}/>
        ) : (
          table
            .getRowModel()
            .rows.map((row) => (
              <DraggableRow key={row.id} row={row} columnOrder={columnOrder} />
            ))
        )}
      </tbody>
    </SortableContext>
  );
}

TableBody.propTypes = {
  columnOrder: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  table: PropTypes.object.isRequired,
};

export default TableBody;
