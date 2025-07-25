import { Box, AspectRatio } from "@mui/joy"; 

type GPImageCarouselTypes = {
    imageUrls: string[]
}

const ImageCarousel = ({imageUrls}: GPImageCarouselTypes)  => {
  return (
    <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
      {imageUrls.map((imageUrl, index) => (
        <Box key={index}>
          <AspectRatio
            ratio="1"
            sx={{ maxWidth: 225, width: 225, borderRadius: "md" }}
          >
            <img src={imageUrl} />
          </AspectRatio>
        </Box>
      ))}
    </Box>
  );
};

export default ImageCarousel;
