export function validateForm(form: Element | null): boolean {
  if (!form) {
    console.error('Form to validate not found')
    return false
  }
  const requiredFields: NodeListOf<HTMLInputElement> =
    form.querySelectorAll('[required]')
  let isValid = true
  const invalidFields: Array<string> = []
  requiredFields.forEach((field) => {
    if (!field.value) {
      isValid = false
      invalidFields.push(field.ariaLabel || field.name)
    }
  })
  if (invalidFields.length) {
    console.error(`Required fields: ${invalidFields.join(', ')}`)
  }
  return isValid
}
