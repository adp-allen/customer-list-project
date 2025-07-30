function validateEmail(email) {
    // Simple regex for email validation
    const re = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
}

function validateName(name) {
    // Only letters and spaces allowed
    const re = /^[A-Za-z ]+$/
    return re.test(name)
}

function validatePassword(password) {
    // At least one uppercase, one lowercase, one digit, one special char, min 6 chars
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/
    return re.test(password)
}

module.exports = {
    validateEmail,
    validateName,
    validatePassword
}
