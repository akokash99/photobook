// src/components/Authentication.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const Authentication = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (user) {
    return <AuthContainer>Redirecting to home...</AuthContainer>;
  }

  return (
    <AuthContainer>
      <h1>Welcome to Photobook Creator</h1>
      <LoginButton onClick={handleLogin}>Sign in with Google</LoginButton>
    </AuthContainer>
  );
};

export default Authentication;
