import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../services";
import API_URLS from "../../services/API_URLS";
import { Link } from "react-router";

function LandingPage() {
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState("");

  // Function to fetch all tables
  const fetchTables = async () => {
    try {
      const res = await axiosInstance.get(API_URLS.TABLES.GET_TABLES); // Assuming this API endpoint exists to get all tables
      setTables(res.data); // Assuming the response contains the list of tables
    } catch (error) {
      setMessage("Failed to load tables. Please try again later.");
    }
  };

  // Effect to load tables initially
  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tabulator Tables</h2>

      {/* Top Button to Fetch Tables */}
      <button style={styles.fetchButton} onClick={fetchTables}>
        Refresh
      </button>

      {/* Show Tables List */}
      {tables.length > 0 ? (
        <ul style={styles.tableList}>
          {tables.map((table) => (
            <li key={table._id} style={styles.tableItem}>
              <Link to={`/table/${table._id}`} style={styles.link}>
                {table.tableName}{" "}
                {/* Adjust the property name based on your actual data */}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.message}>No tables available.</p>
      )}

      {/* Message for errors or success */}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  fetchButton: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-end", // Button at the top right corner
    marginBottom: "20px",
  },
  tableList: {
    listStyleType: "none",
    padding: "0",
    width: "100%",
  },
  tableItem: {
    backgroundColor: "#f4f4f4",
    margin: "10px 0",
    padding: "15px",
    borderRadius: "5px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  message: {
    color: "#f44336",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default LandingPage;
