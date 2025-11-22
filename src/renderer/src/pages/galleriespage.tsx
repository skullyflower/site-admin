import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Field, HStack, Heading, Select, Skeleton, Stack } from '@chakra-ui/react'
import UploadInput from '../components/upload-input'
import FloatingFormWrapper from '../components/floatingformwrap'
import GalleryGrid from '../components/galleryGrid'
import EditGallery from '../forms/galleryeditor'
import PageLayout from '../components/PageLayout'
import { Gallery, GalleryImage } from 'src/shared/types'

export const newGalleryId = 'new-gallery'

const getGalleries = (
  setGalleries: (galleries: Gallery[]) => void,
  setMessages: (message: string) => void
): void => {
  window.api.getGalleries().then((res) => {
    if (typeof res === 'object' && 'galleries' in res) {
      const galleries = res.galleries as Gallery[]
      setGalleries(galleries)
    }
    setMessages((res.message as string) || '')
  })
}

const getGalleryImages = async (gallery_id: string, setter: (gallery) => void): Promise<void> => {
  window.api.getGallery(gallery_id).then((res) => {
    setter(Object.values(res) as GalleryImage[])
  })
}

const newgallery = {
  id: newGalleryId,
  json_path: '',
  path: '',
  title: '',
  linked_prod: '',
  isStory: false
} as Gallery

const GalleryPage: React.FC = () => {
  const [messages, setMessages] = useState<string | null>(null)
  const [galleries, setGalleries] = useState<Gallery[] | null>(null)
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()
  const [imageCount, setImageCount] = useState(0)

  const onSelect = (value: string): void => {
    setLoading(true)
    const gallery = galleries?.find((g) => g.id === value)
    if (gallery !== undefined) {
      setActiveGallery(gallery)
      setLoading(false)
      getGalleryImages(gallery.id, setImages)
    }
  }

  const toggleShowForm = (): void => {
    setShowUpload(!showUpload)
  }
  const toggleShowAdd = (): void => {
    setShowAddEdit(!showAddEdit)
  }

  const doResetGallery = (gallery: Gallery): Promise<void> => {
    return window.api
      .resetGallery(gallery)
      .then((res) => {
        if (typeof res === 'object' && 'message' in res) {
          setMessages(res.message)
        } else {
          getGalleryImages(gallery.id, setImages)
        }
      })
      .catch((err) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  const onSubmit = (data: FormData): void => {
    // TODO: file upload via electron api
    const imagesArr = Array.from(data.images)
    if (!imagesArr.length) return

    var formData = new FormData()
    formData.append('dest', activeGallery.path)
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
      .then(() => {
        doResetGallery(activeGallery as Gallery)()
      })
      .catch(() => {
        setMessages('Failed to upload files.')
      })
      .finally(() => {
        setShowUpload(false)
      })
  }

  const updateImage = (imageurl, date, name) => () => {
    const extention = imageurl.substr(imageurl.lastIndexOf('.'))
    const newName = `${date}${name.replaceAll(' ', '')}${extention}`
    fetch(`http://localhost:4242/api/images/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageurl: imageurl, newname: newName })
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
      })
      .then(() => {
        doResetGallery(activeGallery as Gallery)()
      })
      .catch((err) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  const deleteImage = (imageurl): Promise<void> => {
    return window.api
      .deleteImage(imageurl)
      .then((res) => {
        if (typeof res === 'object' && 'message' in res) {
          setMessages(res.message)
        } else {
          return doResetGallery(activeGallery as Gallery)
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
                <Select
                  name="dest"
                  value={activeGallery?.id || ''}
                  placeholder="Select a gallery"
                  onChange={(e) => onSelect(e.target.value)}
                >
                  {galleries.map((gallery) => (
                    <option key={gallery.id} value={gallery.id}>
                      {gallery.title}
                    </option>
                  ))}
                </Select>
              </HStack>
            </Field.Root>

            {!!activeGallery && !loading && (
              <Stack>
                <Heading size="sm">Update Gallery: {activeGallery.title}</Heading>
                <HStack justifyContent="center">
                  <Button onClick={toggleShowForm}>Add Images</Button>
                  <Button onClick={() => doResetGallery(activeGallery as Gallery)}>
                    Reset Json File
                  </Button>
                  <Button onClick={toggleShowAdd}>Edit Gallery</Button>
                </HStack>
                {!!images?.length && (
                  <GalleryGrid
                    gallery={activeGallery}
                    images={images}
                    deleteImage={deleteImage}
                    updateImage={(imageurl, date, name) => updateImage(imageurl, date, name)()}
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
                    <UploadInput register={register} setImageCount={setImageCount} name="images" />
                    <Button
                      variant="shopButt"
                      disabled={!imageCount}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Upload and Resize
                    </Button>
                  </>
                )}
              </Stack>
            </FloatingFormWrapper>
            {activeGallery && (
              <EditGallery
                selectedGallery={activeGallery}
                toggleForm={() => {
                  setActiveGallery(null)
                  toggleShowAdd()
                }}
                isOpen={showAddEdit}
                onSubmit={onSubmit}
                onCancel={() => {
                  setActiveGallery(null)
                  toggleShowAdd()
                }}
              />
            )}
          </Stack>
        )}
      </Stack>
    </PageLayout>
  )
}
export default GalleryPage
