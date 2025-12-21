import ReactMarkdown from 'react-markdown'
function SemiSafeContent({ rawContent }: { rawContent: string | TrustedHTML }): React.JSX.Element {
  if (rawContent && typeof rawContent === 'string' && !/<[^>]*>/g.test(rawContent)) {
    return <ReactMarkdown>{rawContent as string}</ReactMarkdown>
  } else {
    const unsafePatterns = /(<[/]+script[^>]?>|javascript)/gi
    const lessDangerousContent = rawContent.toString().replace(unsafePatterns, '')
    return <div dangerouslySetInnerHTML={{ __html: lessDangerousContent }} />
  }
}

export default SemiSafeContent
