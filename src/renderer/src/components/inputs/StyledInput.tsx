import { Box } from '@chakra-ui/react'
import {
  MDXEditor,
  BlockTypeSelect,
  headingsPlugin,
  imagePlugin,
  InsertThematicBreak,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CreateLink,
  InsertImage,
  ListsToggle
} from '@mdxeditor/editor'
import '@renderer/assets/main.css'
import '@mdxeditor/editor/style.css'
import '@radix-ui/colors/slate-dark.css'
import '@renderer/assets/styledinput.css'

const previewImage = async (imageSource: string): Promise<string> =>
  `http://localhost:3000${imageSource}`

const StyledInput = ({
  value,
  onChange,
  placeholder = 'Add Content Here...',
  onUploadImage
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUploadImage?: (image: string) => Promise<string>
}): React.ReactNode => {
  const addUploadImages = async (image: File): Promise<string> => {
    const result = await window.api.getPreviewImages([image])
    if (result.data?.[0] && onUploadImage) {
      const imageUrl = await onUploadImage(result.data[0])
      return imageUrl as string
    }
    return result.data?.[0] || ''
  }

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderRadius={4}
      p={2}
      width="100%"
      borderColor="slate.500"
      position="relative"
      overflow="hidden"
    >
      <MDXEditor
        markdown={
          value
            ?.replace(/<[/]*p>/g, '')
            .replace(/<[/]*[^>]*>/g, '')
            ?.replace('src="', 'src="http://localhost:3000') || ''
        }
        onChange={onChange}
        placeholder={placeholder}
        className="dark-theme dark-editor"
        contentEditableClassName="editor-content"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin({
            linkAutocompleteSuggestions: ['https://www.example.com/'],
            showLinkTitleField: false
          }),
          quotePlugin(),
          thematicBreakPlugin(),
          imagePlugin({
            imageUploadHandler: addUploadImages,
            imagePreviewHandler: previewImage
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <ListsToggle />
                <InsertThematicBreak />
                <InsertImage />
                <UndoRedo />
              </>
            )
          })
        ]}
      />
    </Box>
  )
}

export default StyledInput
