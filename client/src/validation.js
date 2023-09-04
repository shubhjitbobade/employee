// validation.js

const validateForm = formData => {
  const errors = {}

  if (!formData.employeeNo) {
    errors.employeeNo = "Employee No is required"
  } else if (!/^\d{4}$/.test(formData.employeeNo)) {
    errors.employeeNo = "Employee No should be a 4-digit number"
  }

  if (!formData.name) {
    errors.name = "Name is required"
  }

  if (!formData.email) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email format"
  }

  if (!formData.photo) {
    errors.photo = "Photo is required"
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = "Phone Number is required"
  } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Phone Number should be a 10-digit number"
  }

  if (!formData.birthDate) {
    errors.birthDate = "Birth Date is required"
  } else {
    const currentDate = new Date()
    const inputDate = new Date(formData.birthDate)
    const age = currentDate.getFullYear() - inputDate.getFullYear()

    if (age < 18) {
      errors.birthDate =
        "You are not eligible to submit this form. Age must be above 18 years."
    }
  }

  return errors
}

export default validateForm
