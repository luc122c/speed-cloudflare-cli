# Contributing Guide

This file provides development guidelines for contributors and guidance to [Claude Code](https://claude.ai/code), [Qwen Coder](https://github.com/QwenLM/Qwen3-Coder) and similar tools when working with code in this repository.

## Project Overview

This is a CLI tool that measures internet connection speed and latency using Cloudflare's speed test infrastructure at speed.cloudflare.com. The tool is written in Node.js and can be compiled to a standalone binary using Deno.

## Development Commands

### Testing and Running
- `node cli.js` - Run the speed test with colorized output
- `node cli.js --json` - Run the speed test and output results as JSON
- `npx speed-cloudflare-cli` - Run via npm (when installed globally)
- `make clean integration-test ARG=--json` will rebuild the binary and then execute it with json output

### Building
- `make` or `make all` - Compile the CLI to a standalone binary using Deno
- `make clean` - Remove the compiled binary
- The compiled binary is named `cloudflare-speedtest`

### Testing
- `make test` or `npm test` - Run the complete test suite with Jest
- `make integration-test` - Run integration tests with the compiled binary
- Tests include comprehensive mocking of network functions and cover:
  - Network request functions (get, fetchServerLocationData, fetchCfCdnCgiTrace)
  - Speed measurement functions (measureLatency, measureDownload, measureUpload)
  - Statistical calculations (stats.js functions)
  - Logging and formatting functions
  - Command-line argument parsing

### Code Quality
- `npx eslint .` - Run ESLint for code linting
- `npx prettier --check .` - Check code formatting
- `npx prettier --write .` - Auto-format code
- All files must follow `.editorconfig` conventions:
  - End with final newline (`insert_final_newline = true`)
  - No trailing whitespace (`trim_trailing_whitespace = true`)
  - 2-space indentation for most files, tabs for Makefile
  - Use `git ls-files -z | xargs -0 grep -Pzlv '\x0a$'` to find files missing final newlines
  - Use `git ls-files -z | xargs -0 grep -l '[[:space:]]$'` to find files with trailing whitespace

## Architecture

### Core Files
- `cli.js` - Main entry point that imports and runs speedTest from lib.js
- `lib.js` - Core library containing all speed test logic and functions (exported for testing)
- `stats.js` - Statistical utilities (average, median, quartile, jitter calculations)
- `chalk.js` - Custom color formatting utilities for terminal output
- `test/` - Jest test suite with comprehensive mocks for network functions

### Key Functions
- `speedTest()` - Main orchestrator function that runs the complete speed test
- `measureLatency()` - Performs 20 ping tests to measure network latency
- `measureDownload(bytes, iterations)` - Tests download speed with various file sizes
- `measureUpload(bytes, iterations)` - Tests upload speed with various file sizes
- `request(options, data)` - Low-level HTTPS request function with performance timing

### Speed Test Flow
1. Fetches server location data and client IP information from Cloudflare
2. Measures latency with 20 small requests (1KB each)
3. Tests download speeds with progressively larger files: 100kB, 1MB, 10MB, 25MB, 100MB
4. Tests upload speeds with: 10kB, 100kB, 1MB
5. Calculates statistics using median for individual tests and 90th percentile for overall speeds

### Output Modes
- Default: Colorized terminal output showing server location, IP, latency stats, and speed results
- `--json`: Structured JSON output suitable for programmatic consumption

## Dependencies
- No runtime dependencies (uses only Node.js built-ins)
- Dev dependencies: ESLint, Prettier for code quality, Jest for testing, TypeScript for language server support
- Compilation: Requires Deno for creating standalone binaries

## Notes
- Creates new HTTPS agents for each request to avoid connection reuse affecting measurements
- Uses performance timing hooks to measure different phases of HTTP requests (DNS, TCP, SSL, TTFB)
- Implements custom statistical functions rather than using external libraries to minimize dependencies
