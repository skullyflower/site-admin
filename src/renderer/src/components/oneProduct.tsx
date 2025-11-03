import { Button, HStack, Image, useDisclosure, Stack, IconButton } from '@chakra-ui/react'
import ConfirmDelete from './ConfirmDelete'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { buttonRecipe } from '@renderer/themeRecipes'

interface OneProductProps {
  product: {
    id: string
    img: string
    name: string
    desc: string
    desc_long: string
    soldout: boolean
    price: number
  }
  toggleForm: () => void
  doDelete: () => void
}
const OneProduct = ({ product, toggleForm, doDelete }: OneProductProps): React.ReactNode => {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <HStack
      key={product.id}
      p={5}
      border="1px solid"
      borderRadius={5}
      w="100%"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Stack align={'center'} gap={2}>
        <Image
          src={`http://localhost:3000/shop/${product.img}`}
          boxSize="100px"
          alt={product.name}
        />
        <div>{product.soldout ? 'Sold Out' : `$${Number(product.price).toFixed(2)}`}</div>
      </Stack>
      <div style={{ width: '60%' }}>
        <h3>
          <a href={`http://localhost:3000/shop/product/${product.id}`} target="blogwindow">
            {product.name}
          </a>
        </h3>
        <div
          style={{ textAlign: 'left', verticalAlign: 'top' }}
          dangerouslySetInnerHTML={{ __html: product.desc }}
        />
        <div
          style={{ textAlign: 'left', verticalAlign: 'top' }}
          dangerouslySetInnerHTML={{ __html: product.desc_long }}
        />
      </div>
      <HStack gap={2}>
        <IconButton
          aria-label="Delete product"
          aria-labelledby="Delete product"
          size="sm"
          recipe={buttonRecipe}
          value={product.id}
          onClick={onOpen}
        >
          <RiDeleteBin6Line />
        </IconButton>
        <Button size="sm" recipe={buttonRecipe} value={product.id} onClick={toggleForm}>
          Edit
        </Button>
        <Button size="sm" recipe={buttonRecipe} name="copy" value={product.id} onClick={toggleForm}>
          copy
        </Button>
      </HStack>
      <ConfirmDelete what={product.name} action={doDelete} onClose={onClose} isOpen={open} />
    </HStack>
  )
}
export default OneProduct
