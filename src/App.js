// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Authentication from "./components/Authentication";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ViewPhotobooks from "./components/ViewPhotobooks";
import CreatePhotobook from "./components/CreatePhotobook";
import SinglePhotobook from "./components/SinglePhotobook";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Authentication />}
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePhotobook />
            </PrivateRoute>
          }
        />
        <Route
          path="/view"
          element={
            <PrivateRoute>
              <ViewPhotobooks />
            </PrivateRoute>
          }
        />
        <Route path="/photobook/:id" element={<SinglePhotobook />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Router>
            <AppRoutes />
          </Router>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
