package main

import (
	"bytes"
	"crypto/sha256"
	"debug/elf"
	"debug/pe"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"syscall/js"
	"time"
)

type ScannerResult struct {
	Hashes        map[string]string `json:"hashes"`
	Info          FileInfo          `json:"info"`
	Imports       []string          `json:"imports"`
	Symbols       []string          `json:"symbols"`
	Strings       []string          `json:"strings"`
	EmbeddedFiles []EmbeddedFile    `json:"embedded_files"`
	DataSection   string            `json:"data_section,omitempty"`
	ErrorMsg      string            `json:"error,omitempty"`
}

type FileInfo struct {
	Format   string `json:"format"`
	Arch     string `json:"arch"`
	Size     int    `json:"size"`
	Language string `json:"language"`
	Linking  string `json:"linking"`
	Stripped string `json:"stripped"`
	Time     string `json:"time"`
}

type EmbeddedFile struct {
	Offset int    `json:"offset"`
	Type   string `json:"type"`
}

func extractStrings(data []byte) []string {
	re := regexp.MustCompile(`[ -~]{4,}`)
	matches := re.FindAll(data, -1)
	
	limit := 1000
	var result []string
	for i, m := range matches {
		if i >= limit {
			break
		}
		result = append(result, string(m))
	}
	return result
}

func calculateSHA256(data []byte) string {
	h := sha256.New()
	h.Write(data)
	return hex.EncodeToString(h.Sum(nil))
}

func findEmbeddedFiles(data []byte) []EmbeddedFile {
	var results []EmbeddedFile

	signatures := map[string][]byte{
		"ZIP Archive":       {0x50, 0x4B, 0x03, 0x04},
		"GZIP Compressed":   {0x1F, 0x8B, 0x08},
		"JPEG Image":        {0xFF, 0xD8, 0xFF},
		"PNG Image":         {0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A},
		"PDF Document":      {0x25, 0x50, 0x44, 0x46, 0x2D},
		"ELF Binary":        {0x7F, 0x45, 0x4C, 0x46},
		"PE Windows Executable": {0x4D, 0x5A},
	}

	for name, sig := range signatures {
		offset := 0
		for {
			idx := bytes.Index(data[offset:], sig)
			if idx == -1 {
				break
			}
			actualOffset := offset + idx
			
			if actualOffset > 0 {
				results = append(results, EmbeddedFile{Offset: actualOffset, Type: name})
			}
			offset = actualOffset + 1
		}
	}

	if len(results) > 50 {
		return results[:50]
	}
	return results
}

