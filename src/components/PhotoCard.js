// src/components/PhotoCard.js
import React from "react";
import * as S from "../styles/SinglePhotobookStyles";

const PhotoCard = ({ photo, onPhotoClick, onEditClick }) => {
  const safeJoin = (value, separator = ", ") => {
    if (Array.isArray(value)) {
      return value.join(separator);
    }
    return value || "";
  };

  return (
    <S.PhotoCard>
      <S.PhotoImage src={photo.url} alt={photo.title} onClick={onPhotoClick} />
      <S.PhotoInfo>
        <S.PhotoTitle>{photo.title}</S.PhotoTitle>
        <S.InfoItem>Film Stock: {safeJoin(photo.filmStock)}</S.InfoItem>
        <S.InfoItem>People: {safeJoin(photo.people)}</S.InfoItem>
        <S.InfoItem>Location: {photo.location || ""}</S.InfoItem>
        <S.InfoItem>Event: {safeJoin(photo.event)}</S.InfoItem>
        <S.EditButton onClick={onEditClick}>Edit</S.EditButton>
      </S.PhotoInfo>
    </S.PhotoCard>
  );
};

export default PhotoCard;
