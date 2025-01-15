import PropTypes from "prop-types";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import React from "react";
import DraggableTableHeader from "./DraggableTableHeader";

function TableHeader({ table, columnOrder }) {
  return (
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
  );
}

TableHeader.propTypes = {
  columnOrder: PropTypes.array.isRequired,
  table: PropTypes.object.isRequired,
};

export default TableHeader;
