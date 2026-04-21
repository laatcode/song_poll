const setFixedTextLengthWithCharacters = (text, length, character=' ') => {
  text = String(text)

  if (text.length > length) {
    return text.slice(0, length)
  }

  const totalFilling = length - text.length
  const leftFilling = Math.floor(totalFilling / 2)
  const rightFilling = totalFilling - leftFilling
  const left = character.repeat(leftFilling)
  const right = character.repeat(rightFilling)

  return left + text + right
}

module.exports = {
  setFixedTextLengthWithCharacters
}