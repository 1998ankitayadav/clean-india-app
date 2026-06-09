import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";


function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [priority, setPriority] = useState("Medium");
  const [reports, setReports] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const API = import.meta.env.VITE_API_URL;
  const fetchReports = async () => {
    try {
      const res = await axios.get(
         `${API}/api/reports`
      );
      setReports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);
   const filteredReports = reports.filter((report) => {
  const matchesSearch =
    report.title
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    report.description
      .toLowerCase()
      .includes(search.toLowerCase());
  
    const matchesCategory =
    filterCategory === "All" ||
    report.category === filterCategory;

    return matchesSearch && matchesCategory;
   });
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        alert("Location access denied");
      }
    );
  };
const handleSubmit = async () => {
  if (!title || !description) {
    alert("Please fill all fields");
    return;
  }

  try {
    let imageUrl = "";

    // Step 1: Upload image if selected
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(
        `${API}/api/upload`,
        formData,
          {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      imageUrl = uploadRes.data.imageUrl;
    }

    // Step 2: Send report to backend
    await axios.post(
      `${API}/api/reports/add`,
      {
        title,
        description,
        category,
        priority,
        latitude,
        longitude,
        image: imageUrl, // ✅ IMPORTANT ADD
      }
    );

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("Garbage");
    setPriority("Medium");
    setLatitude(null);
    setLongitude(null);
    setImage(null);
    setPreview("");

    fetchReports();
  } catch (error) {
    console.log(error);
  }
};


  const deleteReport = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
       `${API}/api/reports/${id}`
      );
      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  const markResolved = async (id) => {
    try {
      await axios.put(
       `${API}/api/reports/${id}` 
      );
      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case "Garbage":
        return "🗑️";
      case "Pothole":
        return "🕳️";
      case "Street Light":
        return "💡";
      case "Water Leakage":
        return "🚰";
      default:
        return "📌";
    }
  };

  return (
    <div className="app">
      <h1 className="title">
        🇮🇳 Clean India Civic App
      </h1>
      <div className="dashboard">
  <div className="dashboard-card">
    <h3>{reports.length}</h3>
    <p>Total Reports</p>
  </div>

  <div className="dashboard-card">
    <h3>
      {reports.filter(
        (r) => r.status === "Pending"
      ).length}
    </h3>
    <p>Pending</p>
     </div>

        <div className="dashboard-card">
        <h3>
        {reports.filter(
        (r) => r.status === "Resolved"
         ).length}
        </h3>
       <p>Resolved</p>
     </div>
     <div className="dashboard-card">
  <h3>
    {
      reports.filter(
        (r) => r.priority === "High"
      ).length
    }
  </h3>
  <p>High Priority</p>
</div>

     </div>  
      <div className="form-card">
        <h2>Report an Issue</h2>

        <input
          className="input"
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="textarea"
          placeholder="Describe the issue"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);

            if (file) {
            setPreview(URL.createObjectURL(file));
            }
           }}
         />
           {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
            width: "100%",
            maxHeight: "250px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px",
         }}
         />
         )}
        <select
          className="input"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>Garbage</option>
          <option>Pothole</option>
          <option>Street Light</option>
          <option>Water Leakage</option>
          <option>Other</option>
        </select>

        <select
          className="input"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          className="submit-btn"
          onClick={getLocation}
          style={{ marginBottom: "10px" }}
        >
          📍 Get Current Location
        </button>

        {latitude && longitude && (
          <p style={{ marginBottom: "10px" }}>
            ✅ Location Captured
          </p>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
        >
          Submit Report
        </button>
      </div>

      <h2 className="report-list-title">
        All Reports
      </h2>
      <input
  className="input"
  type="text"
  placeholder="🔍 Search reports..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  />

  <select
  className="input"
  value={filterCategory}
  onChange={(e) =>
    setFilterCategory(e.target.value)
  }
    >
  <option>All</option>
  <option>Garbage</option>
  <option>Pothole</option>
  <option>Street Light</option>
  <option>Water Leakage</option>
  <option>Other</option>
    </select> 

      {reports.length === 0 ? (
        <p className="no-reports">
          No reports found.
        </p>
      ) : (
        filteredReports.map((r) => (
          <div
            className="report-card"
            key={r._id}
          >
            <h3>
              {getCategoryEmoji(r.category)}{" "}
              {r.title}
            </h3>

            <p>{r.description}</p>
            {r.image && (
            <img
             src={r.image}
             alt="Issue"
             className="report-image"
            />
            )}

            <p>
              <strong>Category:</strong>{" "}
              {r.category}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {r.priority === "High"
                ? "🔴 High"
                : r.priority === "Medium"
                ? "🟠 Medium"
                : "🟢 Low"}
            </p>

            <p
              className={`status ${
                r.status === "Resolved"
                  ? "resolved"
                  : "pending"
              }`}
            >
              {r.status === "Resolved"
                ? "🟢 Resolved"
                : "🟡 Pending"}
            </p>

            {r.latitude && r.longitude && (
          <>
        <p>
         📍 {r.latitude.toFixed(4)},
          {r.longitude.toFixed(4)}
        </p>

         <a
            href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="map-btn"
           >
          View on Map
          </a>
          </>
          )}

            <small>
              {new Date(
                r.createdAt
              ).toLocaleString()}
            </small>

            <div className="card-footer">
              {r.status !== "Resolved" && (
                <button
                  className="resolve-btn"
                  onClick={() =>
                    markResolved(r._id)
                  }
                >
                  Mark Resolved
                </button>
              )}

              <button
                className="delete-btn"
                onClick={() =>
                  deleteReport(r._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;  