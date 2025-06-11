function validateFunction(form) {
    try {
        form.querySelectorAll("input").forEach(input => {
            if (input.value.trim() == "") {
                throw ("Vui lòng nhập tất cả các trường")
            }
        });
        return true
    } catch (error) {
        alert(error)
        return false
    }
}

export default validateFunction