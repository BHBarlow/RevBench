# RevBench.dev

### The Foundation: Routing & Structure

Instead of a complex three-pane state machine, you will build an application with distinct routes.

- **The Navigator:** You will use a library like `react-router-dom` to create a sidebar or top navigation bar.
    
- **The Layout:** Each tool gets its own dedicated URL (e.g., `/converter`, `/tutor`, `/scanner`), meaning they don't have to share state, making your React code much cleaner and easier to maintain.
    

---

### Page 1: The Quick Converter (Hex / Bin / ASCII)

This is your lightweight utility page. It doesn't need Wasm; it's pure JavaScript state management.

- **The UI:** Three clean text areas stacked vertically or side-by-side: Hex, Binary, and ASCII.
    
- **The Logic:** You use controlled React components. If you type `01000001` into the Binary box, an `onChange` event instantly calculates the Hex (`41`) and ASCII (`A`) and updates the other two boxes in real-time.
    
- **The Value:** It saves you from constantly switching to a terminal or an ad-filled online converter when you just need to decode a quick string or opcode.
    

---

### Page 2: The C-to-ASM Educational Tutor

Since making a fully dynamic, browser-based C compiler is a massive headache, shifting this to a curated, interactive educational tool is a brilliant move for understanding low-level relationships.

- **The Concept:** You curate a dropdown of 5 to 10 common application security scenarios (e.g., "Standard Function Prologue," "Basic Buffer Allocation," "Pointer Dereference," "Simple `for` loop").
    
- **The UI:** Two Monaco Editor instances side-by-side. Left is C, right is Assembly. Below them are "Step Forward" and "Step Back" buttons.
    
- **The Interaction:** * The user selects a scenario. The static C code and its matching ASM load into the panes.
    
    - As the user clicks "Step Forward," the app highlights line 3 in the C code, simultaneously highlighting lines 8-10 in the ASM pane.
        
    - A small explanation box below explains _why_ the compiler made that choice (e.g., "Here, the compiler is setting up the stack frame by pushing the base pointer..."). It acts as a guided tour of how C translates to memory.
        

---

### Page 3: The Pre-Reversing Triage Scanner

This is the heavyweight page and where your Go skills shine. It acts as an automated first-pass analyzer before you commit to deep-diving into a binary.

- **The UI:** A massive drag-and-drop zone at the top. Once a file is dropped, the UI transforms into a clean, categorized dashboard.
    
- **The Go Engine (Wasm):** * You compile your Go parsing tool to Wasm.
    
    - When a file is dropped, React reads it as an `ArrayBuffer` and passes those raw bytes directly to your Go Wasm function.
        
    - Go does the heavy lifting: parsing headers (ELF/PE), calculating SHA256 hashes, extracting hardcoded strings, identifying imported libraries, and guessing the architecture.
        
- **The Output:** The Go function returns a structured JSON object back to React. React maps that JSON into nice visual cards: a "Hashes & Info" card, a scrollable "Imports" table, and a searchable "Strings" list.
    

### Folder Layout

The project structure will follow a standard Vite + React setup with a dedicated directory for Go code:

```text
RevBench/
├── cmd/                    # Go source code
│   └── scanner/            # Go Wasm binary parser
│       └── main.go         # Go entry point for WebAssembly
├── public/                 # Static assets
│   └── wasm/               # Compiled WebAssembly files (e.g., scanner.wasm)
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components (buttons, layout, etc.)
│   ├── data/               # Curated JSON data for the Tutor scenarios
│   ├── pages/              # Main route components
│   │   ├── Converter.jsx   # Page 1: Hex/Bin/ASCII utility
│   │   ├── Tutor.jsx       # Page 2: C-to-ASM educational tutor
│   │   └── Scanner.jsx     # Page 3: Pre-Reversing Triage dashboard
│   ├── App.jsx             # Main application component & React Router setup
│   ├── index.css           # Global styles and Tailwind imports
│   └── main.jsx            # React DOM entry point
├── index.html              # Vite HTML entry point
├── package.json            # Node.js dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

### The Development Roadmap

1. **Initialize:** Setup Vite, React, Tailwind CSS, and React Router. Build the basic navigation shell.
    
2. **The Quick Win:** Build the Hex/Bin/ASCII converter first. It gets you comfortable with React state and component updates.
    
3. **The Static Tutor:** Implement the Monaco editors and build the JSON data structure to hold your curated C/ASM steps.
    
4. **The Scanner:** Tackle the file-upload and Wasm integration last, as passing raw binary arrays between JavaScript and Go WebAssembly can be slightly tricky.