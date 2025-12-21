import {
  Accordion,
  Box,
  Button,
  Image,
  Input,
  Spacer,
  Stack,
  useDisclosure,
  Text
} from '@chakra-ui/react'
import ConfirmDelete from '../components/ConfirmDelete'
import { useState } from 'react'
import { buttonRecipe } from '@renderer/themeRecipes'
import { GalleryImage } from 'src/shared/types'

interface GalleryGridImageProps {
  oneImage: GalleryImage
  imgDir: string
  deleteImage: (imageurl: string) => void
  updateImage: (imageurl: string, date: string, name: string) => void
}

export const GalleryGridImage = ({
  oneImage,
  imgDir,
  deleteImage,
  updateImage
}: GalleryGridImageProps): React.ReactNode => {
  const [title, setTitle] = useState(oneImage.imgtitle)
  const [date, setDate] = useState(oneImage.imgfile?.substring(0, 8) ?? '')
  const imageurl = `${imgDir}/${oneImage.imgfile ?? ''}`

  const imagePath = imageurl.replace('http://localhost:3000/', '')
  const { open, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

  return (
    <>
      <Box
        minW="200px"
        w={{ sm: '100%', md: '200px' }}
        backgroundColor="blackAlpha.200"
        p={2}
        m={2}
        borderRadius={4}
        _hover={{ background: 'blackAlpha.500' }}
      >
        <Stack alignItems="stretch" gap={2}>
          <Button alignSelf="right" variant="ghost" size={'sm'} onClick={onOpenDelete}>
            delete
          </Button>
          <Image src={`${imageurl}`} alt={oneImage.imgtitle} boxSize={48} />
          <Text fontSize={'xs'}>
            {oneImage.imgtitle}
            <span className="smaller"> {' ©' + oneImage.imgyear}</span>
          </Text>
          <Accordion.Root>
            <Accordion.Item value="1">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left">
                  Edit
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Stack justifyContent="stretch">
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />
                  <Input
                    name="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                    }}
                    placeholder="YYYYMMDD"
                  />
                  <Button
                    alignSelf="right"
                    recipe={buttonRecipe}
                    size={'sm'}
                    onClick={() => updateImage(imagePath, date, title)}
                  >
                    Rename
                  </Button>
                </Stack>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </Stack>
        <ConfirmDelete
          what={oneImage.imgfile}
          action={() => deleteImage(imagePath)}
          isOpen={open}
          onClose={onCloseDelete}
        />
      </Box>
      <Spacer />
    </>
  )
}
