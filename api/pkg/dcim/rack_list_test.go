package dcim_test

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	dcimv1 "github.com/fundament-oss/dcim/api/pkg/proto/gen/v1"
	"github.com/fundament-oss/dcim/api/pkg/proto/gen/v1/dcimv1connect"
)

func TestRackService_ListRacks(t *testing.T) {
	t.Parallel()

	env := newTestAPI(t)
	client := dcimv1connect.NewRackServiceClient(env.server.Client(), env.server.URL)

	_, err := client.ListRacks(context.Background(), connect.NewRequest(&dcimv1.ListRacksRequest{}))
	requireCode(t, err, connect.CodeUnimplemented)
}
