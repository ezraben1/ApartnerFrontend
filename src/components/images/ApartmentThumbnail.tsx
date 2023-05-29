import React from "react";

interface ApartmentThumbnailProps {
  src: string;
}

const ApartmentThumbnail: React.FC<ApartmentThumbnailProps> = ({ src }) => {
  if (!src) {
    return (
      <div>
        <p>No image available</p>
      </div>
    );
  }

  return <img src={src} alt="Apartment Thumbnail" />;
};

export default ApartmentThumbnail;
