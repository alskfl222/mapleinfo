export const convertNumToStr = (number: number): string => {
  if (number >= 1000000000000) {
    return `${(number / 1000000000000).toFixed(2)}조`
  }
  if (number >= 100000000) {
    return `${Math.round(number / 100000000)}억`
  }
  if (number >= 10000) {
    return `${Math.round(number / 10000)}만`
  }
  return `${number}`
}

export const convertPerToStr = (number: number): string => {
  return `${(number * 100).toFixed(3)}%`
}