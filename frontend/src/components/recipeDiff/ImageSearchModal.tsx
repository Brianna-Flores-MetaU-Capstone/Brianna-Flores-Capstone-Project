import {
  Box,
  Modal,
  ModalDialog,
  ModalClose,
  DialogContent,
  Button,
  Input,
  FormControl,
  FormLabel,
  Grid,
  AspectRatio,
} from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import type {
  GPErrorMessageTypes,
  GPPexelsImageType,
} from "../../utils/types/types";
import ErrorState from "../utils/ErrorState";
import TitledListView from "../utils/TitledListView";
import {
  CenteredTitledListStyle,
  GPModalStyle,
} from "../../utils/style/UIStyle";
const IMAGE_API_KEY = import.meta.env.VITE_IMAGE_API_KEY;
const pexelsUrl = import.meta.env.VITE_PEXELS_URL;
const UPLOAD_IMAGE_API_KEY = import.meta.env.VITE_IMAGE_UPLOAD_API_KEY;
const imgBBUrl = import.meta.env.VITE_IMGBB_URL;

const GPSelectedImageStyle = {
  border: "4px solid",
  borderColor: "primary.300",
};

const IMAGE_RESULTS_WIDTH = 150;

type GPImageSearchModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit: (value: Set<string>) => void;
};

const ImageSearchModal = ({
  modalOpen,
  toggleModal,
  onSubmit,
}: GPImageSearchModalTypes) => {
  const [imageSearchTerm, setImageSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [imageSearchResults, setImageSearchResults] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [uploadedImage, setUploadedImage] = useState<FormData>();

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const imageResults = await axios.get(`${pexelsUrl}/search`, {
        headers: {
          Authorization: IMAGE_API_KEY,
        },
        params: {
          query: imageSearchTerm,
          per_page: 8,
        },
      });
      const photosArray = imageResults.data.photos;
      const photosSrc = photosArray.map(
        (photoInfo: GPPexelsImageType) => photoInfo.src?.original
      );
      setImageSearchResults(photosSrc);
    } catch (error) {
      setMessage({ error: true, message: "Error fetching images from API" });
    }
  };

  const onImageSelect = (imageUrl: string) => {
    if (selectedImages.has(imageUrl)) {
      setSelectedImages((prev) => {
        prev.delete(imageUrl);
        return new Set(prev);
      });
    } else {
      setSelectedImages((prev) => new Set(prev.add(imageUrl)));
    }
  };

  const handleImageConfirmation = async () => {
    if (uploadedImage) {
      try {
        const response = await axios.post(
          `${imgBBUrl}/upload?key=${UPLOAD_IMAGE_API_KEY}`,
          uploadedImage
        );
        const uploadedUrl = response.data.data.url;
        setSelectedImages((prev) => new Set(prev.add(uploadedUrl)));
      } catch (error) {
        setMessage({
          error: true,
          message: "Error uploading image, try again",
        });
        return;
      }
    }
    toggleModal();
    onSubmit(selectedImages);
    setSelectedImages(new Set());
    setImageSearchResults([]);
    setImageSearchTerm("");
    setUploadedImage(new FormData())
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog sx={GPModalStyle}>
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{ my: 3 }}>
          <form onSubmit={handleSearchSubmit}>
            <Grid container alignItems="flex-end">
              <Grid xs={10}>
                <FormControl>
                  <FormLabel>Search Images</FormLabel>
                  <Input
                    slotProps={{
                      input: { "data-reciperequest": "recipeName" },
                    }}
                    onChange={(event) => setImageSearchTerm(event.target.value)}
                    value={imageSearchTerm}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid xs={2}>
                <Button type="submit">Search!</Button>
              </Grid>
            </Grid>
          </form>
          <form>
            <Grid container alignItems="flex-end">
              <Grid xs={10}>
                <FormControl>
                  <FormLabel>Add your own image!</FormLabel>
                  <Input
                    sx={{
                      border: "none",
                      background: "none",
                      boxShadow: "none",
                      flexShrink: 1,
                      alignItems: "center",
                    }}
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        const formData = new FormData();
                        formData.append("image", event.target.files[0]);
                        setUploadedImage(formData);
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid xs={2}>
                <Button type="submit">Upload!</Button>
              </Grid>
            </Grid>
          </form>
          {message && (
            <ErrorState error={message.error} message={message.message} />
          )}
          <Box display="flex" flexDirection="column" gap={2}>
            {
              <TitledListView
                itemsList={imageSearchResults}
                renderItem={(imageUrl, index) => (
                  <AspectRatio
                    onClick={() => onImageSelect(imageUrl)}
                    ratio={1}
                    key={index}
                    sx={{
                      ...(selectedImages.has(imageUrl) && GPSelectedImageStyle),
                      width: IMAGE_RESULTS_WIDTH,
                    }}
                  >
                    <img src={imageUrl} alt={imageSearchTerm} />
                  </AspectRatio>
                )}
                listItemsStyle={CenteredTitledListStyle}
              />
            }
            <Button
              sx={{ justifySelf: "center" }}
              onClick={handleImageConfirmation}
            >
              Confirm Selection!
            </Button>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default ImageSearchModal;
