import { GalleryGridImage } from '../forms/GalleryGridImage'
import { Flex } from '@chakra-ui/react'

const isBigger = (): boolean => {
  let bigger = false
  if (window.innerWidth > 700) {
    bigger = true
  }
  return bigger
}

interface GalleryGridProps {
  gallery: {
    path: string
  }
  images: {
    imgfile: string
  }[]
  deleteImage: (imageurl: string) => () => void
  updateImage: (imageurl: string, date: string, name: string) => () => void
}

const GalleryGrid = ({
  gallery,
  images,
  deleteImage,
  updateImage
}: GalleryGridProps): React.ReactNode => {
  const dir = gallery.path
  const bigger = isBigger()
  const imgDir = `http://localhost:3000/${dir}`

  if (images?.length > 0) {
    return (
      <Flex wrap="wrap">
        {images.map((oneImage) => (
          <GalleryGridImage
            key={oneImage.imgfile}
            imgDir={imgDir}
            oneImage={oneImage}
            bigger={bigger}
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
