# RevBench

**A browser-based reverse engineering workbench built with React, Vite, and Go WebAssembly.**

RevBench provides a suite of lightweight tools for binary analysis, encoding conversion, and low-level education — all running entirely in the browser with no server-side dependencies.

---

## Table of Contents

- [Architecture](#architecture)
- [Pages](#pages)
  - [Quick Converter](#quick-converter--hex--bin--ascii)
  - [C-to-ASM Tutor](#c-to-asm-educational-tutor)
  - [Triage Scanner](#pre-reversing-triage-scanner)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)

---

## Architecture

### Routing and Structure

The application uses distinct client-side routes rather than a complex multi-pane state machine.

- **Navigation** — `react-router-dom` powers a persistent sidebar or top navigation bar.
- **Isolation** — Each tool lives at its own URL (e.g., `/converter`, `/tutor`, `/scanner`), keeping component state independent and the codebase maintainable.

---

## Pages

### Quick Converter | Hex / Bin / ASCII

A lightweight utility page powered entirely by JavaScript state management — no Wasm required.

| Element   | Description |
|-----------|-------------|
| **UI**    | Three clean text areas arranged vertically or side-by-side: Hex, Binary, and ASCII. |
| **Logic** | Controlled React components with real-time `onChange` conversion. Typing `01000001` into the Binary field instantly populates Hex (`41`) and ASCII (`A`). |
| **Value** | Eliminates context-switching to a terminal or ad-laden online converter for quick string or opcode decoding. |

---

### C-to-ASM Educational Tutor

A curated, interactive educational tool for understanding the relationship between C source code and its compiled assembly output.

**Concept**
A dropdown menu offers 5 to 10 common application security scenarios:
  - Standard Function Prologue
  - Basic Buffer Allocation
  - Pointer Dereference
  - Simple `for` Loop
  - *(and more)*

**Interface**
Two Monaco Editor instances displayed side-by-side. The left pane shows C source; the right pane shows the corresponding assembly. Below both panes, **Step Forward** and **Step Back** buttons control the walkthrough.

**Interaction Flow**

1. The user selects a scenario from the dropdown. Static C code and its matching assembly load into the respective panes.
2. Clicking **Step Forward** highlights a line in the C pane and simultaneously highlights the corresponding lines in the assembly pane.
3. An explanation panel below describes *why* the compiler made each choice (e.g., *"Here, the compiler sets up the stack frame by pushing the base pointer..."*), providing a guided tour of how C translates to machine-level operations.

---

### Pre-Reversing Triage Scanner

The heavyweight analysis page — an automated first-pass analyzer for binary files before committing to a full reverse engineering session. This is where the Go/Wasm backend does its work.

**Interface**
A large drag-and-drop zone at the top of the page. Once a file is dropped, the view transforms into a categorized analysis dashboard.

**Go Engine (Wasm)**

1. The Go parsing tool is compiled to WebAssembly.
2. When a file is dropped, React reads it as an `ArrayBuffer` and passes the raw bytes to the Go Wasm function.
3. Go handles the heavy lifting:
   - Parsing headers (ELF / PE)
   - Calculating SHA256 hashes
   - Extracting hardcoded strings
   - Identifying imported libraries
   - Detecting target architecture

**Output**
The Go function returns a structured JSON object to React, which renders the data as visual cards:

| Card               | Contents |
|---------------------|----------|
| **Hashes and Info** | SHA256, file size, format, architecture |
| **Imports**         | Scrollable table of imported libraries and functions |
| **Strings**         | Searchable, filterable list of extracted strings |

---

## Project Structure

```
RevBench/
├── cmd/                      Go source code
│   └── scanner/              Go Wasm binary parser
│       └── main.go           Go entry point for WebAssembly
├── public/                   Static assets
│   └── wasm/                 Compiled WebAssembly files (scanner.wasm)
├── src/
│   ├── assets/               Images, fonts, etc.
│   ├── components/           Reusable UI components (buttons, layout, etc.)
│   ├── data/                 Curated JSON data for the Tutor scenarios
│   ├── pages/
│   │   ├── Converter.jsx     Page 1: Hex / Bin / ASCII utility
│   │   ├── Tutor.jsx         Page 2: C-to-ASM educational tutor
│   │   └── Scanner.jsx       Page 3: Pre-reversing triage dashboard
│   ├── App.jsx               Main application component and React Router setup
│   ├── index.css             Global styles and Tailwind imports
│   └── main.jsx              React DOM entry point
├── index.html                Vite HTML entry point
├── package.json              Node.js dependencies
├── tailwind.config.js        Tailwind CSS configuration
├── vite.config.js            Vite configuration
└── README.md                 Project documentation
```

---

## Development Roadmap

| Phase | Milestone | Details |
|-------|-----------|---------|
| **1** | Initialize | Set up Vite, React, Tailwind CSS, and React Router. Build the basic navigation shell. |
| **2** | Quick Converter | Build the Hex / Bin / ASCII converter first — a quick win that builds comfort with React state and component updates. |
| **3** | Static Tutor | Implement the Monaco editors and build the JSON data structure for the curated C/ASM walkthrough steps. |
| **4** | Triage Scanner | Tackle file-upload and Wasm integration last, as passing raw binary arrays between JavaScript and Go WebAssembly requires careful handling. |