import posts from "../data/posts.js"
import users from "../data/users.js"
import validateFunction from "./validate.js"

let list = []
let table = document.querySelector(".table")
let pageNumber = 1
let maxPageNumber = null
let limit = 5
let size = 0
let paginationElement = document.querySelector(".pagination")
let tabs = document.querySelectorAll(".nav-item")
let formSearchUsers = document.getElementById("form-search-users")
let formSearchPosts = document.getElementById("form-search-posts")
let searchUser = ""
let searchPost = {
    id: "",
    email: ""
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(navLink => {
            navLink.classList.remove("class", "active")
            if (tab.querySelector(".nav-link") == navLink) {
                tab.querySelector(".nav-link").classList.add("class", "active")
                renderSearchForm(document.querySelector(".active").getAttribute("type"))
                renderTable()
            }
        })
    })
})

function renderSearchForm(type) {
    if (type == "users") {
        formSearchUsers.classList.remove("d-none")
        formSearchPosts.classList.add("d-none")
    } else if (type == "posts") {
        formSearchUsers.classList.add("d-none")
        formSearchPosts.classList.remove("d-none")
    }
}

function renderPagination(pageNumber, maxPageNumber) {
    let html = `<li class="page-item" value="prev"><a class="page-link">Previous</a></li>`
    for (let i = 0; i < maxPageNumber; i++) {
        html +=
            `<li class="page-item item-${i + 1} ${i + 1 == pageNumber ? "active" : ""}" value="${i + 1}"><a class="page-link" >${i + 1}</a></li>`
    }
    html += `<li class="page-item" value="next"><a class="page-link">Next</a></li>`
    paginationElement.innerHTML = html

    document.querySelectorAll(".page-item").forEach(number => {
        number.addEventListener("click", () => {
            switch (number.getAttribute("value")) {
                case "next":
                    renderTable("+", null, null)
                    break;
                case "prev":
                    renderTable("-", null, null)
                    break;
                default:
                    renderTable(null, parseInt(number.getAttribute("value")), null)
                    break;
            }
        })
    })
}

function renderTable(value, number) {
    let type = document.querySelector(".active").getAttribute("type")
    list = type === "posts" ? posts : type === "users" ? users : [];
    if (list == []) {
        return
    }

    type === "posts" ? renderPosts(list, value, number, limit, searchPost) : type === "users" ? renderUsers(list, value, number, limit, searchUser) : [];
}
function renderUsers(arr, value, number, limit, ...params) {
    if (params[0] != undefined) {
        arr = arr.filter(e => {
            if (e.email.includes(params[0]) || e.first_name.includes(params[0]) || e.last_name.includes(params[0])) {
                return e
            }
        })
    }

    let start = (calculatePagination(value, number, arr) - 1) * limit;
    let html = `
        <thead>
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Họ</th>
            <th scope="col">Tên</th>
            <th scope="col">Email</th>
            </tr>
        </thead>
        `
    for (let i = start; i < start + limit; i++) {
        if (i >= arr.length) { break; }
        html += ` 
        <tr class="user-${arr[i].id}">
            <th scope="row">${arr[i].id}</th>
            <td>${arr[i].first_name}</td>
            <td>${arr[i].last_name}</td>
            <td>${arr[i].email}</td>
        </tr>`
    }
    table.innerHTML = html
}

function getNameUser(id) {
    let user = users.find(user => {
        if (user.id == id) {
            return user
        }
    }
    )
    return user.first_name + " " + user.last_name
}

function calculatePagination(value, number, arr) {
    size = arr.length
    maxPageNumber = Math.ceil(size / limit)
    switch (value) {
        case "+":
            maxPageNumber == pageNumber ? "" : pageNumber += 1
            break;
        case "-":
            pageNumber == 1 ? "" : pageNumber -= 1
            break;
        default:
            break;
    }
    renderPagination(pageNumber, maxPageNumber)
    return pageNumber = number == null ? pageNumber : number
}

function renderPosts(arr, value, number, limit, ...params) {
    let userIds = []
    if (params[0] != undefined) {
        userIds = users.filter(e => e.email.includes(params[0].email)).map(e => e.id);
        arr = arr.filter(e => {
            const matchId = params[0].id ? e.id == params[0].id : true;
            const matchUser = userIds.includes(e.user_id);
            return matchId && matchUser;
        });
    }

    let start = (calculatePagination(value, number, arr) - 1) * limit;
    let html = `
        <thead>
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Tiêu đề</th>
            <th scope="col">Ngày tạo</th>
            <th scope="col">Tác giả</th>
            <th scope="col">Hành động</th>
            </tr>
        </thead>
    `
    for (let i = start; i < start + limit; i++) {
        if (i >= arr.length) { break; }
        html += ` 
        <tr>
            <th scope="row">${arr[i].id}</th>
            <td >${arr[i].title}</td>
            <td>${arr[i].created_at}</td>
            <td>${getNameUser(arr[i].user_id)}</td>
            <td> 
                <button type="button" value=${arr[i].id} class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                    Chi tiết
                </button>
            </td>
        </tr>`
    }
    table.innerHTML = html

    document.querySelectorAll('button[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener("click", () => {
            let post = posts.find(p => {
                if (p.id == parseInt(btn.getAttribute("value"))) {
                    return p;
                }
            })
            document.querySelector('span[name="id"]').innerHTML = post.id
            document.querySelector('span[name="title"]').innerHTML = post.title
            document.querySelector('div[name="content"]').innerHTML = post.content
            document.querySelector('span[name="image"]').innerHTML = post.image
            document.querySelector('span[name="name"]').innerHTML = getNameUser(post.user_id)
            document.querySelector('span[name="created_at"]').innerHTML = post.created_at
            document.querySelector('span[name="updated_at"]').innerHTML = post.updated_at
        })
    })
}

formSearchUsers.addEventListener("submit", (e) => {
    e.preventDefault()
    searchUser = formSearchUsers.querySelector('input[name="searchByNameOrEmail"]').value
    renderTable(null, 1)
})
formSearchPosts.addEventListener("submit", (e) => {
    e.preventDefault()
    searchPost = {
        email: formSearchPosts.querySelector('input[name="email"]').value,
        id: formSearchPosts.querySelector('input[name="id"]').value
    }
    renderTable(null, 1)
})
renderTable()
