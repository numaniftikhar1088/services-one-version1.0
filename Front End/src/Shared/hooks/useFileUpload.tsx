import { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "../../Services/FacilityService/FacilityService";
import useLang from "./useLanguage";
const useFileUpload = (fileArray: any, value: any, label: any) => {
  const { t } = useLang()
  const [images, setImages] = useState<any>([]);
  const [imageDeselect, setImageDeselect] = useState(false);
  const [imagePath, setImagePath] = useState<any>("");
  const [fileName, setFilename] = useState("");
  const [imagesArray, setImagesArray] = useState<any>(
    label === "Photos For Insurance Card" && value?.length > 0
      ? value
      : label === "Photo For Demographic Info" && value?.length > 0
        ? value
        : label === "Photo For Prescribed Medication" && value.length > 0
          ? value
          : fileArray
  );
  const [uploading, setUploading] = useState(false);

  const handleImageDeselect = useCallback((image: any, restImages: any) => {
    const _images = [...restImages];
    const index = _images.map((_: any) => _.name).indexOf(image.name);
    if (index > -1) {
      _images.splice(index, 1);
    }
    setImages([..._images]);
  }, []);
  const handleImageDeselectFinalArray = useCallback((fileName: any) => {
    const updatedImagesArray = imagesArray.filter(
      (item: any) => item.fileName !== fileName
    );
    setImagesArray(updatedImagesArray);
  }, []);
  const handleUpload = useCallback(
    async (e: any, filesArrayToAppend: any, controlId: any) => {
      let fileDetail = {
        fileUrl: "",
        fileName: "",
        controlId: controlId,
      };
      // Check if files are selected
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const fileType = file.type;
        const fileName = file.name;

        // Check if the selected file name already exists in the imagesArray
        const isFileNameExists = imagesArray.some(
          (image: any) => image.fileName === fileName
        );
        if (isFileNameExists) {
          toast.error(t("File with the same name already exists"));
          return; // Return to prevent further execution
        }

        // Check if the selected file type is PDF, JPG, or PNG
        if (
          fileType === "application/pdf" ||
          fileType === "image/jpeg" ||
          fileType === "image/png"
        ) {
          fileDetail.fileName = fileName;

          const formData = new FormData();
          formData.append("file", file);

          setUploading(true);
          await FacilityService.UploadResultsToBlob(formData)
            .then((res: AxiosResponse) => {
              fileDetail.fileUrl = res.data.Data;
              setImagePath(res.data.Data);
              e.target.value = "";
            })
            .catch((err: any) => {
              // Handle error
              console.error(err);
            })
            .finally(() => {
              setUploading(false);
            });

          if (fileDetail.fileUrl) {
            filesArrayToAppend.push(fileDetail);
            setImagesArray([...imagesArray, ...filesArrayToAppend]);
            setImages([...images, file]);
          }
        } else {
          // Handle if the selected file type is not allowed
          toast.error(t("You can only upload PDF, JPG, PNG file type"));
          return; // Return to prevent further execution
        }
      }

      return fileDetail;
    },
    [images, imagesArray]
  );

  return {
    handleUpload,
    images,
    setImages,
    handleImageDeselect,
    imageDeselect,
    setImageDeselect,
    fileName,
    imagePath,
    imagesArray,
    uploading,
    handleImageDeselectFinalArray,
  };
};

export default useFileUpload;
