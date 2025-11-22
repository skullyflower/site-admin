import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Image, Skeleton, Stack } from '@chakra-ui/react'

import EditCategory from '../forms/categoryeditor'
import PageLayout from '../components/PageLayout'

const getCategories = (setCategories, setMessages, setLoading) => {
  setLoading(true)
  setCategories([])
  fetch('http://localhost:4242/api/categories')
    .then((data) => data.json())
    .then((json) => {
      if (Array.isArray(json)) {
        setCategories(json)
      } else {
        setCategories([])
        setMessages(json.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get categories.")
    })
}

const Categories = () => {
  const [categories, setCategories] = useState(null)
  const [messages, setMessages] = useState(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [activeCat, setActiveCat] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (values) => {
    setLoading(true)
    const imagesArr = Array.from(values.newImage)
    var formData = new FormData()
    formData.append('category', JSON.stringify(values))

    formData.append('date', Date.now().toString())
    for (var file of imagesArr) {
      formData.append('newImage', file)
    }

    fetch('http://localhost:4242/api/categories', {
      method: 'POST',
      body: formData
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
        getCategories(setCategories, setMessages, setLoading)
        toggleCatForm()
      })
      .catch((err) => {
        setMessages(err.message || 'there was a problem.')
      })
  }

  const doDelete = useCallback((e) => {
    if (window.confirm('Are you sure you want to do this?')) {
      const category = e.target.value
      fetch(`http://localhost:4242/api/categories/${category}`, {
        method: 'DELETE'
      })
        .then((data) => data.json())
        .then((json) => {
          setMessages(json.message)
          getCategories(setCategories, setMessages, setLoading)
        })
    }
  }, [])

  const toggleCatForm = useCallback(
    (e) => {
      const category = e && e.target.value ? e.target.value : null
      setActiveCat(category)
      setShowCatForm(!!category)
    },
    [setActiveCat, setShowCatForm]
  )

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
              catid={activeCat}
              categories={categories}
              toggleCatForm={toggleCatForm}
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
                  fallbackSrc="http://localhost:3001/images/image-loading.svg"
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
                <Button variant="ghost" size="sm" value={cat.id} onClick={doDelete}>
                  X
                </Button>
                <Button variant="shopButt" size="sm" value={cat.id} onClick={toggleCatForm}>
                  Edit
                </Button>
              </HStack>
            </HStack>
          ))}
          <Center>
            <Button variant="shopButt" value="newcat" onClick={toggleCatForm}>
              {showCatForm ? 'Never mind' : 'Add a new one'}
            </Button>
          </Center>
        </Box>
      )}
    </PageLayout>
  )
}
export default Categories
