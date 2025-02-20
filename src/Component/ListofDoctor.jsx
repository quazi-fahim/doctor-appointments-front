import { Box, Button, Text } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useAppointments } from "../Appointmentcontext";
import { useEffect } from "react";


const ListofDoctor = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    let patientName = localStorage.getItem("userName");
    if(!patientName){
      navigate('/');
    }
  }, []);

  const { doctor, loading } = useAppointments(); 

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box>
      {doctor?.length > 0 ? (
        doctor.map((doctor) => (
          <Box key={doctor._id} p={4} borderWidth="1px" borderRadius="lg" w="full">
            <Text fontSize="xl">{doctor.name}</Text>
         
            
            <Button mt={2} onClick={() => navigate(`/book/${doctor._id}`)}>Select
                
            </Button>
          </Box>
        ))
      ) : (
        <Text>No doctors available</Text>
      )}
    </Box>
  );
};

export default ListofDoctor;
