// src/pages/Home.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const UserInfo = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <HomeContainer>
      <h1>Welcome to Photobook Creator</h1>
      {user && (
        <UserInfo>
          <h2>User Information</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </UserInfo>
      )}
      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </HomeContainer>
  );
};

export default Home;
