import { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Button, Center, Field, HStack, Input, InputGroup, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import { buttonRecipe } from '@renderer/themeRecipes'

const Sale = (): React.JSX.Element => {
  const [sale, setSale] = useState<number | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')

  useEffect(() => {
    if (sale === null) {
      window.api.getSale().then((response) => {
        setSale(response.sale ? Number(response.sale) * 100 : 0)
      })
    }
  }, [sale, setSale, setMessages])

  const onSubmit = (sale: number): void => {
    const franction = Number(sale) / 100
    window.api
      .setSale(franction) // save the decimal
      .then((response) => {
        setMessageType(response.success ? 'success' : 'error')
        setMessages(response.message || '')
      })
      .catch((err) => {
        setMessageType('error')
        setMessages(err.message || 'Failed to save sale.')
      })
      .finally(() => {
        window.api.getSale().then((response) => {
          setSale(response.sale ? Number(response.sale) * 100 : 0)
        })
      })
  }

  if (sale === null) return <div>Loading...</div>

  return (
    <PageLayout
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      title="Set Sale"
      button={{ action: onSubmit, text: 'Save', value: '' }}
    >
      <SaleForm saleValue={sale} onSubmit={onSubmit} />
    </PageLayout>
  )
}

const SaleForm = ({
  saleValue,
  onSubmit
}: {
  saleValue: number
  onSubmit: (sale: number) => void
}): React.JSX.Element => {
  const [sale, setSale] = useState<number>(saleValue)
  return (
    <Stack gap={4}>
      <div>Current Sale: {saleValue}</div>
      <Field.Root p={4} invalid={isNaN(sale) ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            Sale: <InfoBubble message="Enter a percentage to discount items." />
          </Field.Label>
          <InputGroup endAddon="%">
            <Input
              borderColor="red.300"
              type="text"
              placeholder="0"
              value={sale}
              onChange={(e) => setSale(Number(e.target.value))}
            />
          </InputGroup>
        </HStack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button recipe={buttonRecipe} onClick={() => onSubmit(sale)}>
            Update Sale
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}

export default Sale