func parseBinary(this js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return errorJSON("No data provided")
	}

	jsData := args[0]
	length := jsData.Get("length").Int()
	data := make([]byte, length)
	js.CopyBytesToGo(data, jsData)

	result := ScannerResult{
		Hashes: map[string]string{
			"sha256": calculateSHA256(data),
		},
		Info: FileInfo{
			Format:   "Unknown",
			Arch:     "Unknown",
			Size:     length,
			Language: "Unknown",
			Linking:  "Unknown",
			Stripped: "Unknown",
			Time:     "Unknown",
		},
		Imports:       []string{},
		Symbols:       []string{},
		Strings:       extractStrings(data),
		EmbeddedFiles: findEmbeddedFiles(data),
	}

	if len(data) > 4 && bytes.Equal(data[0:4], []byte("\x7fELF")) {
		result.Info.Format = "ELF"
		
		reader := bytes.NewReader(data)
		f, err := elf.NewFile(reader)
		if err == nil {
			defer f.Close()
			switch f.Machine {
			case elf.EM_386: result.Info.Arch = "x86"
			case elf.EM_X86_64: result.Info.Arch = "x86_64"
			case elf.EM_ARM: result.Info.Arch = "ARM"
			case elf.EM_AARCH64: result.Info.Arch = "ARM64"
			default: result.Info.Arch = f.Machine.String()
			}

			syms, errSym := f.Symbols()
			if errSym != nil {
				result.Info.Stripped = "Stripped"
			} else {
				result.Info.Stripped = "Not Stripped"
				
				// Extract internal unstripped symbols
				for _, sym := range syms {
					if len(result.Symbols) >= 500 { break }
					if sym.Name != "" && (elf.ST_TYPE(sym.Info) == elf.STT_FUNC || elf.ST_TYPE(sym.Info) == elf.STT_OBJECT) {
						result.Symbols = append(result.Symbols, sym.Name)
					}
				}
			}

			isDynamic := false
			for _, prog := range f.Progs {
				if prog.Type == elf.PT_INTERP {
					isDynamic = true
					break
				}
			}
			if isDynamic {
				result.Info.Linking = "Dynamically Linked"
			} else {
				result.Info.Linking = "Statically Linked"
			}

			impSyms, _ := f.ImportedSymbols()
			for _, s := range impSyms {
				result.Imports = append(result.Imports, s.Name)
			}

			if sect := f.Section(".data"); sect != nil {
				dataBytes, err := sect.Data()
				if err == nil {
					if len(dataBytes) > 4096 {
						dataBytes = dataBytes[:4096]
					}
					result.DataSection = hex.Dump(dataBytes)
				}
			}
		}
	} else if len(data) > 2 && string(data[0:2]) == "MZ" {
		result.Info.Format = "PE"
		
		reader := bytes.NewReader(data)
		peFile, err := pe.NewFile(reader)
		if err == nil {
			defer peFile.Close()
			
			switch peFile.Machine {
			case pe.IMAGE_FILE_MACHINE_I386: result.Info.Arch = "x86"
			case pe.IMAGE_FILE_MACHINE_AMD64: result.Info.Arch = "x86_64"
			case pe.IMAGE_FILE_MACHINE_ARMNT: result.Info.Arch = "ARM"
			case pe.IMAGE_FILE_MACHINE_ARM64: result.Info.Arch = "ARM64"
			default: result.Info.Arch = fmt.Sprintf("0x%x", peFile.Machine)
			}

			// Try extracting PE internal symbols
			if peFile.Symbols == nil || len(peFile.Symbols) == 0 {
				result.Info.Stripped = "Stripped (or No COFF Symbols)"
			} else {
				result.Info.Stripped = "Not Stripped"
				for _, sym := range peFile.Symbols {
					if len(result.Symbols) >= 500 { break }
					if sym.Name != "" {
						result.Symbols = append(result.Symbols, sym.Name)
					}
				}
			}

			impSyms, _ := peFile.ImportedSymbols()
			for _, s := range impSyms {
				result.Imports = append(result.Imports, s)
			}

			if sect := peFile.Section(".data"); sect != nil {
				dataBytes, err := sect.Data()
				if err == nil {
					if len(dataBytes) > 4096 {
						dataBytes = dataBytes[:4096]
					}
					result.DataSection = hex.Dump(dataBytes)
				}
			}
			
			if peFile.FileHeader.TimeDateStamp != 0 {
				t := time.Unix(int64(peFile.FileHeader.TimeDateStamp), 0).UTC()
				result.Info.Time = t.Format("2006-01-02 15:04:05 UTC")
			}
		}
	}

	if bytes.Contains(data, []byte("Go build ID")) || bytes.Contains(data, []byte("runtime.gopanic")) {
		result.Info.Language = "Go"
	} else if bytes.Contains(data, []byte("rustc")) || bytes.Contains(data, []byte("core::panicking")) {
		result.Info.Language = "Rust"
	} else if bytes.Contains(data, []byte("libc.so")) || bytes.Contains(data, []byte("GLIBC_")) {
		result.Info.Language = "C/C++"
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return errorJSON("Failed to serialize result: " + err.Error())
	}

	return string(jsonBytes)
}

func errorJSON(msg string) string {
	result := ScannerResult{ErrorMsg: msg}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}

func parseHexPattern(patternStr string) ([]uint16, error) {
	var pattern []uint16
	// Normalize pattern: replace ? with ??, uppercase
	patternStr = strings.ToUpper(patternStr)
	parts := strings.Fields(patternStr)
	for _, p := range parts {
		if p == "??" || p == "?" {
			pattern = append(pattern, 256) // 256 acts as our wildcard
		} else {
			b, err := strconv.ParseUint(p, 16, 8)
			if err != nil {
				return nil, fmt.Errorf("invalid hex byte: %s", p)
			}
			pattern = append(pattern, uint16(b))
		}
	}
	return pattern, nil
}

func matchPattern(data []byte, pattern []uint16) []int {
	var matches []int
	if len(pattern) == 0 || len(data) < len(pattern) {
		return matches
	}
	
	for i := 0; i <= len(data)-len(pattern); i++ {
		match := true
		for j, p := range pattern {
			if p != 256 && data[i+j] != byte(p) {
				match = false
				break
			}
		}
		if match {
			matches = append(matches, i)
			if len(matches) >= 100 { // limit to 100 matches to prevent UI lag
				break
			}
		}
	}
	return matches
}

func scanPattern(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return `{"error": "Need data and pattern"}`
	}

	jsData := args[0]
	length := jsData.Get("length").Int()
	data := make([]byte, length)
	js.CopyBytesToGo(data, jsData)

	patternStr := args[1].String()
	pattern, err := parseHexPattern(patternStr)
	if err != nil {
		return fmt.Sprintf(`{"error": "%s"}`, err.Error())
	}

	matches := matchPattern(data, pattern)
	
	var hexMatches []string
	for _, m := range matches {
		hexMatches = append(hexMatches, fmt.Sprintf("0x%X", m))
	}
	
	result := map[string]interface{}{
		"matches": hexMatches,
	}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}

func main() {
	c := make(chan struct{}, 0)
	fmt.Println("RevBench Scanner Wasm Initialized")
	js.Global().Set("RevBench_parseBinary", js.FuncOf(parseBinary))
	js.Global().Set("RevBench_scanPattern", js.FuncOf(scanPattern))
	<-c
}
