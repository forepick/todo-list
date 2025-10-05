// Simple ToDo SPA with localStorage persistence
const STORAGE_KEY = 'todo.tasks.v1'
let tasks = []
let filter = 'all'

const q = sel => document.querySelector(sel)
const qs = sel => document.querySelectorAll(sel)

const $form = q('#add-form')
const $input = q('#new-todo')
const $list = q('#todo-list')
const $count = q('#count')
const $clearBtn = q('#clear-completed')
const $filters = qs('.filter-btn')

function uid(){return Date.now().toString(36) + Math.random().toString(36).slice(2,8)}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    tasks = raw ? JSON.parse(raw) : []
  }catch(e){ tasks = [] }
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function addTask(text){
  const t = { id: uid(), text: text.trim(), completed: false }
  if(!t.text) return
  tasks.unshift(t)
  save()
  render()
}

function toggleTask(id){
  const t = tasks.find(x=>x.id===id); if(!t) return
  t.completed = !t.completed
  save(); render()
}

function deleteTask(id){
  tasks = tasks.filter(x=>x.id!==id)
  save(); render()
}

function updateTask(id, text){
  const t = tasks.find(x=>x.id===id); if(!t) return
  t.text = text.trim(); save(); render()
}

function clearCompleted(){
  tasks = tasks.filter(t=>!t.completed); save(); render()
}

function setFilter(f){ filter = f; render(); updateFilterButtons() }

function updateFilterButtons(){
  $filters.forEach(btn=>btn.classList.toggle('active', btn.dataset.filter===filter))
}

function render(){
  const visible = tasks.filter(t=>{
    if(filter==='all') return true
    if(filter==='active') return !t.completed
    if(filter==='completed') return t.completed
  })

  $list.innerHTML = ''
  visible.forEach(t=>{
    const li = document.createElement('li')
    li.className = 'todo-item' + (t.completed ? ' completed' : '')
    li.dataset.id = t.id

    const cb = document.createElement('button')
    cb.className = 'checkbox'
    cb.setAttribute('aria-label', t.completed ? 'Mark as not completed' : 'Mark as completed')
    cb.innerHTML = t.completed ? '✓' : ''

    const label = document.createElement('div')
    label.className = 'label'
    label.textContent = t.text
    label.tabIndex = 0
    label.title = 'Double-click to edit'

    const btns = document.createElement('div')
    btns.className = 'btns'

    const edit = document.createElement('button')
    edit.className = 'small-btn'
    edit.textContent = 'Edit'

    const del = document.createElement('button')
    del.className = 'small-btn danger'
    del.textContent = 'Delete'

    btns.append(edit, del)
    li.append(cb, label, btns)
    $list.append(li)

    // events
    cb.addEventListener('click', ()=> toggleTask(t.id))
    del.addEventListener('click', ()=> { if(confirm('Delete this task?')) deleteTask(t.id) })

    // Edit flow: double click or edit button -> contenteditable
    function startEdit(){
      label.contentEditable = true
      label.classList.add('editing')
      label.focus()
      document.execCommand('selectAll', false, null)
    }
    edit.addEventListener('click', startEdit)
    label.addEventListener('dblclick', startEdit)

    label.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){
        e.preventDefault(); label.blur()
      } else if(e.key==='Escape'){
        e.preventDefault(); label.textContent = t.text; label.blur()
      }
    })

    label.addEventListener('blur', ()=>{
      if(label.isContentEditable){
        label.contentEditable = false
        const newText = label.textContent.trim()
        if(!newText){ label.textContent = t.text; return }
        if(newText !== t.text) updateTask(t.id, newText)
      }
    })
  })

  const remaining = tasks.filter(t=>!t.completed).length
  $count.textContent = `${remaining} ${remaining===1 ? 'item' : 'items'}`
}

// init
load(); render(); updateFilterButtons()

$form.addEventListener('submit', e=>{
  e.preventDefault()
  addTask($input.value)
  $input.value = ''
  $input.focus()
})

$clearBtn.addEventListener('click', ()=>{
  if(tasks.some(t=>t.completed)){
    if(confirm('Remove all completed tasks?')) clearCompleted()
  } else {
    alert('No completed tasks to clear')
  }
})

Array.from($filters).forEach(btn=>{
  btn.addEventListener('click', ()=> setFilter(btn.dataset.filter))
})

// keyboard shortcut: focus input with / key
window.addEventListener('keydown', e=>{
  if(e.key === '/'){
    const active = document.activeElement
    if(active && (active.tagName==='INPUT' || active.isContentEditable)) return
    e.preventDefault(); $input.focus();
  }
})

// expose for debugging
window.__TODO_APP = {get tasks(){return tasks.slice()}, clear: ()=>{tasks=[];save();render()}}
