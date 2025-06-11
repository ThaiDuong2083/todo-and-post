import users from "../data/users.js"
import validateFunction from "./validate.js"

let registerForm = document.querySelector(".register-form")
let account = { first_name: "", last_name: "", email: "", password: "" }
registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (validateFunction(registerForm) == false) {
        return
    }
    
    account.id = getMaxId(users)
    account.first_name = account.email = registerForm.querySelector(`input[name="first_name"]`).value.trim()
    account.last_name = account.email = registerForm.querySelector(`input[name="last_name"]`).value.trim()
    account.email = registerForm.querySelector(`input[name="email"]`).value.trim()
    account.password = registerForm.querySelector(`input[name="password"]`).value.trim()

    let user = checkRegister(account, users)

    if (user == true) {
        users.push(account)
        localStorage.setItem("users", JSON.stringify(users))
        window.location.href = 'login.html'
    }
})
function checkRegister(account, users) {
    try {
        let user = users.find(user => user.email == account.email)
        if (user != undefined) {
            throw "Email này đã có tài khoản"
        }
        return true
    } catch (e) {
        alert(e)
        return false
    }
}

function getMaxId(users){
    let maxId = 0
    users.forEach(user => maxId = Math.max(maxId, user.id))
    return maxId + 1
}