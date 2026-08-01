import { useEffect, useState } from 'react'

const useTags = (): string[] => {
  const [tagList, setTagList] = useState<string[]>([])
  useEffect(() => {
    window.api.getAllTags().then((data) => {
      if (!data.success) {
        throw data.message || ''
      } else {
        setTagList(data.data || [])
      }
    })
  }, [tagList.length])
  return tagList
}
export default useTags
