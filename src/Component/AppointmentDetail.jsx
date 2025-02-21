import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({ patientName: "", date: "", duration: "" });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });

        const appointmentData = response.data;

        // Format the time to HH:mm (24-hour format)
        const formattedTime = new Date(`1970-01-01T${appointmentData.duration}`).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit", hour12: false }
        );

        setAppointment(appointmentData);
        setFormData({ ...appointmentData, duration: formattedTime });
        setSelectedDate(new Date(appointmentData.date));
      } catch (error) {
        console.error("Error fetching appointment details", error);
      }
    };

    fetchAppointment();
  }, [id]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctors/${appointment?.doctorId}/slots?date=${formattedDate}`,
          { headers: { "ngrok-skip-browser-warning": "69420" } }
        );

        setAvailableSlots(response.data || []);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    if (appointment?.doctorId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, appointment?.doctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, formData, {
        headers: { "ngrok-skip-browser-warning": "69420" },
      });
      alert("Appointment updated successfully.");
      navigate("/appointments");
    } catch (error) {
      console.error("Error updating appointment", error);
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>Appointment Details</h2>

      <label>
        Patient Name:
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </label>

      <br />

      <h3>Select Date</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        minDate={new Date()} // Block past dates
        maxDate={new Date(new Date().setDate(new Date().getDate() + 7))} // Next 7 days
      />

      <p style={{ marginTop: "10px" }}>Selected Date: {selectedDate.toDateString()}</p>

      <label>
        Available Time Slot:
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        >
          <option value="">Select available time slot</option>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))
          ) : (
            <option disabled>No slots available</option>
          )}
        </select>
      </label>

      <br />

      <button
        onClick={handleUpdate}
        style={{
          background: "black",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          width: "100%",
        }}
      >
        Update Appointment
      </button>
    </div>
  );
};

export default AppointmentDetail;
