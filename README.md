# Fundament DCIM

Fundament DCIM is an in-house Data Center Infrastructure Management system for managing Fundament's physical and logical data center resources. It provides tooling to track, monitor, and operate the infrastructure that underpins the Fundament platform.

## Project status

**Early Development**

The project is in its initial development phase. APIs and data models are subject to change.

## Tech stack

- **Backend** — Go, Connect-RPC (Protobuf)
- **Frontend** — TypeScript / Bun
- **Database** — PostgreSQL (migrations via Trek, queries via sqlc)
- **Deployment** — Kubernetes (Helm, Skaffold, k3d for local dev)

## Getting started

1. Install [mise](https://mise.jdx.dev/) and run `mise install` to set up all required tools.
2. See the [development setup](docs/development-setup.md) for instructions on running the project locally.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The contents of this repository are copyrighted by *The Fundament Authors*
(`git log --format='%aN <%aE>' | sort -u`).

- **Source code** is licensed under the [GNU Affero General Public License (AGPL)](https://www.gnu.org/licenses/agpl-3.0.html), unless otherwise stated.
- **Documentation** (including Markdown, D2 and similar files) is licensed under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).
