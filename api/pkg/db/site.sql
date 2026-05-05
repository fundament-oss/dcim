-- name: SiteList :many
SELECT id, name, address, created
FROM core.sites
WHERE deleted IS NULL
ORDER BY created;

-- name: SiteGetByID :one
SELECT id, name, address, created
FROM core.sites
WHERE id = $1 AND deleted IS NULL;

-- name: SiteCreate :one
INSERT INTO core.sites (name, address)
VALUES ($1, $2)
RETURNING id;

-- name: SiteUpdate :execrows
UPDATE core.sites
SET name    = COALESCE(sqlc.narg('name'), name),
    address = COALESCE(sqlc.narg('address'), address)
WHERE id = $1 AND deleted IS NULL;

-- name: SiteDelete :execrows
UPDATE core.sites
SET deleted = now()
WHERE id = $1 AND deleted IS NULL;
