import { IoMdInformationCircleOutline } from 'react-icons/io'
import { Popover, IconButton, Portal } from '@chakra-ui/react'

interface InfoBubbleProps extends React.HTMLAttributes<HTMLButtonElement> {
  message: string
}
const InfoBubble = ({ message, ...props }: InfoBubbleProps): React.ReactNode => {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger asChild>
        <IconButton aria-label="More info" variant="ghost" color="gray.300" size="xs">
          <IoMdInformationCircleOutline />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>{message}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
export default InfoBubble
