import { useCallback, useEffect, useState } from 'react'
import EditBlogEntry from '../forms/blogentryeditor'
import EditBlogData from '../forms/blogdataeditor'
import { Box, Button, HStack, Heading, Image, Stack } from '@chakra-ui/react'
import PageLayout from '../components/PageLayout'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'
import { BlogEntry, BlogInfo, SiteInfo } from 'src/shared/types'
import { ApiMessageResponse, BlogResponse } from 'src/shared/types'

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
  const [activeBlog, setActiveBlog] = useState<string | null>(null)
  const [sitedata, setSiteData] = useState<SiteInfo | null>()
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
      toggleForm()
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

  const toggleForm = (blogid?: string | null): void => {
    setActiveBlog(blogid || null)
    setShowForm(!!blogid)
  }

  useEffect(() => {
    if (!blogEntries && !messages) {
      getBlogEntries(setBlogEntries, setMessages, setBlogInfo)
      getSiteInfo(setSiteData)
    }
  }, [blogEntries, blogInfo, messages, setBlogEntries, setMessages, setBlogInfo])

  return (
    <PageLayout
      title="Update Yer Blarrgh"
      messages={messages}
      button={{ action: toggleForm, text: 'Add a new one', value: 'newentry' }}
    >
      <div className="content">
        {showForm ? (
          <Box
            w={['95vw', '93vw', '88vw', '85vw', '1000px']}
            marginInline={'auto'}
            overflow={'auto'}
            backgroundColor="slate.800"
            borderWidth={2}
            borderStyle="solid"
            borderColor="slate.500"
            p={5}
            borderRadius={5}
          >
            <EditBlogEntry
              sitedata={sitedata as SiteInfo}
              blogid={activeBlog as string}
              blogEntries={blogEntries as BlogEntry[]}
              toggleForm={toggleForm}
              onSubmit={(values: BlogEntry) => onSubmit(values as BlogEntry)}
            />
          </Box>
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
                            sitedata?.live_site_url || '',
                            'http://localhost:3000/'
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
                            onClick={() => toggleForm(blog.id)}
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
