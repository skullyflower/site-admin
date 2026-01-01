import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PageLayout from '../components/PageLayout'
import { Button, Center, Field, HStack, Input, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import { ApiMessageResponse } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'

const getSale = (
  setSale: (sale: number) => void,
  setMessages: (messages: string) => void
): void => {
  window.api.getSale().then((response: ApiMessageResponse | number) => {
    if (typeof response === 'object' && 'message' in response) {
      setMessages(response.message as string)
    } else {
      setSale(response as number)
    }
  })
}

const Sale = (): React.JSX.Element => {
  const [sale, setSale] = useState<number | null>(null)
  const [messages, setMessages] = useState<string | null>(null)

  useEffect(() => {
    if (sale === null) {
      getSale(setSale, setMessages)
    }
  }, [sale, setSale, setMessages])

  const onSubmit = (values: number): void => {
    window.api
      .setSale(values)
      .then((response: ApiMessageResponse) => {
        setMessages(response.message)
        getSale(setSale, setMessages)
      })
      .catch((err) => {
        setMessages(err.message || 'Failed to save sale.')
      })
  }

  if (sale === null) return <div>Loading...</div>

  return (
    <PageLayout
      messages={messages}
      title="Set Sale"
      button={{ action: onSubmit, text: 'Update', value: '' }}
    >
      <SaleForm formData={sale} onSubmit={onSubmit} />
    </PageLayout>
  )
}

const SaleForm = ({
  formData,
  onSubmit
}: {
  formData: number
  onSubmit: (values: number) => void
}): React.JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useForm({ defaultValues: { sale: formData }, mode: 'onChange' })

  return (
    <Stack gap={4}>
      <div>Current Sale: {formData}</div>
      <Field.Root p={4} invalid={errors.sale ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            Sale: <InfoBubble message="percent" />
          </Field.Label>
          <Input
            borderColor="red.300"
            type="text"
            placeholder=".00"
            {...register('sale', {
              required: true,
              validate: (value: number) => !isNaN(value)
            })}
          />
        </HStack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button recipe={buttonRecipe} onClick={() => onSubmit(formData)}>
            Update Sale
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}

export default Sale
