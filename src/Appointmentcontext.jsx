import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'


 const Appointmentcontext = createContext({
    doctor: [],
    loading: true,
  });
  

export const AppointmentProvider = ({children})=>{
    const [doctor, setDoctor] = useState([]);
    const [appointment,setAppointment]=useState([])
    const [loading,setloading]=useState(false);
    //all doctor
    useEffect(() => {
        const fetchData = async () => {
            setloading(true);
    
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`, {
                    headers: {
                        "ngrok-skip-browser-warning": "69420"
                    }
                });
                console.log(response.data);
                setDoctor(response.data);
            } 
            catch (error) {
                console.error("Error fetching data:", error);
            }
            setloading(false);
        };
    
        fetchData();
    }, []);
    
    const bookAppointment = async (doctorId, date, duration) => {
        let patientName = localStorage.getItem("userName");
        let appointmentType = "Routine Check-Up";
        let notes = "This is a dummy note";
      
        // Convert "14:00" to total minutes (14 * 60 + 0 = 840 minutes)
        const [hours, minutes] = duration.split(":").map(Number);
        const durationInMinutes = hours * 60 + minutes; // Convert to numeric format
      
        try {
          const newAppointment = {
            doctorId,
            date,
            duration: durationInMinutes, // Now it's a number
            appointmentType,
            patientName,
            notes,
          };
      
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/appointments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(newAppointment),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
           alert("This slot is already booked.")
          console.error("Error Booking appointment", error);
        }
      };
      
  


    return(
        <Appointmentcontext.Provider value={{ doctor, appointment, loading, bookAppointment}}>
        {children}
      </Appointmentcontext.Provider>
    );

}
export const useAppointments = () => useContext(Appointmentcontext);



