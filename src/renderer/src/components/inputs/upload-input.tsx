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
    <Stack width="100%" height="150px">
      <HStack>
        {previewImages?.length > 0 ? (
          <ImagePreview
            images={previewImages}
            updateImages={(images: string[]) => setPreviewImages(images)}
          />
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

        {/* <Input
          type="file"
          accept="image/*"
          multiple={multiple}
          width={'100%'}
          height={previewImages?.length > 0 ? 50 : 150}
          paddingTop={previewImages?.length > 0 ? 2 : 10}
          paddingLeft={10}
          backgroundImage={backgroundImage}
          borderColor={'slate.800'}
          borderWidth={2}
          borderStyle={'solid'}
          _before={
            previewImages?.length > 0
              ? {
                  content: '"Remove and Select New"',
                  display: 'block',
                  lineHeight: 2,
                  fontWeight: 700
                }
              : undefined
          }
          onChange={addPreviewImages}
        />
        } )}*/}
      </HStack>
    </Stack>
  )
}
export default UploadInput
