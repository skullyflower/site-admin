import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Center, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'
import EditProduct from '../forms/producteditor'
import arraySort from 'array-sort'
import PageLayout from '../components/PageLayout'
import OneProduct from '../components/oneProduct'

const getProducts = (setProducts, setMessages, setLoading) => {
  setLoading(true)
  setProducts([])
  fetch('http://localhost:4242/api/products')
    .then((data) => data.json())
    .then((json) => {
      if (Array.isArray(json)) {
        setProducts(arraySort(json, 'name'))
      } else {
        setProducts([])
        setMessages(json.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get products.")
    })
}

const getCategories = (setCategories, setMessages, setLoading) => {
  setLoading(true)
  setCategories([])
  fetch('http://localhost:4242/api/categories')
    .then((data) => data.json())
    .then((json) => {
      if (Array.isArray(json)) {
        // sort by name
        // filter out the super categories
        const categories = arraySort(json, 'name')
        const newcats = categories?.filter((cat) => cat.subcat.length === 0)
        setCategories(newcats)
      } else {
        setCategories([])
        setMessages(json.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get categories.")
    })
}

const getSubjects = (setSubjects, setMessages, setLoading) => {
  setSubjects([])
  fetch('http://localhost:4242/api/subjects')
    .then((data) => data.json())
    .then((json) => {
      if (Array.isArray(json)) {
        // sort by name
        // filter out the super categories
        const categories = arraySort(json, 'name')
        setSubjects(categories)
      } else {
        setSubjects([])
        setMessages(json.message)
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages(err.message || "Couldn't get categories.")
    })
}

const Products = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState(null)
  const [subjects, setSubjects] = useState(null)
  const [messages, setMessages] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [activeProd, setActiveProd] = useState(null)
  const [filteredFroducts, setFilteredProducts] = useState(null)
  const [filter, setFilter] = useState(null)

  const onSubmit = (values) => {
    setLoading(true)
    const imagesArr = Array.from(values.newImage)

    var formData = new FormData()

    const change = {
      ...values,
      price: Number(values.price),
      handling: Number(values.handling),
      weight: Number(values.weight)
    }

    formData.append('product', JSON.stringify(change))

    for (var file of imagesArr) {
      formData.append('newImage', file)
    }

    fetch('http://localhost:4242/api/products', {
      method: 'POST',
      body: formData
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
        getProducts(setProducts, setMessages, setLoading)
        if (filter) {
          setFilteredProducts(products.filter((prod) => prod.cat.includes(filter)))
        }
        toggleForm()
      })
      .catch((err) => {
        setMessages(err.message || 'there was a problem.')
      })
  }

  const doDelete = (prodid) => () => {
    fetch(`http://localhost:4242/api/products/${prodid}`, {
      method: 'DELETE'
    })
      .then((data) => data.json())
      .then((json) => {
        setMessages(json.message)
        getProducts(setProducts, setMessages, setLoading)
        if (filter) {
          setFilteredProducts(products.filter((prod) => prod.cat.includes(filter)))
        }
      })
  }

  const doFilterProducts = useCallback(
    (e) => {
      const filtercat = e && e.target.value ? e.target.value : null
      if (filtercat) {
        setFilter(filtercat)
      } else {
        setFilter(null)
      }
    },
    [setFilter]
  )

  const toggleForm = useCallback(
    (e) => {
      const productId = e?.target?.value
        ? e.target.name === 'copy'
          ? `${e.target.value}-copy`
          : e.target.value
        : null
      setActiveProd(productId)
      setShowForm(!!productId)
    },
    [setActiveProd, setShowForm]
  )

  useEffect(() => {
    if (!products && !messages) {
      getCategories(setCategories, setMessages, setLoading)
      getSubjects(setSubjects, setMessages, setLoading)
      getProducts(setProducts, setMessages, setLoading)
    }
    if (filter) {
      setFilteredProducts(products.filter((prod) => prod.cat.includes(filter)))
    } else {
      setFilteredProducts(products)
    }
  }, [filter, products, messages, setCategories, setProducts, setMessages])

  return (
    <PageLayout
      messages={messages}
      title="Add, Update, Delete Products"
      button={{ action: toggleForm, text: 'Add a new one', value: 'newcat' }}
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
              prodId={activeProd}
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
                    variant="shopButt"
                    onClick={doFilterProducts}
                    value={cat.id}
                  >
                    {cat.name}
                  </Button>
                ))}
              <Button size="sm" variant="shopButt" onClick={doFilterProducts} value={null}>
                Show All
              </Button>
            </HStack>
            <Stack>
              {filteredFroducts?.map((product, i) => (
                <OneProduct
                  key={product.id}
                  product={product}
                  toggleForm={toggleForm}
                  doDelete={doDelete(product.id)}
                />
              ))}
            </Stack>
            <Center p={5}>
              <Button variant="shopButt" value="newcat" onClick={toggleForm}>
                {showForm ? 'Never mind' : 'Add a new one'}
              </Button>
            </Center>
          </Stack>
        </Box>
      )}
    </PageLayout>
  )
}
export default Products
