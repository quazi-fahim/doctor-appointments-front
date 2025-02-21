import React from "react";
import {  Routes, Route, Link } from "react-router-dom";
import Home from "./Component/Home";
import ListofDoctor from "./Component/ListofDoctor";
import Booking from "./Component/Booking";
import Appointmentlist from "./Component/Appointmentlist";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import AppointmentDetail from "./Component/AppointmentDetail";




const App = () => {
    return (
        <Box>
        <Flex justify="space-between" mb={4}>
        <Heading>Doctor Appointment System</Heading>
        <Flex gap={3}>
          <Button as={Link} to="/">Home</Button>
          <Button as={Link} to="/listofdoctor">Doctors</Button>
          <Button as={Link} to="/appointments">Appointments</Button>
        </Flex>
      </Flex>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listofdoctor" element={<ListofDoctor />} />
                <Route path="/book/:doctorId" element={<Booking />} />

                <Route path="/appointments" element={<Appointmentlist/>} />
                <Route path="/appointments/:id" element={<AppointmentDetail />} />
            </Routes>
            </Box> 
    );
};

export default App;
