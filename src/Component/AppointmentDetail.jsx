import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({ patientName: "", date: "", duration: "" });
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });
        setAppointment(response.data);
        setFormData({
          ...response.data,
          duration: formatTime(response.data.duration), // Convert time format
        });
        fetchSlots(response.data.date); // Fetch slots for the selected date
      } catch (error) {
        console.error("Error fetching appointment details", error);
      }
    };

    fetchAppointment();
  }, [id]);

  // Fetch available slots for a selected date
  const fetchSlots = async (selectedDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/doctors/${appointment?.doctorId}/slots?date=${selectedDate}`,
        { headers: { "ngrok-skip-browser-warning": "69420" } }
      );
      setAvailableSlots(response.data || []);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  // Format time to hh:mm
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "date") {
      fetchSlots(value);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, formData, {
        headers: { "ngrok-skip-browser-warning": "69420" },
      });
      alert("Appointment updated successfully.");
      navigate("/appointments"); // Navigate back to appointment list
    } catch (error) {
      console.error("Error updating appointment", error);
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Appointment Details</h2>

      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
        Patient Name: {formData.patientName || appointment?.patientName || "Unknown"}
      </label>
      <input
        type="text"
        name="patientName"
        value={formData.patientName}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        min={new Date().toISOString().split("T")[0]} // Disable past dates
        max={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]} // Allow next 7 days
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Time:</label>
      <select
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="">Select available time slot</option>
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {formatTime(slot)}
            </option>
          ))
        ) : (
          <option disabled>No slots available</option>
        )}
      </select>

      <button
        onClick={handleUpdate}
        style={{
          background: "black",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          fontSize: "16px",
        }}
      >
        Update
      </button>
    </div>
  );
};

export default AppointmentDetail;
