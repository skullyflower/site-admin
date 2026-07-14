import * as Icons from '@phosphor-icons/react'

const DynamicIcon = ({
  iconName,
  size
}: {
  iconName?: string
  size?: number
}): React.JSX.Element => {
  const SelectedIcon = iconName ? Icons[iconName] : Icons.QuestionIcon

  return <SelectedIcon size={size || 24} />
}
export default DynamicIcon
