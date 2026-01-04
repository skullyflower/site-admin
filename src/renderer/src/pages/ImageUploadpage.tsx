import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ImageUpload from '../forms/image-upload-form'
import {
  Button,
  Checkbox,
  Heading,
  HStack,
  Image,
  NativeSelect,
  Separator,
  VStack
} from '@chakra-ui/react'
import PageLayout from '../components/PageLayout'
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
        setMessages(response.message)
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
        setMessages(response.message)
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
  const { register, handleSubmit, setValue, getValues } = useForm<{
    destination: string
    filesToMove: string[]
  }>({
    defaultValues
  })
  const filesToMove = getValues('filesToMove')
  const onSubmit = (): void => {
    const values = getValues()
    window.api
      .uploadImages(values.filesToMove, values.destination)
      .then((response) => {
        setMessages(response.message)
        getImages(
          (files) => setValue('filesToMove', files),
          () => {}
        )
      })
      .catch((err) => {
        setMessages(err.message || 'Failed to move images.')
      })
  }

  const [showForm, setShowForm] = useState(false)
  const [messages, setMessages] = useState<string | null>(null)
  // read from api based on gallery/shop/etc files. standardize image loacations.
  const [toDirectories, setToDirectories] = useState<string[]>([])

  const checkForImages = (): void => {
    setMessages(null)
    getImages((files) => setValue('filesToMove', files), setMessages)
  }
  const setFilesToMove = (files: string[]): void => setValue('filesToMove', files)

  useEffect(() => {
    if (!toDirectories.length) {
      getDirectories(setToDirectories, setMessages)
    }
    if (filesToMove.length === 0 && !messages) {
      getImages(setFilesToMove, setMessages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesToMove, messages, setMessages, toDirectories])

  const doDelete = (imageurl: string): void => {
    window.api
      .deleteImage(imageurl)
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
      title="Add Images"
      button={{ action: () => setShowForm(!showForm), text: 'Add new ones', value: 'newcat' }}
    >
      {showForm && (
        <FormContainer>
          <ImageUpload
            isOpen={showForm}
            hideForm={() => {
              setShowForm(false)
              checkForImages()
            }}
            setMessages={setMessages}
          />
        </FormContainer>
      )}
      <VStack gap={4} textAlign="center">
        <Separator />
        <Heading size="sm">Staged Images to Move</Heading>
        <Checkbox.Group
          value={filesToMove}
          onValueChange={(value: string[]) => setValue('filesToMove', value)}
        >
          <HStack maxW="1000px" alignItems="stretch" wrap="wrap">
            {filesToMove &&
              filesToMove.length > 0 &&
              filesToMove.map((file, i) => (
                <VStack key={i} style={{ padding: '5px' }}>
                  <Button recipe={buttonRecipe} size="sm" onClick={() => doDelete(`/temp/${file}`)}>
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
        <Button recipe={buttonRecipe} onClick={checkForImages}>
          Check For Staged Images
        </Button>
        <Separator />
        <Heading size="sm">Destination</Heading>
        <HStack>
          <NativeSelect.Root>
            <NativeSelect.Field placeholder="Pick a Destination" {...register('destination')}>
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
        </Button>
      </VStack>
    </PageLayout>
  )
}
export default ImagesUploadPage
