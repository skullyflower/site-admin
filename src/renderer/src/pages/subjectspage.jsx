import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'

import EditSubject from '../forms/subjectseditor'
import PageLayout from '../components/PageLayout'

const getSubjects = (setSubjects, setMessages, setLoading) => {
  setLoading(true)
  setSubjects([])
  fetch('http://localhost:4242/api/subjects')
    .then((data) => data.json())
    .then((json) => {
      if (Array.isArray(json)) {
        let keys = []
        const unique = json.filter((cat) => {
          if (!cat.id || keys.includes(cat.id)) return false
          else {
            keys.push(cat.id)
            return true
          }
        })
        setSubjects(unique)
      } else {
        setSubjects([])
        setMessages(json.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get subjects.")
    })
}

const Subjects = () => {
  const [subjects, setSubjects] = useState(null)
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

    fetch('http://localhost:4242/api/subjects', {
      method: 'POST',
      body: formData
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
        getSubjects(setSubjects, setMessages, setLoading)
        toggleCatForm()
      })
      .catch((err) => {
        setMessages(err.message || 'there was a problem.')
      })
  }

  const doDelete = useCallback((e) => {
    if (window.confirm('Are you sure you want to do this?')) {
      const category = e.target.value
      fetch(`http://localhost:4242/api/subjects/${category}`, {
        method: 'DELETE'
      })
        .then((data) => data.json())
        .then((json) => {
          setMessages(json.message)
          getSubjects(setSubjects, setMessages, setLoading)
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
    if (!subjects && !messages) {
      getSubjects(setSubjects, setMessages, setLoading)
    }
  }, [subjects, messages])

  return (
    <PageLayout
      title="Add, Update, Delete Subjects"
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
            <EditSubject
              isOpen={showCatForm}
              catid={activeCat}
              subjects={subjects}
              toggleCatForm={toggleCatForm}
              onSubmit={onSubmit}
            />
          )}

          {subjects?.map((cat) => (
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
              <Heading size="sm" lineHeight={2}>
                {cat.name}
              </Heading>
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
export default Subjects
