# ToDo List

Minimal single-page ToDo app built with plain HTML, CSS and JavaScript.

Features
- Add tasks
- Edit tasks inline (double-click or Edit button)
- Toggle complete
- Delete tasks
- Filter: All / Active / Completed
- Clear completed
- Persists to localStorage

Stack: JavaScript, HTML, CSS (no build tools)

How to run

1. Clone the repo:

```bash
git clone https://github.com/forepick/todo-list.git
cd todo-list
```

2. Open `index.html` in your browser or run a simple HTTP server:

```bash
# macOS / Python 3
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Keyboard shortcuts
- `/` focuses the add input
- Enter to add a task

Notes
- This is intentionally framework-free and small. If you want TypeScript, tests, or CI added, tell me and I'll scaffold them.
