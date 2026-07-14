import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, Heading, Skeleton, Stack } from '@chakra-ui/react'
import EditProduct from '@renderer/forms/producteditor'
import PageLayout from '@renderer/components/layout/PageLayout'
import OneProduct from '@renderer/components/oneProduct'
import { CategoryType, ProductType, Subject } from '../../../../src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import FormContainer from '@renderer/components/formcontainer'
import { newprodId } from '@renderer/forms/producteditor'
import ButtonSelector from '@renderer/components/inputs/ButtonSelector'
import useSearchBox from '@renderer/hooks/useSearchBox'

type ShopData = {
  products: ProductType[]
  categories: CategoryType[]
  subjects: Subject[]
}

const getShopData = async (
  setShopData: (shopData: ShopData) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void,
  setMessageType: (type: 'info' | 'warning' | 'error' | 'success') => void
): Promise<void> => {
  setLoading(true)
  const siteInfo = await window.api.getSiteInfo()
  if (!siteInfo.success) {
    setMessageType('error')
    setMessages(siteInfo.message || '')
    setLoading(false)
    return
  }
  if (siteInfo.data?.features && Array.isArray(siteInfo.data.features)) {
    let products: ProductType[] = []
    let categories: CategoryType[] = []
    let subjects: Subject[] = []
    if (siteInfo.data.features.includes('products')) {
      const r = await window.api.getProducts()
      products = r.data || []
    }
    if (siteInfo.data.features.includes('categories')) {
      const r = await window.api.getCategories()
      categories = r.success ? (r.data || []).filter((cat) => cat.subcat.length === 0) : []
    }
    if (siteInfo.data.features.includes('subjects')) {
      const r = await window.api.getSubjects()
      subjects = r.success ? r.data || [] : []
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
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [showForm, setShowForm] = useState(false)
  const [activeProd, setActiveProd] = useState<string | null>(null)

  const [categoryProducts, setCategoryProducts] = useState<ProductType[]>(shopData?.products || [])
  const [category, setCategory] = useState<string | null>(null)

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
      .then((response) => {
        setMessageType(response.success ? 'success' : 'error')
        setMessages(response.message || '')
      })
      .then(() => {
        getShopData(setShopData, setMessages, setLoading, setMessageType)
        if (category && shopData?.products) {
          setCategoryProducts(
            shopData.products.filter((prod: ProductType) => prod.cat.includes(category as string))
          )
        }
        toggleForm(null)
      })
      .catch((err: Error) => {
        setMessageType('error')
        setMessages((err.message as string) || 'there was a problem.')
      })
  }

  const doDelete = (prodid: string) => () => {
    window.api.deleteProduct(prodid).then((json) => {
      setMessageType(json.success ? 'success' : 'error')
      setMessages(json.message || '')
      getShopData(setShopData, setMessages, setLoading, setMessageType)
      if (category && shopData?.products) {
        setCategoryProducts(shopData.products.filter((prod) => prod.cat.includes(category)))
      }
    })
  }

  const getCategoryProducts = useCallback(
    (filtercat: string | null) => {
      if (shopData?.products) {
        setCategory(filtercat)
        setCategoryProducts(
          filtercat
            ? shopData.products.filter((prod: ProductType) =>
                prod.cat.includes(filtercat as string)
              )
            : shopData.products
        )
      }
    },
    [setCategory, shopData, setCategoryProducts]
  )

  const toggleForm = (productId: string | null): void => {
    setActiveProd(productId === newprodId ? null : productId)
    setShowForm(!!productId)
  }

  useEffect(() => {
    if (!shopData && !messages) {
      getShopData(setShopData, setMessages, setLoading, setMessageType)
    }
  }, [shopData, messages, setShopData, setMessages, setLoading])
  const { filteredData, searchBox } = useSearchBox(
    categoryProducts ?? shopData?.products,
    (i: ProductType) => i.name
  )

  return (
    <PageLayout
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      title="Add, Update, Delete Products"
      button={{ action: () => toggleForm(newprodId), text: 'Add one', value: newprodId }}
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
                categories={shopData?.categories ?? []}
                subjects={shopData?.subjects ?? []}
                products={shopData?.products ?? []}
                toggleForm={toggleForm}
                onSubmit={onSubmit}
              />
            </FormContainer>
          )}
          <Stack gap={4}>
            <ButtonSelector
              dataList={shopData?.categories ?? []}
              sortProp="name"
              valueProp="id"
              labelText="Show Products from category"
              onChange={getCategoryProducts}
            />
            {category && (
              <Heading size="md">
                {shopData?.categories.find((c) => c.id === category)?.name}
              </Heading>
            )}
            <Stack>
              {searchBox}
              {filteredData?.map((product) => (
                <OneProduct
                  key={product.id}
                  product={product}
                  toggleForm={() => toggleForm(product.id)}
                  doDelete={doDelete(product.id)}
                />
              ))}
            </Stack>
            <Center p={5}>
              <Button recipe={buttonRecipe} value={newprodId} onClick={() => toggleForm(newprodId)}>
                {showForm ? 'Never mind' : 'Add one'}
              </Button>
            </Center>
          </Stack>
        </Box>
      )}
    </PageLayout>
  )
}
export default ProductsPage
