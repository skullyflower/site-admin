import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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

export const GalleryGridImage = ({ oneImage, imgDir, deleteImage, updateImage }) => {
  const [title, setTitle] = useState(oneImage.imgtitle)
  const [date, setDate] = useState(oneImage.imgfile.substr(0, 8))
  const imageurl = `${imgDir}/${oneImage.imgfile}`

  const imagePath = imageurl.replace('http://localhost:3000/', '')
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <Button alignSelf="right" variant="ghost" size={'sm'} onClick={onOpen}>
            delete
          </Button>
          <Image
            src={`${imageurl}`}
            alt={oneImage.imgtitle}
            boxSize={48}
            fallbackSrc="http://localhost:3000/images/rain.svg"
          />
          <Text size={'xs'}>
            {oneImage.imgtitle}
            <span className="smaller"> {' ©' + oneImage.imgyear}</span>
          </Text>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Edit
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
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
                    variant="primary"
                    size={'sm'}
                    onClick={updateImage(imagePath, date, title)}
                  >
                    Rename
                  </Button>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
        <ConfirmDelete
          which={oneImage.imgfile}
          action={deleteImage(imagePath)}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
      <Spacer />
    </>
  )
}
