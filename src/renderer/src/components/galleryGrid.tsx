import { GalleryImage } from 'src/shared/types'
import { GalleryGridImage } from '../forms/GalleryGridImage'
import { Flex } from '@chakra-ui/react'

interface GalleryGridProps {
  gallery: {
    path: string
  }
  images: GalleryImage[]
  deleteImage: (imageurl: string) => void
  updateImage: (imageurl: string, date: string, name: string) => void
}

const GalleryGrid = ({
  gallery,
  images,
  deleteImage,
  updateImage
}: GalleryGridProps): React.ReactNode => {
  const dir = gallery.path
  const imgDir = `http://localhost:3000/${dir}`

  if (images?.length > 0) {
    return (
      <Flex wrap="wrap">
        {images.map((oneImage) => (
          <GalleryGridImage
            key={oneImage.imgfile}
            imgDir={imgDir}
            oneImage={oneImage}
            deleteImage={deleteImage}
            updateImage={updateImage}
          />
        ))}
      </Flex>
    )
  }
  return null
}
export default GalleryGrid
