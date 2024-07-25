// src/styles/SinglePhotobookStyles.js
import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  text-align: center;
  margin-bottom: 30px;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

export const PhotoCard = styled.div`
  background-color: rgba(225, 227, 172, 0.15);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const PhotoImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
`;

export const PhotoInfo = styled.div`
  padding: 15px;
`;

export const PhotoTitle = styled.h3`
  margin: 0 0 10px 0;
`;

export const InfoItem = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

export const EditButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

export const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const FullScreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export const EditForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

export const GroupBySelect = styled.select`
  appearance: none;
  background-color: rgba(225, 227, 172, 0.15);
  border: 0px solid ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  padding: 12px 36px 12px 16px;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232EC4B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.3);
  }

  option {
    background: white;
    color: ${(props) => props.theme.colors.text};
    padding: 8px;
  }
`;

export const GroupByLabel = styled.label`
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => props.theme.colors.secondary};
`;

export const GroupContainer = styled.div`
  margin-bottom: 30px;
`;

export const GroupTitle = styled.h2`
  margin-bottom: 15px;
  color: ${(props) => props.theme.colors.primary};
`;
