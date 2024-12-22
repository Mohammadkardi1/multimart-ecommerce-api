export const nameValidator = (name) => {
  
    if (name.length < 4) {
      return false
    }
  
    const pattern = /^[a-zA-Z0-9\s]+$/;
    if (!pattern.test(name)) {
      return false
    }

    return true
}

export const emailValidator = (email) => {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!pattern.test(email)) {
        return false
    }
    return true
}


export const passwordValidator = (password) => {

    if (password.length >=  8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[$-/:-?{-~@#!"^_`\[\]]/.test(password)
        ) {
        return true
    }

    return false
}