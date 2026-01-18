import { useCallback, useEffect, useState } from 'react'
import EditBlogEntry from '../forms/blogentryeditor'
import EditBlogData from '../forms/blogdataeditor'
import { Box, Button, HStack, Heading, Image, Stack } from '@chakra-ui/react'
import PageLayout from '../components/layout/PageLayout'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'
import { BlogEntry, BlogInfo, SiteInfo } from 'src/shared/types'
import { ApiMessageResponse, BlogResponse } from 'src/shared/types'
import FormContainer from '../components/formcontainer'
import { convertDate } from '@renderer/components/datetimebit'

const getSiteInfo = async (setSiteData: (siteData: SiteInfo) => void): Promise<void> => {
  const response = await window.api.getSiteInfo()

  if ((response as SiteInfo).page_title) {
    setSiteData(response as SiteInfo)
  }
}

const getBlogEntries = async (
  setBlogEntries: (entries: BlogEntry[]) => void,
  setMessages: (message: string) => void,
  setBlogInfo: (info: BlogInfo) => void
): Promise<void> => {
  try {
    const json = (await window.api.getBlogEntries()) as ApiMessageResponse | BlogResponse
    const info = json as BlogInfo
    setBlogInfo(info)
    setBlogEntries(info.entries)
  } catch (error) {
    setMessages(((error as ApiMessageResponse).message as string) || "Couldn't get blog entries.")
    setBlogEntries([])
    setBlogInfo({
      page_title: '',
      page_description: '',
      page_content: '',
      entries: []
    })
  }
}

const BlogPage = (): React.JSX.Element => {
  const [blogEntries, setBlogEntries] = useState<BlogEntry[] | null>(null)
  const [blogInfo, setBlogInfo] = useState<BlogInfo | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
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
      setMessages((json as ApiMessageResponse).message as string)
    } catch (err) {
      setMessages(((err as ApiMessageResponse).message as string) || 'There was a problem.')
    } finally {
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
    }
  }

  const onSubmit = async (values: BlogEntry): Promise<void> => {
    try {
      const json = await window.api.updateBlogPost(values, [])
      setMessages((json as ApiMessageResponse).message as string)
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      toggleForm(null)
    } catch (err) {
      setMessages((err as ApiMessageResponse).message || 'there was a problem.')
    }
  }
  const doDelete = useCallback(async (e) => {
    if (window.confirm('Are you sure you want to do this?')) {
      const blogid = e?.target?.value
      try {
        const json = await window.api.deleteBlogEntry(blogid)
        setMessages(json.message)
        getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      } catch (err) {
        setMessages(
          (err as ApiMessageResponse).message || 'There was a problem deleting the entry.'
        )
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
      button={{ action: addNewBlogEntry, text: 'Add a new one', value: null }}
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
                        <HStack gap={4}>
                          <Button
                            size="sm"
                            recipe={buttonRecipe}
                            value={blog.id}
                            onClick={doDelete}
                          >
                            X
                          </Button>
                          <Button
                            size="sm"
                            recipe={buttonRecipe}
                            value={blog.id}
                            onClick={() => toggleForm(blog)}
                          >
                            Edit
                          </Button>
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
