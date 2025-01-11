import PropTypes from "prop-types";
import React from "react";

function TableLoader({ columns }) {
  return (
    <tr>
      <td colSpan={columns.length} className="position-relative">
        <div
          className="d-flex justify-content-center align-items-center position-absolute w-100 h-100"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            top: 0,
            left: 0,
          }}
        >
          <div>Loading...</div>
        </div>
      </td>
    </tr>
  );
}

TableLoader.propTypes = {
  columns: PropTypes.array,
};

export default TableLoader;
