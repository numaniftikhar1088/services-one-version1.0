import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import FacilityService from "Services/FacilityService/FacilityService";
import { AxiosError, AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";

const FacilityLogoUploader = ({ formData, setFormData }: any) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
    }
  };

  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      FacilityService.UploadLogo(formData)
        .then((res: AxiosResponse) => {
          setFormData((prev: any) => ({
            ...prev,
            facilityLogoUrl: {
              value: res.data.Data,
            },
          }));
          setSelectedImage(res.data.Data);
        })
        .catch((error: AxiosError) => {
          console.error(error);
        });
    }
  }, [file]);

  const handleRemoveImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedImage("");
    setFile(null);
    setFormData((prev: any) => ({
      ...prev,
      facilityLogoUrl: {
        value: null,
      },
    }));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box position="relative" display="inline-block">
        <label htmlFor="avatar-upload">
          <input
            accept="image/*"
            id="File_upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageUpload}
            required
          />
          <Avatar
            src={formData?.facilityLogoUrl?.value || selectedImage || undefined}
            alt="Avatar"
            sx={{
              width: 100,
              height: 100,
              borderRadius: 1,
              cursor: "pointer",
              border: selectedImage ? "1px solid grey" : "1px dashed grey",
              transition: "0.3s",
            }}
          >
            {!selectedImage && <PhotoCameraIcon />}
          </Avatar>
        </label>
      </Box>

      {/* Show file name with close button below avatar if a file is selected */}
      {file && (
        <Box display="flex" alignItems="center" mt={1}>
          <Typography variant="body2" color="textSecondary">
            {file.name}
          </Typography>
          <IconButton
            onClick={handleRemoveImage}
            size="small"
            sx={{
              marginLeft: 1,
              color: "grey",
              "&:hover": {
                color: "red",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FacilityLogoUploader;
