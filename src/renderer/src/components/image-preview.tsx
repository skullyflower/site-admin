import { CloseButton, HStack, Image } from '@chakra-ui/react'

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
        <HStack align={'start'} key={`${image}${i}`}>
          <Image className="image" src={image} alt="" width={150} style={{ padding: '10px' }} />
          <CloseButton size={'sm'} onClick={() => deleteImage(image)} />
        </HStack>
      ))}
    </>
  )
}
export default ImagePreview
