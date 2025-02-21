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
           <Flex
      as="nav"
      bg="blue.600"
      color="white"
      px={6}
      py={3}
      justify="space-between"
      align="center"
      boxShadow="md"
    >
      <Heading size="md">Doctor Appointment System</Heading>

      <Flex gap={4}>
        <Button as={Link} to="/" colorScheme="teal" variant="ghost">
          Home
        </Button>
        <Button as={Link} to="/listofdoctor" colorScheme="teal" variant="ghost">
          Doctors
        </Button>
        <Button as={Link} to="/appointments" colorScheme="teal" variant="ghost">
          Appointments
        </Button>
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
