_default:
    @just --list

# Format all code and text in this repo
fmt:
    @find . -type f \( -name "*.md" -o -name "*.adoc" -o -name "*.drawio.svg" \) -exec perl -pi -e 's/enterprise/𝑒𝑛𝑡𝑒𝑟𝑝𝑟𝑖𝑠𝑒/g' {} +
    go fmt ./...
    # TODO md fmt

# --- Cluster commands ---

# Create a local k3d cluster for development with local registry
cluster-create:
    k3d cluster create --config=deploy/k3d/config.yaml

# Start the cluster (creates if it doesn't exist)
cluster-start:
    @k3d cluster list dcim > /dev/null 2>&1 && k3d cluster start dcim || just cluster-create

# Stop the cluster without deleting it
cluster-stop:
    k3d cluster stop dcim

# Delete the local k3d cluster and registry
cluster-delete:
    k3d cluster delete dcim
    @k3d registry delete registry-dcim.localhost 2>/dev/null || true

# --- Deployment commands ---

# Deploy to local k3d cluster (development mode, keeps resources on exit)
dev *flags:
    SKAFFOLD_DEFAULT_REPO="localhost:5112" \
    skaffold dev --profile env-local --cleanup=false {{ flags }}

# Deploy to local k3d cluster with hot-reload
dev-hotreload:
    @just dev --profile hotreload

# Deploy to an environment (e.g. local, production)
deploy env:
    skaffold run --profile env-{{ env }}

# Delete deployment, can also be used to remove the deployment created by `just dev`.
undeploy env:
    skaffold delete --profile env-{{ env }}

# View logs from all pods
logs:
    kubectl logs -n dcim -l app.kubernetes.io/instance=dcim --all-containers -f

# Open a shell to the PostgreSQL database
db-shell:
    #!/usr/bin/env bash
    set -euo pipefail
    PASSWORD=$(kubectl get secret -n dcim db-dcim-operator -o jsonpath='{.data.password}' | {{ if os() == "macos" { "base64 -D" } else { "base64 -d" } }})
    kubectl exec -it -n dcim db-1 -- env PGPASSWORD="$PASSWORD" psql -h localhost -U dcim_operator -d dcim

generate:
    cd db && trek generate --stdout
    go generate -x ./...
    just fmt

# Lint all Go code
lint:
    golangci-lint run --new-from-rev $(git rev-parse origin/master) ./...
