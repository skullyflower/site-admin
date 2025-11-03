export type BlogInfo = {
  page_title: string
  page_description: string
  entries: BlogEntry[]
}
export type BlogEntry = {
  id: string
  title: string
  image: string
  imagelink: string
  date: string
  imagealt: string
  imgcaption: string
  heading: string
  text: string
}
