import { useCallback, useEffect, useState } from 'react'
import EditBlogEntry from '../forms/blogentryeditor'
import EditBlogData from '../forms/blogdataeditor'
import { Box, IconButton, HStack, Heading, Image, Stack } from '@chakra-ui/react'
import PageLayout from '../components/layout/PageLayout'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'
import { BlogEntry, BlogInfo, SiteInfo } from 'src/shared/types'
import FormContainer from '../components/formcontainer'
import { convertDate } from '@renderer/components/datetimebit'
import { PencilIcon, TrashIcon } from '@phosphor-icons/react'

const getSiteInfo = async (setSiteData: (siteData: SiteInfo) => void): Promise<void> => {
  const response = await window.api.getSiteInfo()
  if (response.success && response.data?.page_title) {
    setSiteData(response.data)
  }
}

const getBlogEntries = async (
  setBlogEntries: (entries: BlogEntry[]) => void,
  setMessages: (message: string) => void,
  setBlogInfo: (info: BlogInfo) => void
): Promise<void> => {
  try {
    const json = await window.api.getBlogEntries()
    if (json.success && json.data) {
      setBlogInfo(json.data)
      setBlogEntries(json.data.entries)
    } else {
      setMessages(json.message || "Couldn't get blog entries.")
      setBlogEntries([])
    }
  } catch {
    setMessages("Couldn't get blog entries.")
    setBlogEntries([])
    setBlogInfo({ page_title: '', page_description: '', page_content: '', entries: [] })
  }
}

const BlogPage = (): React.JSX.Element => {
  const [blogEntries, setBlogEntries] = useState<BlogEntry[] | null>(null)
  const [blogInfo, setBlogInfo] = useState<BlogInfo | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('error')
  const [showForm, setShowForm] = useState(false)
  const [activeBlog, setActiveBlog] = useState<BlogEntry | null>(null)
  const [sitedata, setSiteData] = useState<SiteInfo | null>()

  const addNewBlogEntry = (): void => {
    const today = new Date()
    setActiveBlog({
      id: convertDate(today, 'id'),
      date: convertDate(today, 'input'),
      title: '',
      imagelink: '',
      image: '',
      imagealt: '',
      imgcaption: '',
      heading: '',
      text: '',
      tags: []
    })
    setShowForm(true)
  }

  const onUpdateInfo = async (values: BlogInfo): Promise<void> => {
    setMessages(null as unknown as string)
    try {
      const json = await window.api.updateBlogInfo(values)
      setMessages(json.message || '')
      setMessageType(json.success ? 'success' : 'error')
    } catch (err) {
      setMessages((err as Error).message || 'There was a problem.')
      setMessageType('error')
    } finally {
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
    }
  }

  const onSubmit = async (values: BlogEntry): Promise<void> => {
    try {
      const json = await window.api.updateBlogPost(values, [])
      setMessages(json.message || '')
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      toggleForm(null)
    } catch (err) {
      setMessages((err as Error).message || 'there was a problem.')
      setMessageType('error')
    }
  }
  const doDelete = useCallback(async (e) => {
    if (window.confirm('Are you sure you want to do this?')) {
      const blogid = e?.target?.value
      try {
        const json = await window.api.deleteBlogEntry(blogid)
        setMessages(json.message || '')
        setMessageType(json.success ? 'success' : 'error')
        getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      } catch (err) {
        setMessages((err as Error).message || 'There was a problem deleting the entry.')
        setMessageType('error')
      }
    }
  }, [])

  const toggleForm = (blog: BlogEntry | null): void => {
    setActiveBlog(blog || null)
    setShowForm(!!blog)
  }

  useEffect(() => {
    if (!blogInfo && !messages) {
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      getSiteInfo(setSiteData)
    }
  }, [blogEntries, blogInfo, messages, setBlogEntries, setMessages, setBlogInfo])

  return (
    <PageLayout
      title="Update Yer Blarrgh"
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      button={{ action: addNewBlogEntry, text: 'Add one', value: null }}
    >
      <div className="content">
        {showForm ? (
          <FormContainer>
            <EditBlogEntry
              sitedata={sitedata as SiteInfo}
              thisEntry={activeBlog as BlogEntry}
              toggleForm={() => toggleForm(null)}
              onSubmit={(values: BlogEntry) => onSubmit(values as BlogEntry)}
            />
          </FormContainer>
        ) : (
          <Box p={5}>
            {blogInfo && <EditBlogData blogInfo={blogInfo} onSubmit={onUpdateInfo} />}

            <Stack>
              {blogEntries?.length ? (
                blogEntries.map(
                  (blog) =>
                    blog && (
                      <HStack
                        key={blog.id}
                        p={5}
                        border="1px solid"
                        borderRadius={5}
                        w="100%"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={4}
                      >
                        <Image
                          src={blog.image.replace(
                            sitedata?.live_site_url as string,
                            'http://localhost:3000'
                          )}
                          boxSize="120px"
                          alt={blog.imagealt}
                        />
                        <Stack flexGrow={1}>
                          <Heading size="md">{blog.title}</Heading>
                          <div>
                            <a
                              href={`http://localhost:3000/blogentry/${blog.id}`}
                              target="blogwindow"
                            >
                              {blog.heading}
                            </a>
                            <p>{blog.date}</p>
                          </div>
                        </Stack>
                        <HStack gap={2}>
                          <IconButton
                            aria-label="Delete blog entry"
                            aria-labelledby="Delete blog entry"
                            padding={2}
                            size="sm"
                            recipe={buttonRecipe}
                            value={blog.id}
                            onClick={doDelete}
                          >
                            <TrashIcon />
                          </IconButton>
                          <IconButton
                            size="sm"
                            recipe={buttonRecipe}
                            padding={2}
                            value={blog.id}
                            onClick={() => toggleForm(blog)}
                          >
                            <PencilIcon />
                          </IconButton>
                        </HStack>
                      </HStack>
                    )
                )
              ) : (
                <p className="centered">no blog entries yet</p>
              )}
            </Stack>
          </Box>
        )}
      </div>
    </PageLayout>
  )
}
export default BlogPage
