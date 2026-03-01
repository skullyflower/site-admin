import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import AddImagesForm from '../forms/addImagesForm'
import {
  Button,
  Checkbox,
  Heading,
  HStack,
  Image,
  NativeSelect,
  Box,
  Separator,
  VStack
} from '@chakra-ui/react'
import PageLayout from '../components/layout/PageLayout'
import { buttonRecipe } from '@renderer/themeRecipes'
import { ApiMessageResponse } from 'src/shared/types'
import FormContainer from '@renderer/components/formcontainer'

const getImages = (
  setFilesToMove: (files: string[]) => void,
  setMessages: (message: string | null) => void
): void => {
  setFilesToMove([])
  window.api
    .getStagedImages()
    .then((response: ApiMessageResponse | string[]) => {
      if (typeof response === 'object' && 'message' in response) {
        console.log(response.message)
      } else {
        setFilesToMove(response as string[])
      }
    })
    .catch((err) => setMessages(err.message || "Couldn't get images."))
}

const getDirectories = (
  setToDirectories: (directories: string[]) => void,
  setMessages: (message: string) => void
): void => {
  window.api
    .getImageFolders()
    .then((response) => {
      if (typeof response === 'object' && 'message' in response) {
        console.log(response.message)
        setToDirectories([])
      } else {
        setToDirectories(response as string[])
      }
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get image directories.")
    })
}

const defaultValues: { destination: string; filesToMove: string[] } = {
  destination: '',
  filesToMove: []
}

const ImagesUploadPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [messages, setMessages] = useState<string | null>(null)
  // read from api based on gallery/shop/etc files. standardize image loacations.
  const [toDirectories, setToDirectories] = useState<string[]>([])
  const [allImages, setAllImages] = useState<string[] | null>(null)
  const { control, register, handleSubmit, setValue, getValues } = useForm<{
    destination: string
    filesToMove: string[]
  }>({
    defaultValues
  })
  const filesToMove = useWatch({ control, name: 'filesToMove' })

  const onSubmit = (): void => {
    const values = getValues()
    window.api
      .uploadImages(values.filesToMove, values.destination)
      .then((response) => {
        setMessages(response.messages)
        getImages(
          (files) => setValue('filesToMove', files),
          () => {}
        )
      })
      .catch((err) => {
        setMessages(err.message || 'Failed to move images.')
      })
  }

  const checkForImages = (): void => {
    setMessages(null)
    getImages(setAllImages, setMessages)
  }
  //const setFilesToMove = (files: string[]): void => setValue('filesToMove', files)

  useEffect(() => {
    if (!toDirectories.length) {
      getDirectories(setToDirectories, setMessages)
    }
    if (!allImages && !messages) {
      getImages(setAllImages, setMessages)
    }
  }, [])

  const doDelete = (imageurl: string): void => {
    setValue(
      'filesToMove',
      filesToMove?.filter((file) => file !== imageurl.substring(imageurl.lastIndexOf('/') + 1)) ||
        []
    )
    window.api
      .deleteImage(imageurl.replace('http://localhost:3000/', ''))
      .then((response) => {
        setMessages(response.message)
        checkForImages()
      })
      .catch((err) => {
        setMessages(err.message || 'Failed to delete image.')
      })
  }

  return (
    <PageLayout
      messages={messages}
      setMessages={setMessages}
      title="Add Images"
      button={{ action: () => setShowForm(!showForm), text: 'Add new ones', value: 'newcat' }}
    >
      {showForm && (
        <FormContainer>
          <AddImagesForm
            isOpen={showForm}
            hideForm={() => {
              setShowForm(false)
              checkForImages()
            }}
            setMessages={setMessages}
          />
        </FormContainer>
      )}
      <VStack gap={4}>
        <Separator />
        {allImages && allImages.length > 0 ? (
          <>
            <Heading size="sm" textAlign="start">
              Staged Images to Move
            </Heading>
            <Box
              width={'100%'}
              flexGrow={3}
              borderWidth={1}
              borderStyle="solid"
              borderRadius={4}
              borderColor="gray.300"
              p={5}
            >
              <Heading size="sm" textAlign="start">
                Select the images you want to move
              </Heading>
              <Checkbox.Group
                value={filesToMove}
                onValueChange={(value: string[]) => setValue('filesToMove', value)}
              >
                <HStack maxW="1000px" alignItems="stretch" wrap="wrap">
                  {allImages &&
                    allImages.length > 0 &&
                    allImages.map((file, i) => (
                      <VStack key={i} style={{ padding: '5px' }}>
                        <Button
                          recipe={buttonRecipe}
                          size="sm"
                          onClick={() => doDelete(`/temp/${file}`)}
                        >
                          delete
                        </Button>
                        <Image
                          src={`http://localhost:3000/temp/${file}`}
                          alt={file}
                          width={75}
                          style={{ verticalAlign: 'middle', padding: '0 10px' }}
                        />
                        <Checkbox.Root value={file}>
                          <Checkbox.HiddenInput />
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Label>{file}</Checkbox.Label>
                        </Checkbox.Root>
                      </VStack>
                    ))}
                </HStack>
              </Checkbox.Group>
            </Box>
          </>
        ) : (
          <Button recipe={buttonRecipe} onClick={checkForImages}>
            Check For Staged Images
          </Button>
        )}
        <Separator />
        {filesToMove && filesToMove.length > 0 && (
          <>
            <Heading size="sm">Select a Destination</Heading>
            <HStack>
              <NativeSelect.Root>
                <NativeSelect.Field placeholder="Pick a Destination" {...register('destination')}>
                  <option value=".">images</option>
                  {toDirectories.map((dir, i) => (
                    <option value={dir} key={i}>
                      {dir}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </HStack>
            <Button
              disabled={!filesToMove?.length}
              recipe={buttonRecipe}
              onClick={handleSubmit(onSubmit)}
            >
              Move The images.
            </Button>{' '}
          </>
        )}
      </VStack>
    </PageLayout>
  )
}
export default ImagesUploadPage
