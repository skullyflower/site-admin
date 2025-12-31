import { useForm } from 'react-hook-form'
import UploadInput from '../components/upload-input'
import { Heading, HStack, Button, Stack } from '@chakra-ui/react'
import FloatingFormWrapper from '../components/floatingformwrap'
import { useState } from 'react'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'

export default function ImageUpload({ isOpen, hideForm, setMessages }) {
  const [imageCount, setImageCount] = useState(0)

  const onSubmit = (data) => {
    const imagesArr = Array.from(data.images)
    var formData = new FormData()
    for (var file of imagesArr) {
      formData.append('images', file)
    }
    fetch('http://localhost:4242/api/imageupload', {
      method: 'POST',
      body: formData
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
      })
      .catch((err) => {
        setMessages('Failed to upload files.')
      })
      .finally(() => {
        hideForm()
      })
  }

  const { register, handleSubmit } = useForm()

  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={{ hideForm }}>
      <Stack>
        <HStack justifyContent="space-between">
          <Heading size="md">Upload Images</Heading>
          <Button recipe={buttonRecipe} onClick={hideForm}>
            Never mind
          </Button>
        </HStack>
        <UploadInput register={register} setImageCount={setImageCount} name="images" />
        <Button recipe={buttonRecipe} disabled={!imageCount} onClick={handleSubmit(onSubmit)}>
          Upload and Resize
        </Button>
      </Stack>
    </FloatingFormWrapper>
  )
}
