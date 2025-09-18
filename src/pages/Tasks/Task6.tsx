import React, { useEffect, useState } from "react";

interface LoginRecord {
  _id: string;
  browser: string;
  os: string;
  deviceType: string;
  ip: string;
  time: string;
}

const Task6: React.FC = () => {
  const [history, setHistory] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ safe read
        const response = await fetch("http://localhost:5000/api/auth/login-history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ only add if token exists
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch login history");
        }

        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="task6-container">Loading login history...</div>;
  if (error) return <div className="task6-container error">Error: {error}</div>;

  return (
    <div className="task6-container">
      <h2 className="task6-title">Your Login History</h2>
      {history.length === 0 ? (
        <p>No login records found.</p>
      ) : (
        <table className="task6-table">
          <thead>
            <tr>
              <th>Browser</th>
              <th>OS</th>
              <th>Device</th>
              <th>IP</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record._id}>
                <td>{record.browser}</td>
                <td>{record.os}</td>
                <td>{record.deviceType}</td>
                <td>{record.ip}</td>
                <td>{new Date(record.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Task6;
