interface Options {
  uppercaseFirstWord?: boolean
  splitWords?: RegExp
}
export function camelCase(str: string, options?: Options) {
  const { uppercaseFirstWord = false, splitWords = /-|_/ } = options || {}
  const result = str.split(splitWords)
    .map((word, i) => (i == 0 && !uppercaseFirstWord)
      ? word.toLowerCase()
      : word[0].toUpperCase() + word.toLowerCase().slice(1))
    .join('')
  console.log(str, splitWords, result)
  return result
}
