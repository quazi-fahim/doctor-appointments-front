import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({ patientName: "", date: "", duration: "" });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });
        setAppointment(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching appointment details", error);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, formData, {
        headers: { "ngrok-skip-browser-warning": "69420" },
      });
      alert("Appointment updated successfully.");
      navigate("/"); // Navigate back to appointment list
    } catch (error) {
      console.error("Error updating appointment", error);
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Appointment Details</h2>
      <label>
        Patient Name:
        <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Date:
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
      </label>
      <br />
      <label>
        Time:
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
      </label>
      <br />
      <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
        Update
      </button>
      <button onClick={() => navigate("/")}>Cancel</button>
    </div>
  );
};

export default AppointmentDetail;
