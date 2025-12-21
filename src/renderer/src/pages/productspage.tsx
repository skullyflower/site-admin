import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'
import EditProduct from '../forms/producteditor'
import PageLayout from '../components/PageLayout'
import OneProduct from '../components/oneProduct'
import { ApiMessageResponse, CategoryType, ProductType, Subject } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'

const getProducts = (setProducts, setMessages, setLoading): void => {
  setLoading(true)
  setProducts([])
  window.api
    .getProducts()
    .then((response: ApiMessageResponse | ProductType[]) => {
      if (Array.isArray(response)) {
        setProducts(response.sort((a: ProductType, b: ProductType) => a.name.localeCompare(b.name)))
      } else {
        setProducts([])
        setMessages(response.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get products.")
    })
}

const getCategories = (
  setCategories: (categories: CategoryType[]) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void
): void => {
  setLoading(true)
  setCategories([])
  window.api
    .getCategories()
    .then((response: ApiMessageResponse | CategoryType[]) => {
      if (Array.isArray(response)) {
        // sort by name
        // filter out the super categories
        const categories: CategoryType[] = response.sort((a: CategoryType, b: CategoryType) =>
          a.name.localeCompare(b.name)
        )
        const newcats: CategoryType[] = categories.filter(
          (cat: CategoryType) => cat.subcat.length === 0
        )
        setCategories(newcats)
      } else {
        setCategories([])
        setMessages(response.message as string)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages((err.message as string) || "Couldn't get categories.")
    })
}

const getSubjects = (
  setSubjects: (subjects: Subject[]) => void,
  setMessages: (message: string) => void,
  setLoading: (loading: boolean) => void
): void => {
  setSubjects([])
  window.api
    .getSubjects()
    .then((response: ApiMessageResponse | Subject[]) => {
      if (Array.isArray(response)) {
        // sort by name
        // filter out the super categories
        const subjects: Subject[] = response.sort((a: Subject, b: Subject) =>
          a.name.localeCompare(b.name)
        )
        setSubjects(subjects)
      } else {
        setSubjects([])
        setMessages(response.message as string)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages((err.message as string) || "Couldn't get subjects.")
    })
}

const ProductsPage = (): React.JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [messages, setMessages] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [activeProd, setActiveProd] = useState<string | null>(null)
  const [filteredFroducts, setFilteredProducts] = useState<ProductType[] | null>(null)
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

    //formData.append('product', JSON.stringify(change))

    // for (var file of imagesArr) {
    //   formData.append('newImage', file as Blob)
    // }

    window.api
      .updateProduct(change)
      .then((response: ApiMessageResponse) => {
        setMessages(response.message as string)
        getProducts(setProducts, setMessages, setLoading)
        if (filter) {
          setFilteredProducts(
            products.filter((prod: ProductType) => prod.cat.includes(filter as string))
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
      getProducts(setProducts, setMessages, setLoading)
      if (filter) {
        setFilteredProducts(products.filter((prod) => prod.cat.includes(filter)))
      }
    })
  }

  const doFilterProducts = useCallback(
    (filtercat: string | null) => {
      setFilter(filtercat)
      setFilteredProducts(
        filtercat
          ? products.filter((prod: ProductType) => prod.cat.includes(filtercat as string))
          : products
      )
    },
    [setFilter, products, setFilteredProducts]
  )

  const toggleForm = (productId: string | null): void => {
    setActiveProd(productId)
    setShowForm(!!productId)
  }

  useEffect(() => {
    if (!products?.length && !messages) {
      getCategories(setCategories, setMessages, setLoading)
      getSubjects(setSubjects, setMessages, setLoading)
      getProducts(setProducts, setMessages, setLoading)
    }
  }, [products, messages, setCategories, setProducts, setMessages, setSubjects, setLoading])

  return (
    <PageLayout
      messages={messages}
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
            <EditProduct
              isOpen={showForm}
              prodId={activeProd as string}
              categories={categories}
              subjects={subjects}
              products={products}
              toggleForm={toggleForm}
              onSubmit={onSubmit}
            />
          )}
          <Stack gap={4}>
            <HStack wrap="wrap" alignItems="flex-start" justifyContent="center">
              <Heading size="sm">Filter by category</Heading>
              {categories?.length > 0 &&
                categories.map((cat) => (
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
