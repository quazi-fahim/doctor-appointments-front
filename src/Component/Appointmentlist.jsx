import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });        
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });
      
      setAppointments((prevAppointments) => prevAppointments.filter((appt) => appt._id !== id));
      
      alert(`Appointment deleted successfully.`);
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>Patient:</strong> {appt.patientName || "Unknown"} <br />
              <strong>Date:</strong> {appt.date} <br />
              <strong>Time:</strong> {appt.duration || "Not specified"}
            </p>
            <button onClick={() => handleDelete(appt._id)} style={{ background: "red", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: 'pointer' }}>
              Delete Appointment
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;
