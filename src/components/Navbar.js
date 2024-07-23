// src/components/Navbar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

const NavbarContainer = styled.nav`
  background-color: ${theme.colors.background};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavItem = styled.li`
  margin-right: 1.5rem;
  &:last-child {
    margin-right: 0;
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${(props) =>
      props.isActive ? theme.colors.primary : theme.colors.secondary};
    transition: width 0.3s ease;
  }

  &:hover:after,
  &.active:after {
    width: 100%;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  text-decoration: none;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <NavbarContainer>
      <NavList>
        <Logo to="/home">Photobook</Logo>
        <div style={{ display: "flex" }}>
          <NavItem>
            <NavLink to="/home" isActive={location.pathname === "/home"}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create" isActive={location.pathname === "/create"}>
              Create
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/view" isActive={location.pathname === "/view"}>
              View
            </NavLink>
          </NavItem>
          <NavItem>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </NavItem>
        </div>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
