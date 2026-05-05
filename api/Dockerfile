FROM golang:1.26.2-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY api/ ./api/
COPY common/ ./common/
RUN CGO_ENABLED=0 go build -o /build/bin/api ./api/cmd/api

FROM scratch
COPY --from=builder /build/bin/api /
ENTRYPOINT ["/api"]
