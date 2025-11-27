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
  placeholder = 'Add Content Here...'
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}): React.ReactNode => {
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
        markdown={value}
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
          imagePlugin(),
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
