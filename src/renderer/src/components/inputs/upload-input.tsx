import { useState } from 'react'
import { Box, FileUpload, Icon, HStack, Stack } from '@chakra-ui/react'
import ImagePreview from '../image-preview'
//import backgroundImage from '@renderer/assets/image-loading.svg'
import { UploadIcon } from '@phosphor-icons/react'

interface UploadInputProps {
  setImageCount?: (count: number) => void
  multiple: boolean
  onUpload: (filePaths: string[]) => void
}
const UploadInput = ({
  setImageCount,
  onUpload,
  multiple = true
}: UploadInputProps): React.ReactNode => {
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const addPreviewImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const imageArray = Array.from(e.target.files).map((file: File) => file)
      window.api.getPreviewImages(imageArray).then((result) => {
        setPreviewImages(result)
        onUpload(result) // sets image url data in the formdata object.
        if (setImageCount) {
          setImageCount(result.length)
        }
      })
    }
  }

  return (
    <Stack width="100%" gap={4} alignItems="center">
      {previewImages?.length > 0 ? (
        <HStack>
          <ImagePreview
            images={previewImages}
            updateImages={(images: string[]) => setPreviewImages(images)}
          />{' '}
        </HStack>
      ) : (
        <FileUpload.Root
          accept="image/*"
          onChange={addPreviewImages}
          maxFiles={multiple ? 10 : 1}
          maxW="lg"
          alignItems="stretch"
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
              <UploadIcon />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Drag and drop files here</Box>
              <Box color="fg.muted">.png, .jpg, gif up to 5MB</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.List />
        </FileUpload.Root>
      )}
    </Stack>
  )
}
export default UploadInput
