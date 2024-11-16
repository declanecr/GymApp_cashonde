import { Container } from "@mui/material";
import React from "react";
import forearm from '../images/exercise-icons/forearm.svg';

const PngButton =()=>{

    const handleClick = () => {
        alert('Button clicked!');
      };
    return(
        <Container>
            <button
                    onClick={handleClick}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                    }}
                    >
                    <img
                        src={forearm}
                        alt="Button Image"
                        style={{
                        width: '100px', // Adjust size as needed
                        height: 'auto',
                        borderRadius: '8px', // Optional styling
                        }}
                    />
            </button>
        </Container>
    )
};
export default PngButton;