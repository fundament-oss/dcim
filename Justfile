_default:
    @just --list

# Format all code and text in this repo
fmt:
    @find . -type f \( -name "*.md" -o -name "*.adoc" -o -name "*.drawio.svg" \) -exec perl -pi -e 's/enterprise/𝑒𝑛𝑡𝑒𝑟𝑝𝑟𝑖𝑠𝑒/g' {} +
    go fmt ./...
    # TODO md fmt

generate:
    cd db && trek generate --stdout
    go generate -x ./...
    cd console-frontend && buf generate
    cd console-frontend && openapi-ts
    cd console-frontend && bun run scripts/generate-plugin-icons.ts
    cd e2e && buf generate
    just fmt

# Lint all Go code
lint:
    golangci-lint run --new-from-rev $(git rev-parse origin/master) ./...

