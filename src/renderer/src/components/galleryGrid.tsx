import { GalleryImage } from '@renderer/../../src/shared/types'
import { GalleryGridImage } from '@renderer/forms/GalleryGridImage'
import { Flex, Stack } from '@chakra-ui/react'
import useSearchBox from '@renderer/hooks/useSearchBox'

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
  const { filteredData, searchBox } = useSearchBox(images, (i) => i.imgtitle)
  const dir = gallery.path
  const imgDir = `/images/${dir}`

  return (
    <Stack alignItems="stretch">
      <div>{searchBox}</div>
      {filteredData?.length > 0 && (
        <Flex wrap="wrap">
          {filteredData.map((oneImage) => (
            <GalleryGridImage
              key={oneImage.imgfile}
              imgDir={imgDir}
              oneImage={oneImage}
              deleteImage={deleteImage}
              updateImage={updateImage}
            />
          ))}
        </Flex>
      )}
    </Stack>
  )
}
export default GalleryGrid
