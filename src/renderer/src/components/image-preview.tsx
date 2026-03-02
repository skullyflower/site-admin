import { Box, CloseButton, HStack, Image } from '@chakra-ui/react'

const PreviewImage = ({
  image,
  deleteImage
}: {
  image: string
  deleteImage: (image: string) => void
}): React.ReactNode => {
  return (
    <Box
      minW="200px"
      w={{ sm: '100%', md: '200px' }}
      backgroundColor="blackAlpha.200"
      p={2}
      m={2}
      borderRadius={4}
      _hover={{ background: 'blackAlpha.500' }}
    >
      <HStack align={'start'}>
        <Image
          className="image"
          src={image}
          alt={'Image'}
          width={150}
          style={{ padding: '10px' }}
        />
        <CloseButton size={'sm'} onClick={() => deleteImage(image)} />
      </HStack>
    </Box>
  )
}

interface ImagePreviewProps {
  images: string[]
  updateImages: (images: string[]) => void
}
const ImagePreview = ({ images, updateImages }: ImagePreviewProps): React.ReactNode => {
  const deleteImage = (image: string): void => {
    updateImages(images.filter((img) => img !== image))
  }
  return (
    <>
      {images.map((image, i) => (
        <PreviewImage key={`${image}${i}`} image={image} deleteImage={deleteImage} />
      ))}
    </>
  )
}
export default ImagePreview
