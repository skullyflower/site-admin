const padValue = (val: number): string => {
  return !isNaN(val) && val < 10 ? `0${val}` : `${val}`
}

export const convertDate = (date: Date, to: string): string => {
  const yr = date.getFullYear().toString()
  const mo = date.getMonth() + 1
  const day = date.getDate()
  const hrs = date.getHours()
  const min = date.getMinutes()
  if (to === 'id') {
    return `${yr}${padValue(mo)}${padValue(day)}${padValue(hrs)}${padValue(min)}`
  }
  if (to === 'input') {
    return `${yr}-${padValue(mo)}-${padValue(day)}T${padValue(hrs)}:${padValue(min)}`
  }
  return date.toUTCString()
}
