import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Field, HStack, Heading, NativeSelect, Skeleton, Stack } from '@chakra-ui/react'
import UploadInput from '../components/inputs/upload-input'
import FloatingFormWrapper from '../components/floatingformwrap'
import GalleryGrid from '../components/galleryGrid'
import EditGallery from '../forms/galleryeditor'
import PageLayout from '../components/layout/PageLayout'
import { GalleryInfo, GalleryImage } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'

export const newGalleryId = 'new-gallery'

const getGalleries = (
  setGalleries: (galleries: GalleryInfo[]) => void,
  setMessages: (message: string) => void,
  setMessageType: (type: 'info' | 'warning' | 'error' | 'success') => void
): void => {
  window.api.getGalleries().then((res) => {
    if (!res.success) {
      setMessageType('error')
      setMessages(res.message || '')
    } else {
      setGalleries(res.data || [])
    }
  })
}

const getGalleryImages = async (
  gallery_id: string,
  setter: (images: GalleryImage[]) => void,
  setMessages: (message: string) => void,
  setMessageType: (type: 'info' | 'warning' | 'error' | 'success') => void
): Promise<void> => {
  window.api.getGalleryImages(gallery_id).then((res) => {
    if (!res.success) {
      setMessageType('error')
      setMessages(res.message || '')
    } else {
      setter(Object.values(res.data || {}) as GalleryImage[])
    }
  })
}

const newgallery = {
  id: newGalleryId,
  json_path: '',
  path: '',
  title: '',
  linked_prod: '',
  isStory: false
} as GalleryInfo

const GalleryPage: React.FC = () => {
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [galleries, setGalleries] = useState<GalleryInfo[] | null>(null)
  const [activeGallery, setActiveGallery] = useState<GalleryInfo | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [newImages, setNewImages] = useState<string[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useForm()
  const [imageCount, setImageCount] = useState(0)

  const selectGallery = (galleryId: string): void => {
    setLoading(true)
    const gallery = galleries?.find((g) => g.id === galleryId)
    if (gallery !== undefined) {
      setActiveGallery(gallery)
      setLoading(false)
      getGalleryImages(gallery.id, setImages, setMessages, setMessageType)
    }
  }

  const toggleShowForm = (): void => {
    setShowUpload(!showUpload)
  }
  const toggleShowAdd = (): void => {
    setShowAddEdit(!showAddEdit)
  }

  const doResetGallery = (gallery: GalleryInfo): void => {
    window.api
      .resetGallery(gallery.id)
      .then((res) => {
        setMessageType(res.success ? 'success' : 'error')
        setMessages(res.message || '')
        getGalleryImages(gallery.id, setImages, setMessages, setMessageType)
      })
      .catch((err) => {
        setMessageType('error')
        setMessages(err.message || 'There was a problem.')
      })
  }

  async function addGalleryImages(): Promise<void> {
    if (!activeGallery?.path) {
      setMessageType('warning')
      setMessages('No gallery selected.')
      return
    }
    const result = await window.api.uploadImages(
      newImages?.map((img) => img.split('/').pop() || img) || [],
      activeGallery?.path || 'artwork'
    )
    if (!result.success || !result.data?.length) {
      setMessageType('error')
      setMessages('There was a problem uploading the images.')
      return
    }
    setMessageType('success')
    setMessages('Images uploaded successfully.')
    doResetGallery(activeGallery)
    setShowUpload(false)
  }

  function updateImage(imageurl: string, date: string, name: string): void {
    const extention = imageurl.split('.').pop()
    const newName = `${date}${name.replaceAll(' ', '')}.${extention}`
    window.api
      .renameImage(imageurl, newName)
      .then((res) => {
        setMessageType(res.success ? 'success' : 'error')
        setMessages(res.message || '')
        doResetGallery(activeGallery as GalleryInfo)
      })
      .catch((err) => {
        setMessageType('error')
        setMessages(err.message || 'There was a problem.')
      })
  }

  const deleteImage = (imageurl: string): void => {
    window.api
      .deleteImage(imageurl)
      .then((res) => {
        setMessageType(res.success ? 'success' : 'error')
        setMessages(res.message || '')
        if (res.success) doResetGallery(activeGallery as GalleryInfo)
      })
      .catch((err) => {
        setMessageType('error')
        setMessages(err.message || 'There was a problem.')
      })
  }

  useEffect(() => {
    if (!galleries && !messages) {
      getGalleries(setGalleries, setMessages, setMessageType)
    }
  }, [galleries, messages])

  return (
    <PageLayout
      title="Update a Gallery"
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      button={{
        text: showAddEdit ? 'Never mind' : 'Add new Gallery',
        action: () => {
          setActiveGallery(newgallery)
          toggleShowAdd()
        },
        value: 'new-gallery'
      }}
    >
      <Stack className="content">
        {galleries && galleries.length > 0 && (
          <Stack textAlign="center">
            <Field.Root p={4}>
              <HStack>
                <Field.Label w={40}>Select a gallery:</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="Select a gallery"
                    {...register('dest')}
                    onChange={(e) => selectGallery(e.target.value)}
                  >
                    {galleries.map((gallery) => (
                      <option key={gallery.id} value={gallery.id}>
                        {gallery.title}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </HStack>
            </Field.Root>
            {/* Edit images in one gallery */}
            {!!activeGallery && !loading && (
              <Stack>
                <Heading size="sm">Update Gallery: {activeGallery.title}</Heading>
                <HStack justifyContent="center">
                  <Button onClick={toggleShowForm}>Add Images</Button>
                  <Button onClick={() => doResetGallery(activeGallery as GalleryInfo)}>
                    Reset Json File
                  </Button>
                  <Button onClick={toggleShowAdd}>Edit Gallery</Button>
                </HStack>
                {!!images?.length && (
                  <GalleryGrid
                    gallery={activeGallery}
                    images={images}
                    deleteImage={deleteImage}
                    updateImage={updateImage}
                  />
                )}
              </Stack>
            )}
            <FloatingFormWrapper isOpen={showUpload} onClose={toggleShowForm}>
              <Stack>
                <HStack justifyContent="space-between">
                  <Heading size="md">
                    Upload Images {!!activeGallery && <span>to {activeGallery.title}</span>}
                  </Heading>
                  <Button onClick={toggleShowForm}>Never mind</Button>
                </HStack>
                {loading ? (
                  <Stack>
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                  </Stack>
                ) : (
                  <Stack gap={4} alignItems="center" justifyContent="center">
                    <UploadInput
                      multiple={true}
                      onUpload={setNewImages}
                      setImageCount={setImageCount}
                    />
                    <Button recipe={buttonRecipe} disabled={!imageCount} onClick={addGalleryImages}>
                      Upload and Resize
                    </Button>
                  </Stack>
                )}
              </Stack>
            </FloatingFormWrapper>
          </Stack>
        )}
        {activeGallery && (
          <EditGallery
            selectedGallery={activeGallery}
            toggleForm={() => {
              setActiveGallery(null)
              toggleShowAdd()
            }}
            isOpen={showAddEdit}
          />
        )}
      </Stack>
    </PageLayout>
  )
}
export default GalleryPage
