import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { ApiMessageResponse, Subject } from 'src/shared/types'
import EditSubject from '../forms/subjectseditor'
import PageLayout from '../components/layout/PageLayout'
import { buttonRecipe } from '@renderer/themeRecipes'
import SemiSafeContent from '../components/SemiSafeContent'
import FormContainer from '@renderer/components/formcontainer'

const getSubjects = (
  setSubjects: (subjects: Subject[]) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void
): void => {
  setLoading(true)
  setSubjects([])
  window.api
    .getSubjects()
    .then((response) => {
      if (Array.isArray(response)) {
        setSubjects(response.sort((a: Subject, b: Subject) => a.name.localeCompare(b.name)))
      } else {
        setSubjects([])
        setMessages(response.message as string)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get subjects.")
    })
}

const SubjectsPage = (): React.JSX.Element => {
  const [subjects, setSubjects] = useState<Subject[] | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (values: Subject): void => {
    setLoading(true)
    window.api
      .updateSubject(values)
      .then((response: ApiMessageResponse | Subject[]) => {
        if (Array.isArray(response)) {
          setSubjects(response)
        } else {
          setMessages(response.message as string)
        }
      })
      .catch((err: Error) => {
        setMessages(err.message || "Couldn't update subjects.")
      })
  }

  const doDelete = useCallback((catid: string) => {
    if (window.confirm('Are you sure you want to do this?')) {
      window.api
        .deleteSubject(catid)
        .then((response: ApiMessageResponse) => {
          setMessages(response.message as string)
          getSubjects(setSubjects, setMessages, setLoading)
        })
        .catch((err: Error) => {
          setMessages(err.message || "Couldn't delete subject.")
        })
    }
  }, [])

  const toggleSubjectForm = (subjectid: string | null): void => {
    setActiveCat(subjectid)
    setShowCatForm(!!subjectid)
  }

  useEffect(() => {
    if (!subjects && !messages) {
      getSubjects(setSubjects, setMessages, setLoading)
    }
  }, [subjects, messages])

  return (
    <PageLayout
      title="Add, Update, Delete Subjects"
      messages={messages}
      button={{ action: () => toggleSubjectForm('newcat'), text: 'Add a new one', value: 'newcat' }}
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
              <EditSubject
                isOpen={showCatForm}
                subjectid={activeCat as string}
                subjects={subjects as Subject[]}
                toggleSubjectForm={() => toggleSubjectForm(activeCat as string | null)}
                onSubmit={(values: Subject) => onSubmit(values)}
              />
            </FormContainer>
          )}
          <Stack>
            {subjects?.map((cat) => (
              <HStack
                key={cat.id}
                p={5}
                border="1px solid"
                borderRadius={5}
                w="100%"
                alignItems="start"
                justifyContent="space-between"
              >
                <Stack>
                  <Heading size="sm" lineHeight={2}>
                    {cat.name}
                  </Heading>
                  <SemiSafeContent rawContent={cat.description} />
                </Stack>
                <HStack gap={4}>
                  <Button variant="ghost" size="sm" value={cat.id} onClick={() => doDelete(cat.id)}>
                    X
                  </Button>
                  <Button
                    recipe={buttonRecipe}
                    size="sm"
                    value={cat.id}
                    onClick={() => toggleSubjectForm(cat.id)}
                  >
                    Edit
                  </Button>
                </HStack>
              </HStack>
            ))}
            <Center>
              <Button
                recipe={buttonRecipe}
                value="newcat"
                onClick={() => toggleSubjectForm('newcat')}
              >
                {showCatForm ? 'Never mind' : 'Add a new one'}
              </Button>
            </Center>
          </Stack>
        </Box>
      )}
    </PageLayout>
  )
}
export default SubjectsPage
