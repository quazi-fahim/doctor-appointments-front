import { Box, Button, Text, Select } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAppointments } from "../Appointmentcontext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const { doctor, bookAppointment } = useAppointments();
 
  const { doctorId } = useParams();
  const selectedDoctor = doctor.find((doc) => doc._id === doctorId);

  const doctorName = selectedDoctor ? selectedDoctor.name : "Doctor not found";
  const [selectDate, setSelectDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

 
  // Fetch available time slots for the selected date
  useEffect(() => {
     
    const fetchSlots = async () => {
      try {
        const formattedDate = selectDate.toISOString().split("T")[0]; // YYYY-MM-DD format
        console.log("Formatted Date:", formattedDate);

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}/slots?date=${formattedDate}`,{
            headers: {
                "ngrok-skip-browser-warning": "69420"
            }
          }
        );

        const slots = response.data;
        console.log("Available Slots Response:", slots);
        setAvailableSlots(slots || []);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchSlots();
   
  }, [selectDate]);

  // Handle Appointment Booking
  const handleBooking = () => {
    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }

    bookAppointment(doctorId, selectDate, selectedTime);   
    navigate('/appointments');
  };

  return (

    <div style={{ textAlign: "center", display:'flex', justifyContent:"center", flexDirection:"column", alignItems:'center', padding:"20px" }}>
    <h2 style={{marginBottom:"30px"}}>Book an Appointment with <strong>{doctorName}</strong></h2>

    {/* Calendar */}
    <Calendar
      onChange={setSelectDate}
      value={selectDate}
      minDate={new Date()}
      maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
    />

    <p style={{ marginTop: "10px" }}>Selected Date: {selectDate.toDateString()}</p>

    {/* Time Slot Selector */}
    <select
      value={selectedTime}
      onChange={(e) => setSelectedTime(e.target.value)}
      style={{ marginTop: "10px", padding: "5px", fontSize: "16px" }}
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

    {/* Booking Button */}
    <button
      onClick={handleBooking}
      disabled={!selectedTime}
      style={{
        marginTop: "15px",
        padding: "10px 15px",
        fontSize: "16px",
        backgroundColor: selectedTime ? "blue" : "gray",
        color: "white",
        border: "none",
        cursor: selectedTime ? "pointer" : "not-allowed",
      }}
    >
      Confirm Appointment
    </button>
  </div>  

  );
};

export default Booking;
