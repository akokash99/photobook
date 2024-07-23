// src/components/Home.js
import React from "react";
import styled from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px); // Adjust based on your Navbar height
  padding: 20px;
`;

const Home = () => {
  return (
    <HomeContainer>
      <h1>Welcome to Photobook Creator</h1>
      <p>You are now logged in!</p>
      <p>Use the navigation bar above to create or view photobooks.</p>
    </HomeContainer>
  );
};

export default Home;
