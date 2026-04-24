# Contributing to Fundament DCIM

Welcome, fellow developer! Happy to see you’re interested to join the fun.

Please follow these guidelines in your contributions.

## NeRDS

This project follows the [Nederlandse Richtlijn Digitale Systemen (NeRDS)](https://minbzk.github.io/NeRDS/production/richtlijnen/) as a baseline for quality and consistency.

In practice, there may be situations where we take a pragmatic approach and deviate from these guidelines. Such deviations are acceptable when they serve the project’s needs.

## Licensing

This project is dual-licensed under [AGPL-3.0](LICENSES/AGPL-v3.txt) (code) and [CC-BY-SA-4.0](LICENSES/CC-BY-SA-v4.txt) (documentation). By contributing, you agree that your contributions will be licensed under these terms.

## Workflow

We accept contributions from developers and users through GitHub PRs.

## Prerequisites

This project uses [mise](https://mise.jdx.dev/) to manage tool versions. Run `mise install` in the project root to install all required tools. Key components:

- **Go** for backend services
- **Bun** / **Node** for the console frontend
- **Buf** for Protobuf / Connect-RPC code generation
- **Trek** for database migrations
- **Skaffold** / **k3d** for local Kubernetes development
- **Just** as a command runner

## Common Commands

- `just fmt` — format all code
- `just lint` — lint Go code (only checks changes vs. `origin/master`)
- `just generate` — run all code generation (DB, protobuf, OpenAPI, icons)

## Technologies

Do not introduce a new programming language or tech-stack dependency without prior discussion and approval.

## Styling

Code style is enforced by linters and formatters. Run `just fmt` before committing.

### Go

- Follow standard Go conventions. Formatting is handled by `gofmt` and `goimports`.
- Linting is configured in [`.golangci.yml`](.golangci.yml). Address all lint warnings before submitting a PR.

### TypeScript

- Use single quotes.

### Markdown

- Use [Github Flavored Markdown](https://github.github.com/gfm/).
- Use a single line per paragraph. If you prefer text to be wrapped, use soft-wrapping in your text editor.

### Editor Configuration

An [`.editorconfig`](.editorconfig) file is included. Make sure your editor respects it for consistent indentation and formatting.
