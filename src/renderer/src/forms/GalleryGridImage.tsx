import {
  Accordion,
  Box,
  Button,
  Image,
  Input,
  Spacer,
  Stack,
  useDisclosure,
  Text,
  HStack,
  Badge
} from '@chakra-ui/react'
import ConfirmDelete from '@renderer/components/ConfirmDelete'
import { useState } from 'react'
import { buttonRecipe } from '@renderer/themeRecipes'
import { GalleryImage } from '@renderer/../../../src/shared/types'
import TagSelector from '@renderer/components/inputs/TagSelector'

interface GalleryGridImageProps {
  oneImage: GalleryImage
  imgDir: string
  deleteImage: (imageurl: string) => void
  updateImage: (imageurl: string, date: string, name: string, tags: string[]) => void
  showDetail: (string) => void
  tagList?: string[]
}

export const GalleryGridImage = ({
  oneImage,
  imgDir,
  deleteImage,
  updateImage,
  showDetail,
  tagList
}: GalleryGridImageProps): React.ReactNode => {
  const [title, setTitle] = useState(oneImage.imgtitle)
  const [date, setDate] = useState(oneImage.imgfile?.substring(0, 8) ?? '')
  const imageurl = `http://localhost:3000${imgDir}/${oneImage.imgfile ?? ''}`
  const imagePath = imageurl.replace('http://localhost:3000/', '')
  const [imageTags, setImageTags] = useState(oneImage.tags)
  const { open, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Box
        minW="200px"
        w={{ sm: 'auto', md: '30%' }}
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
          <div onClick={() => showDetail(imageurl || '')}>
            <Image src={`${imageurl}`} alt={oneImage.imgtitle} />
          </div>
          <Text fontSize={'xs'}>
            {oneImage.imgtitle}
            <span className="smaller"> {' ©' + oneImage.imgyear}</span>
          </Text>
          <HStack gap={2} wrap={'wrap'}>
            {imageTags?.map((t) => (
              <Badge key={`${imageurl}-${t}`} size="xs">
                {t}
              </Badge>
            ))}
          </HStack>
          <Accordion.Root
            collapsible
            value={editOpen ? ['1'] : []}
            onValueChange={(details) => setEditOpen(details.value.includes('1'))}
          >
            <Accordion.Item value="1">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left">
                  Edit
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                {editOpen && (
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
                    <TagSelector
                      value={imageTags || []}
                      defaultOptions={tagList || []}
                      onChange={setImageTags}
                    />
                    <Accordion.ItemTrigger>
                      <Button
                        alignSelf="right"
                        recipe={buttonRecipe}
                        size={'sm'}
                        onClick={() => updateImage(imagePath, date, title, imageTags || [])}
                      >
                        Update
                      </Button>
                    </Accordion.ItemTrigger>
                  </Stack>
                )}
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
