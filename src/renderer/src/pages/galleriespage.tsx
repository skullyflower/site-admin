import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Field, HStack, Heading, NativeSelect, Skeleton, Stack } from '@chakra-ui/react'
import UploadInput from '../components/upload-input'
import FloatingFormWrapper from '../components/floatingformwrap'
import GalleryGrid from '../components/galleryGrid'
import EditGallery from '../forms/galleryeditor'
import PageLayout from '../components/PageLayout'
import { GalleryInfo, GalleryImage } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import FormContainer from '@renderer/components/formcontainer'

export const newGalleryId = 'new-gallery'

const getGalleries = (
  setGalleries: (galleries: GalleryInfo[]) => void,
  setMessages: (message: string) => void
): void => {
  window.api.getGalleries().then((res) => {
    if (typeof res === 'object' && 'message' in res) {
      setMessages((res.message as string) || '')
    } else {
      const galleries = res as GalleryInfo[]
      setGalleries(galleries)
    }
  })
}

const getGalleryImages = async (
  gallery_id: string,
  setter: (images: GalleryImage[]) => void,
  setMessages: (message: string) => void
): Promise<void> => {
  window.api.getGalleryImages(gallery_id).then((res) => {
    if (typeof res === 'object' && 'message' in res) {
      setMessages(res.message)
    } else {
      setter(Object.values(res) as GalleryImage[])
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
      getGalleryImages(gallery.id, setImages, setMessages)
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
        if (typeof res === 'object' && 'message' in res) {
          setMessages(res.message)
        }
        getGalleryImages(gallery.id, setImages, setMessages)
      })
      .catch((err) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  const addGalleryImages = async (): Promise<void> => {
    if (!activeGallery) {
      setMessages('No gallery selected.')
      return
    }
    const result = await window.api.uploadImages(newImages, activeGallery?.path || 'artwork')
    setMessages(result.message)
    doResetGallery(activeGallery)
    setShowUpload(false)
  }

  const updateImage = (imageurl: string, date: string, name: string): void => {
    const extention = imageurl.split('.').pop()
    const newName = `${date}${name.replaceAll(' ', '')}${extention}`
    window.api
      .renameImage(imageurl, newName)
      .then((res) => {
        setMessages(res.message)
        doResetGallery(activeGallery as GalleryInfo)
      })
      .catch((err) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  const deleteImage = (imageurl): void => {
    window.api
      .deleteImage(imageurl)
      .then((res) => {
        if (typeof res === 'object' && 'message' in res) {
          setMessages(res.message)
        } else {
          return doResetGallery(activeGallery as GalleryInfo)
        }
      })
      .catch((err) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  useEffect(() => {
    if (!galleries && !messages) {
      getGalleries(setGalleries, setMessages)
    }
  }, [galleries, messages])

  return (
    <PageLayout
      title="Update a Gallery"
      messages={messages}
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
                  <>
                    <UploadInput
                      multiple={true}
                      onUpload={setNewImages}
                      setImageCount={setImageCount}
                    />
                    <Button recipe={buttonRecipe} disabled={!imageCount} onClick={addGalleryImages}>
                      Upload and Resize
                    </Button>
                  </>
                )}
              </Stack>
            </FloatingFormWrapper>
          </Stack>
        )}{' '}
        {activeGallery && (
          <FormContainer>
            <EditGallery
              selectedGallery={activeGallery}
              toggleForm={() => {
                setActiveGallery(null)
                toggleShowAdd()
              }}
              isOpen={showAddEdit}
            />
          </FormContainer>
        )}
      </Stack>
    </PageLayout>
  )
}
export default GalleryPage
