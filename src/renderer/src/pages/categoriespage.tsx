import { useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Image, Skeleton, Stack } from '@chakra-ui/react'
import EditCategory from '../forms/categoryeditor'
import PageLayout from '../components/PageLayout'
import { ApiMessageResponse, CategoryType } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import imageLoading from '@renderer/assets/image-loading.svg'

const getCategories = (
  setCategories: (categories: CategoryType[]) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void
): void => {
  setLoading(true)
  setCategories([])
  window.api
    .getCategories()
    .then((response: ApiMessageResponse | CategoryType[]) => {
      if (Array.isArray(response)) {
        setCategories(response)
      } else {
        setCategories([])
        setMessages(response.message as string)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get categories.")
    })
}

const CategoriesPage = (): React.JSX.Element => {
  const [categories, setCategories] = useState<CategoryType[] | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [showCatForm, setShowForm] = useState(false)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (values: CategoryType): void => {
    setLoading(true)
    window.api
      .updateCategory(values)
      .then((response: ApiMessageResponse) => {
        setMessages(response.message as string)
        getCategories(setCategories, setMessages, setLoading)
        toggleCatForm(null)
      })
      .catch((err: Error) => {
        setMessages((err.message as string) || 'there was a problem.')
      })
  }

  const doDelete = (catid: string): void => {
    if (window.confirm('Are you sure you want to do this?')) {
      window.api
        .deleteCategory(catid)
        .then((response: ApiMessageResponse) => {
          setMessages(response.message as string)
          getCategories(setCategories, setMessages, setLoading)
        })
        .catch((err: Error) => {
          setMessages((err.message as string) || 'there was a problem.')
        })
    }
  }

  const toggleCatForm = (catid: string | null): void => {
    setActiveCat(catid)
    setShowForm(!!catid)
  }

  useEffect(() => {
    if (!categories && !messages) {
      getCategories(setCategories, setMessages, setLoading)
    }
  }, [categories, messages])

  return (
    <PageLayout
      title="Add, Update, Delete Categories"
      messages={messages}
      button={{ action: toggleCatForm, text: 'Add a new one', value: 'newcat' }}
    >
      {loading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <Box p={5}>
          {showCatForm && (
            <EditCategory
              isOpen={showCatForm}
              catid={activeCat as string}
              categories={categories as CategoryType[]}
              toggleCatForm={() => toggleCatForm(null)}
              onSubmit={onSubmit}
            />
          )}

          {categories?.map((cat) => (
            <HStack
              key={cat.id}
              p={5}
              m={5}
              border="1px solid"
              borderRadius={5}
              w="100%"
              alignItems="start"
              justifyContent="space-between"
            >
              <Stack>
                <Image
                  src={`http://localhost:3000/${cat.img}`}
                  boxSize="75px"
                  alt={`${cat.name} - http://localhost:3000/${cat.img}`}
                  onError={(e) => {
                    e.currentTarget.src = imageLoading
                  }}
                />
                <Heading size="sm" lineHeight={2}>
                  {cat.name}
                </Heading>
              </Stack>
              <div
                style={{
                  textAlign: 'left',
                  display: 'inline-block',
                  width: '60%',
                  verticalAlign: 'top'
                }}
                dangerouslySetInnerHTML={{ __html: cat.description }}
              />
              <HStack gap={4}>
                <Button variant="ghost" size="sm" value={cat.id} onClick={() => doDelete(cat.id)}>
                  X
                </Button>
                <Button
                  recipe={buttonRecipe}
                  size="sm"
                  value={cat.id}
                  onClick={() => toggleCatForm(cat.id)}
                >
                  Edit
                </Button>
              </HStack>
            </HStack>
          ))}
          <Center>
            <Button recipe={buttonRecipe} value="newcat" onClick={() => toggleCatForm(null)}>
              {showCatForm ? 'Never mind' : 'Add a new one'}
            </Button>
          </Center>
        </Box>
      )}
    </PageLayout>
  )
}
export default CategoriesPage
