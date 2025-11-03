import { useState } from 'react'
import { Box, HStack, Input } from '@chakra-ui/react'
import ImagePreview from './image-preview'
import { UseFormRegister } from 'react-hook-form'

interface UploadInputProps {
  name: string
  setImageCount?: (count: number) => void
  multiple: boolean
  register: UseFormRegister<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}
const UploadInput = ({
  name,
  setImageCount,
  register,
  multiple = true
}: UploadInputProps): React.ReactNode => {
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const addMultipleImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const imageArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      if (!multiple) {
        setPreviewImages([])
      }
      setPreviewImages(imageArray)
      if (setImageCount) {
        setImageCount(imageArray.length)
      }
    }
  }

  return (
    <Box>
      <Input
        {...register(name)}
        type="file"
        accept="image/*"
        multiple={multiple}
        width={350}
        height={previewImages?.length > 0 ? 50 : 150}
        paddingTop={previewImages?.length > 0 ? 2 : 10}
        paddingLeft={10}
        backgroundImage={'/images/image-loading.svg'}
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
        onChange={addMultipleImages}
      />
      <HStack>
        {previewImages?.length > 0 && (
          <ImagePreview images={previewImages} updateImages={setPreviewImages} />
        )}
      </HStack>
    </Box>
  )
}
export default UploadInput
