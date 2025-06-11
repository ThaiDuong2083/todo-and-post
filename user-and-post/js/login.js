import users from "../data/users.js"
import validateFunction from "./validate.js"

let loginForm = document.querySelector(".login-form")
let account = { email: "", password: "" }
loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    account.email = loginForm.querySelector(`input[name="email"]`).value.trim()
    account.password = loginForm.querySelector(`input[name="password"]`).value.trim()

    if(validateFunction(loginForm) == false){
        return
    }

    let user = checkLogin(account,users)
    
    if(user != null){
        window.location.href = 'index.html'
    }
})
function checkLogin(account, users) {
    try {
        let user = users.find(user => user.email == account.email && user.password == account.password)
        if (user == undefined) {
            throw "Thông tin tài khoản không chính xác"
        }
        alert("Xin chào "+ user.first_name + " " + user.last_name);
        return user
    }catch(e){
        alert(e)
        return null
    }
}