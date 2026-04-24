FROM golang:1.26.2-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY api/ ./api/
RUN CGO_ENABLED=0 go build ./api/cmd/dcim-api

FROM scratch
COPY --from=builder /build/dcim-api /
ENTRYPOINT ["/dcim-api"]
