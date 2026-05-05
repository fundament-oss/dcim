package dcim_test

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	dcimv1 "github.com/fundament-oss/dcim/api/pkg/proto/gen/v1"
	"github.com/fundament-oss/dcim/api/pkg/proto/gen/v1/dcimv1connect"
)

func TestSiteService_ListSites(t *testing.T) {
	t.Parallel()

	env := newTestAPI(t)
	client := dcimv1connect.NewSiteServiceClient(env.server.Client(), env.server.URL)

	_, err := client.ListSites(context.Background(), connect.NewRequest(&dcimv1.ListSitesRequest{}))
	requireCode(t, err, connect.CodeUnimplemented)
}
