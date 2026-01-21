import React from "react";
interface ImageProps {
  base64String: any;
}
const Base64Image: React.FC<ImageProps> = ({ base64String }) => {
  const uri = base64String;
  return <img src={uri} />;
};

export default Base64Image;
