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

const todayStamp = (): string => {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
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
  const [date, setDate] = useState(
    /^\d{8}/.test(oneImage.imgfile ?? '') ? oneImage.imgfile.substring(0, 8) : todayStamp()
  )
  const imageurl = `http://localhost:3000${imgDir}/${encodeURIComponent(oneImage.imgfile ?? '')}`
  const imagePath = `${imgDir}/${oneImage.imgfile ?? ''}`.replace(/^\//, '')
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
                      type="date"
                      value={`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`}
                      onChange={(e) => {
                        // empty while the user is mid-edit; keep the last valid date
                        if (e.target.value) setDate(e.target.value.replaceAll('-', ''))
                      }}
                    />
                    <TagSelector
                      tags={imageTags || []}
                      defaultOptions={tagList || []}
                      onChange={setImageTags}
                      allowCustomValue
                    />
                    <Accordion.ItemTrigger>
                      <Button
                        alignSelf="right"
                        recipe={buttonRecipe}
                        size={'sm'}
                        disabled={!/^\d{8}$/.test(date)}
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
