import { Box /*, Editable,  Heading, Link, List, /* Stack, */ /* Text */ } from '@chakra-ui/react'
//import { useRef, useState } from 'react'
//import ReactMarkdown from 'react-markdown'
//import { useEffect } from 'react'
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
import '@mdxeditor/editor/style.css'
import '@radix-ui/colors/slate-dark.css'

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
    if (result && onUploadImage) {
      const imageUrl = await onUploadImage(result[0].replace('http://localhost:3000/', ''))
      console.log('imageUrl', imageUrl)
      return imageUrl as string // relative url to the image for use in the content block, not the staging url.
    }
    return result[0]
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
        markdown={value.replace(/<[/]*p>/g, '').replace(/<[/]*[^>]*>/g, '')}
        onChange={onChange}
        placeholder={placeholder}
        className="dark-theme dark-editor"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin({
            linkAutocompleteSuggestions: [
              'https://skullyflowers.com/',
              'https://rarr-recoveru.org/'
            ],
            showLinkTitleField: false
          }),
          quotePlugin(),
          thematicBreakPlugin(),
          imagePlugin({
            imageUploadHandler: addUploadImages
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
