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

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.li`
  margin-right: 1.5rem;
  &:last-child {
    margin-right: 0;
  }
`;

const NavLinkStyles = `
  color: ${theme.colors.text};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${theme.colors.secondary};
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  &:hover {
    color: ${theme.colors.text};
  }
`;

const NavLink = styled(Link)`
  ${NavLinkStyles}
`;

const LogoutButton = styled.button`
  ${NavLinkStyles}
  font-family: inherit;
  outline: none;

  &:hover,
  &:focus,
  &:active {
    color: ${theme.colors.text};
    background: none;
    border: none;
    outline: none;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  text-decoration: none;
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
        <NavItems>
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
        </NavItems>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
