import React, { useState } from "react";
import { axiosInstance } from "../../services";
import API_URLS from "../../services/API_URLS";

function AddTable() {
  const [showInput, setShowInput] = useState(false);
  const [tableName, setTableName] = useState("");
  const [message, setMessage] = useState("");

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setTableName(e.target.value);
  };

  const handleSaveTable = () => {
    if (tableName) {
      const res = axiosInstance.post(API_URLS.TABLES.CREATE_TABLE, {
        tableName,
      });
      console.log(res);

      setMessage(`Table "${tableName}" has been saved successfully!`);
      setShowInput(false);
      setTableName(""); // Reset input after saving
    } else {
      setMessage("Please enter a valid table name.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tabulator Table</h2>
      {!showInput ? (
        <button style={styles.button} onClick={handleButtonClick}>
          Add Table
        </button>
      ) : (
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={tableName}
            onChange={handleInputChange}
            placeholder="Enter table name"
            style={styles.input}
          />
          <button style={styles.saveButton} onClick={handleSaveTable}>
            Save Table
          </button>
        </div>
      )}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50px",
    backgroundColor: "#f4f4f9", // Add background color
    padding: "20px",
    borderRadius: "8px", // Rounded corners for a smoother look
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    height: 500,
    margin: "50px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "200px", // Restrict width for a cleaner layout
  },
  saveButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
    fontWeight: "bold",
  },
};

export default AddTable;
