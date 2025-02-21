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

  // Function to convert minutes (e.g., 540) to "HH:mm" format
  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Function to convert "HH:mm" format to minutes (e.g., "12:00" → 720)
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });

        const appointmentData = response.data;

        setAppointment(appointmentData);
        setFormData({
          ...appointmentData,
          duration: convertMinutesToTime(appointmentData.duration), // Convert minutes to HH:mm
        });
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
      const formattedData = {
        ...formData,
        date: selectedDate.toISOString().split("T")[0], // Format date correctly
        duration: convertTimeToMinutes(formData.duration), // Convert HH:mm to minutes
      };

      await axios.put(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, formattedData, {
        headers: { "ngrok-skip-browser-warning": "69420" },
      });

      alert("Appointment updated successfully.");
      navigate("/appointments");
    } catch (error) {
      console.error("Error updating appointment", error.response?.data || error.message);
      alert("Failed to update appointment. Check console for details.");
    }
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>Appointment Details</h2>

      <label style={{ fontWeight: "bold", display: "block", textAlign: "left" }}>
        Patient Name:
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            margin: "5px 0",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow added
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </label>

      <h3 style={{ textAlign: "center" }}>Select Date</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()} // Block past dates
          maxDate={new Date(new Date().setDate(new Date().getDate() + 7))} // Next 7 days
        />
      </div>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        Selected Date: {selectedDate.toDateString()}
      </p>

      <label style={{ fontWeight: "bold", display: "block", textAlign: "left" }}>
        Available Time Slot:
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            margin: "10px 0",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow added
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
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
          fontWeight: "bold",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)", // Button shadow for better UI
        }}
      >
        Update Appointment
      </button>
    </div>
  );
};

export default AppointmentDetail;
