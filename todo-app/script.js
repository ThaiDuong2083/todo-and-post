let listTask = setListTask()
let listTaskElement = document.querySelector(".list-task")

function setMaxTaskId(listTask) {
    let maxId = 0
    listTask.forEach(task => maxId = Math.max(maxId, task.id))
    return maxId + 1
}
function setListTask() {
    if (localStorage.getItem("list-task")) {
        return JSON.parse(localStorage.getItem("list-task"))
    }
    return []
}

function chooseTab(e) {
    document.querySelectorAll(".nav-link").forEach(navLink => {
        navLink.classList.remove("class", "active")
        if (e.querySelector(".nav-link") == navLink) {
            e.querySelector(".nav-link").classList.add("class", "active")
            renderTask()
        }
    })
}

function renderTask() {
    let isCompleted = document.querySelector(".active").getAttribute("is-completed")
    if (listTask == []) {
        return
    }
    let arr = isCompleted != null ? listTask.filter(task => task.isCompleted == isCompleted) : listTask;
    let html = ``
    for (const task of arr) {
        html += `
            <div class="task-${task.id} d-flex justify-content-between">
                <div>
                    
                    <input type="checkbox" />
                    <span  ${ task.isCompleted == true ? `style="color: #0000FF;"` : ""}>${task.name}</span>
                </div>
                <div class="row">
                    ${
                        task.isCompleted == false ? 
                            `<div class="col-6"  title="done">
                                <i class="fa-solid fa-check fa-lg" onclick=completeTask(${task.id}) style="color: #74C0FC;"></i>
                            </div>` 
                            :
                            ``
                    }
                    <div class="col-6" title="delete" onclick="deleteTask(${task.id})">
                        <i class="fa-solid fa-trash-can fa-lg" style="color: #ff4a3d;" ></i>
                    </div>
                </div>
            </div>
        `
    }
    listTaskElement.innerHTML = html
}

function completeTask(id){
    let task = {}
    if(confirm("Do you want to complete this task?")){
        task = listTask.find(task => task.id = id)
        task.isCompleted = true
        localStorage.setItem("list-task", JSON.stringify(listTask))
    }
    renderTask()
}
function deleteTask(id){
    if(confirm("Do you want to delete this task?")){
        listTask = listTask.filter(task => !task.id==id)
        localStorage.setItem("list-task", JSON.stringify(listTask))
        renderTask()
    }
}
function deleteAllTask(){
    if(confirm("Do you want to delete all task?")){
        listTask = []
        localStorage.setItem("list-task", JSON.stringify(listTask))
        renderTask()
    }
}
document.getElementById("button-add").addEventListener("click", () => {
    let taskObj = { id: setMaxTaskId(listTask), name: document.querySelector('input[name="name"]').value, isCompleted: false }
    document.querySelector('input[name="name"]').value = ""
    listTask.push(taskObj)

    localStorage.setItem("list-task", JSON.stringify(listTask))
    renderTask()
})

renderTask()