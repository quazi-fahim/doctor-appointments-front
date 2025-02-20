import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Input, Text, Flex } from "@chakra-ui/react";

const Home = () => {
    const [name, setName] = useState("");
    
    const navigate = useNavigate();

    const handleContinue= () => {
        if (!name.trim()) {
            alert("Please enter your name.");
            return;
        }
        localStorage.setItem("userName", name);
        
        navigate('listofdoctor');
    };




    return (
        <Box textAlign="center" mt={10}>
            <Text fontSize="2xl" fontWeight="bold">Book Your Appointment</Text>

            <Flex direction="column" align="center" mt={5} gap={4}>
                <Input 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    w={["80%", "60%", "40%"]}
                />
                
                <Flex gap={4} w={["80%", "60%", "40%"]} justify="center">
                    <Button colorScheme="blue" flex="1" onClick={handleContinue}>
                        Continue
                    </Button>
                   
                </Flex>
            </Flex>
        </Box>
    );
};

export default Home;
