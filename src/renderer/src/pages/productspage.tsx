import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'
import EditProduct from '../forms/producteditor'
import PageLayout from '../components/layout/PageLayout'
import OneProduct from '../components/oneProduct'
import { ApiMessageResponse, CategoryType, ProductType, Subject } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import FormContainer from '@renderer/components/formcontainer'

type ShopData = {
  products: ProductType[]
  categories: CategoryType[]
  subjects: Subject[]
}

const getShopData = async (
  setShopData: (shopData: ShopData) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)
  const siteInfo = await window.api.getSiteInfo()
  if (typeof siteInfo === 'object' && 'message' in siteInfo) {
    setMessages((siteInfo as ApiMessageResponse).message as string)
    setLoading(false)
    return
  }
  if (typeof siteInfo === 'object' && 'features' in siteInfo && Array.isArray(siteInfo.features)) {
    let products: ProductType[] = []
    let categories: CategoryType[] = []
    let subjects: Subject[] = []
    if (siteInfo.features.includes('products')) {
      products = (await window.api.getProducts()) as ProductType[]
    }
    if (siteInfo.features.includes('categories')) {
      categories = await window.api.getCategories()
      if (typeof categories === 'object' && !('message' in categories)) {
        categories = categories as CategoryType[]
      } else {
        categories = []
      }
    }
    if (siteInfo.features.includes('subjects')) {
      subjects = await window.api.getSubjects()
      if (typeof subjects === 'object' && !('message' in subjects)) {
        subjects = subjects as Subject[]
      } else {
        subjects = []
      }
    }
    setShopData({
      products: products || [],
      categories: categories || [],
      subjects: subjects || []
    })
    setLoading(false)
  }
}

const ProductsPage = (): React.JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [shopData, setShopData] = useState<ShopData | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [activeProd, setActiveProd] = useState<string | null>(null)

  const [filteredFroducts, setFilteredProducts] = useState<ProductType[] | null>(
    shopData?.products || null
  )
  const [filter, setFilter] = useState<string | null>(null)

  const onSubmit = (values: ProductType): void => {
    setLoading(true)
    //const imagesArr = Array.from(values.newImage)

    //var formData = new FormData()

    const change = {
      ...values,
      price: Number(values.price),
      handling: Number(values.handling),
      weight: Number(values.weight)
    }

    window.api
      .updateProduct(change)
      .then((response: ApiMessageResponse) => {
        setMessages(response.message as string)
        getShopData(setShopData, setMessages, setLoading)
        if (filter && shopData?.products) {
          setFilteredProducts(
            shopData.products.filter((prod: ProductType) => prod.cat.includes(filter as string))
          )
        }
        toggleForm(null)
      })
      .catch((err: Error) => {
        setMessages((err.message as string) || 'there was a problem.')
      })
  }

  const doDelete = (prodid: string) => () => {
    window.api.deleteProduct(prodid).then((json) => {
      setMessages(json.message)
      getShopData(setShopData, setMessages, setLoading)
      if (filter && shopData?.products) {
        setFilteredProducts(shopData.products.filter((prod) => prod.cat.includes(filter)))
      }
    })
  }

  const doFilterProducts = useCallback(
    (filtercat: string | null) => {
      if (shopData?.products) {
        setFilter(filtercat)
        setFilteredProducts(
          filtercat
            ? shopData.products.filter((prod: ProductType) =>
                prod.cat.includes(filtercat as string)
              )
            : shopData.products
        )
      }
    },
    [setFilter, shopData, setFilteredProducts]
  )

  const toggleForm = (productId: string | null): void => {
    setActiveProd(productId)
    setShowForm(!!productId)
  }

  useEffect(() => {
    if (!shopData && !messages) {
      getShopData(setShopData, setMessages, setLoading)
    }
  }, [shopData, messages, setShopData, setMessages, setLoading])

  return (
    <PageLayout
      messages={messages}
      setMessages={setMessages}
      title="Add, Update, Delete Products"
      button={{ action: () => toggleForm('newcat'), text: 'Add a new one', value: 'newcat' }}
    >
      {loading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <Box p={5} padding={0}>
          {showForm && (
            <FormContainer>
              <EditProduct
                isOpen={showForm}
                prodId={activeProd as string}
                categories={shopData?.categories as CategoryType[]}
                subjects={shopData?.subjects as Subject[]}
                products={shopData?.products as ProductType[]}
                toggleForm={toggleForm}
                onSubmit={onSubmit}
              />
            </FormContainer>
          )}
          <Stack gap={4}>
            <HStack wrap="wrap" alignItems="flex-start" justifyContent="center">
              <Heading size="sm">Filter by category</Heading>
              {shopData?.categories &&
                Array.isArray(shopData.categories) &&
                shopData.categories.length > 0 &&
                shopData.categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="xs"
                    minW="fit-content"
                    recipe={buttonRecipe}
                    onClick={() => doFilterProducts(cat.id)}
                    value={cat.id}
                  >
                    {cat.name}
                  </Button>
                ))}
              <Button
                size="sm"
                recipe={buttonRecipe}
                onClick={() => doFilterProducts(null)}
                value={''}
              >
                Show All
              </Button>
            </HStack>
            <Stack>
              {filteredFroducts?.map((product) => (
                <OneProduct
                  key={product.id}
                  product={product}
                  toggleForm={() => toggleForm(product.id)}
                  doDelete={doDelete(product.id)}
                />
              ))}
            </Stack>
            <Center p={5}>
              <Button recipe={buttonRecipe} value="newcat" onClick={() => toggleForm('newcat')}>
                {showForm ? 'Never mind' : 'Add a new one'}
              </Button>
            </Center>
          </Stack>
        </Box>
      )}
    </PageLayout>
  )
}
export default ProductsPage
