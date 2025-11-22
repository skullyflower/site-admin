import { CloseButton, HStack, Image } from '@chakra-ui/react'

const PreviewImage = ({
  image,
  deleteImage
}: {
  image: string
  deleteImage: (image: string) => void
}): React.ReactNode => {
  return (
    <HStack align={'start'}>
      <Image className="image" src={image} alt={'Image'} width={150} style={{ padding: '10px' }} />
      <CloseButton size={'sm'} onClick={() => deleteImage(image)} />
    </HStack>
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
