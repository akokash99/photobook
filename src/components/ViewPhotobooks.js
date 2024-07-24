// src/components/ViewPhotobooks.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { getUserPhotobooks } from "../utils/firebaseUtils";
import { Carousel } from "react-responsive-carousel";
import { Link, useLocation } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Container = styled.div`
  max-width: 800px;
  margin: 80px auto 0;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 30px;
`;

const PhotobookList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const PhotobookItem = styled.li`
  background-color: rgba(225, 227, 172, 0.15);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PhotobookContent = styled.div`
  padding: 20px;
`;

const PhotobookTitle = styled.h2`
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: 10px;
`;

const PhotobookDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

const CarouselContainer = styled.div`
  .carousel .slide {
    background: none;
  }

  .carousel .slide img {
    max-height: 300px;
    object-fit: cover;
  }

  .carousel .control-dots {
    bottom: 0;
    margin-bottom: 0;
  }

  .carousel .control-dots .dot {
    box-shadow: none;
    background: ${(props) => props.theme.colors.primary};
    opacity: 0.5;
  }

  .carousel .control-dots .dot.selected {
    opacity: 1;
  }
`;

const PhotoMetadata = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: left;
  font-size: 14px;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 12px;
`;
const PhotobookCount = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.secondary};
`;

const CreateButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }

  &.disabled {
    background-color: #ccc;
    cursor: not-allowed;
    &:hover {
      background-color: #ccc;
    }
  }
`;
const CreatedDate = styled.p`
  color: #888;
  font-size: 14px;
  margin-top: 15px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 20px;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
`;

const ViewPhotobooks = () => {
  const [photobooks, setPhotobooks] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchPhotobooks = async () => {
      if (user && user.uid) {
        const books = await getUserPhotobooks(user.uid);
        setPhotobooks(books);
      }
    };

    fetchPhotobooks();

    // Check for error message in location state
    if (location.state && location.state.error) {
      setError(location.state.error);
    }
  }, [user, location]);

  if (!user) {
    return <Container>Please log in to view your photobooks.</Container>;
  }

  const canCreatePhotobook = photobooks.length < 10;

  return (
    <Container>
      <Title>Your Photobooks</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PhotobookCount>
        {photobooks.length} / 10 Photobooks Created
      </PhotobookCount>
      <CreateButton
        to={canCreatePhotobook ? "/create" : "#"}
        className={!canCreatePhotobook ? "disabled" : ""}
        onClick={(e) => !canCreatePhotobook && e.preventDefault()}
      >
        {canCreatePhotobook
          ? "Create New Photobook"
          : "Photobook Limit Reached"}
      </CreateButton>
      <PhotobookList>
        {photobooks.map((book) => (
          <PhotobookItem key={book.id}>
            {book.photos && book.photos.length > 0 && (
              <CarouselContainer>
                <Carousel
                  showArrows={true}
                  showThumbs={false}
                  showStatus={false}
                >
                  {book.photos.map((photo, index) => (
                    <div key={index}>
                      <img
                        src={photo.url}
                        alt={photo.title || `Photo ${index + 1}`}
                      />
                      <PhotoMetadata>
                        <p>
                          <strong>{photo.title || "Untitled"}</strong>
                        </p>
                        {photo.filmStock && <p>Film: {photo.filmStock}</p>}
                        {photo.people && photo.people.length > 0 && (
                          <p>
                            People:{" "}
                            {photo.people.map((person) => (
                              <Tag key={person}>{person}</Tag>
                            ))}
                          </p>
                        )}
                        {photo.location && (
                          <p>
                            Location: <Tag>{photo.location}</Tag>
                          </p>
                        )}
                        {photo.event && (
                          <p>
                            Event: <Tag>{photo.event}</Tag>
                          </p>
                        )}
                      </PhotoMetadata>
                    </div>
                  ))}
                </Carousel>
              </CarouselContainer>
            )}
            <PhotobookContent>
              <PhotobookTitle>{book.title}</PhotobookTitle>
              <PhotobookDescription>{book.description}</PhotobookDescription>
              <CreatedDate>
                Created: {book.createdAt.toDate().toLocaleDateString()}
              </CreatedDate>
              <ViewButton to={`/photobook/${book.id}`}>
                View Full Photobook
              </ViewButton>
            </PhotobookContent>
          </PhotobookItem>
        ))}
      </PhotobookList>
    </Container>
  );
};

export default ViewPhotobooks;
