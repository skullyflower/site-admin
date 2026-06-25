import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Stack
} from '@chakra-ui/react'
import EditCategory from '@renderer/forms/categoryeditor'
import PageLayout from '@renderer/components/layout/PageLayout'
import { CategoryType } from '@renderer/../../shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import imageLoading from '@renderer/assets/image-loading.svg'
import SemiSafeContent from '@renderer/components/SemiSafeContent'
import FormContainer from '@renderer/components/formcontainer'
import { UmbrellaSimpleIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react'
import useSearchBox from '@renderer/hooks/useSearchBox'

const getCategories = (
  setCategories: (categories: CategoryType[]) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void,
  setMessageType: (type: 'info' | 'warning' | 'error' | 'success') => void
): void => {
  setLoading(true)
  setCategories([])
  window.api
    .getCategories()
    .then((response) => {
      if (response.success) {
        setCategories(response.data || [])
      } else {
        setCategories([])
        setMessageType('error')
        setMessages(response.message || '')
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessageType('error')
      setMessages(err.message || "Couldn't get categories.")
    })
}

const CategoriesPage = (): React.JSX.Element => {
  const [categories, setCategories] = useState<CategoryType[] | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [showCatForm, setShowForm] = useState(false)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { filteredData, searchBox } = useSearchBox(categories ?? [], (c: CategoryType) => c.name)

  const onSubmit = (values: CategoryType): void => {
    setLoading(true)
    window.api
      .updateCategory(values)
      .then((response) => {
        setMessageType(response.success ? 'success' : 'error')
        setMessages(response.message || '')
        getCategories(setCategories, setMessages, setLoading, setMessageType)
        toggleCatForm(null)
      })
      .catch((err: Error) => {
        setMessageType('error')
        setMessages((err.message as string) || "Couldn't update categories.")
      })
  }

  const doDelete = (catid: string): void => {
    if (window.confirm('Are you sure you want to do this?')) {
      window.api
        .deleteCategory(catid)
        .then((response) => {
          setMessageType(response.success ? 'success' : 'error')
          setMessages(response.message || '')
          getCategories(setCategories, setMessages, setLoading, setMessageType)
        })
        .catch((err: Error) => {
          setMessageType('error')
          setMessages((err.message as string) || "Couldn't delete category.")
        })
    }
  }

  const toggleCatForm = (catid: string | null): void => {
    setActiveCat(catid)
    setShowForm(!!catid)
  }

  useEffect(() => {
    if (!categories && !messages) {
      getCategories(setCategories, setMessages, setLoading, setMessageType)
    }
  }, [categories, messages])

  return (
    <PageLayout
      title="Add, Update, Delete Categories"
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      button={{ action: () => toggleCatForm('newcat'), text: 'Add one', value: 'newcat' }}
    >
      {loading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <Box p={5}>
          {showCatForm && (
            <FormContainer>
              <EditCategory
                isOpen={showCatForm}
                catid={activeCat as string}
                categories={categories as CategoryType[]}
                toggleCatForm={() => toggleCatForm(null)}
                onSubmit={onSubmit}
              />
            </FormContainer>
          )}
          <Stack>
            {searchBox}
            {filteredData
              ?.toSorted((c1, c2) => c1.name.localeCompare(c2.name))
              .map((cat) => (
                <Box key={cat.id} p={5} border="1px solid" borderRadius={5} w="100%">
                  <HStack justifyContent="space-between">
                    <HStack alignItems="start" justify="start">
                      <Image
                        src={`http://localhost:3000${cat.img}`}
                        boxSize="75px"
                        alt={`${cat.name} - http://localhost:3000${cat.img}`}
                        onError={(e) => {
                          e.currentTarget.src = imageLoading
                        }}
                      />

                      <Stack>
                        <Heading size="sm" lineHeight={2} display="flex" gap={4}>
                          {cat.name}
                          {cat.subcat.length > 0 && <UmbrellaSimpleIcon size={24} />}
                        </Heading>
                        <SemiSafeContent rawContent={cat.description} />
                      </Stack>
                    </HStack>
                    <HStack gap={2}>
                      <IconButton
                        aria-label="Delete category"
                        size="sm"
                        padding={2}
                        recipe={buttonRecipe}
                        value={cat.id}
                        onClick={() => doDelete(cat.id)}
                      >
                        <TrashIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Edit category"
                        size="sm"
                        padding={2}
                        recipe={buttonRecipe}
                        value={cat.id}
                        onClick={() => toggleCatForm(cat.id)}
                      >
                        <PencilIcon />
                      </IconButton>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            <Center>
              <Button recipe={buttonRecipe} value="newcat" onClick={() => toggleCatForm(null)}>
                {showCatForm ? 'Never mind' : 'Add one'}
              </Button>
            </Center>
          </Stack>
        </Box>
      )}
    </PageLayout>
  )
}
export default CategoriesPage
