package dcim_test

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	dcimv1 "github.com/fundament-oss/dcim/api/pkg/proto/gen/v1"
	"github.com/fundament-oss/dcim/api/pkg/proto/gen/v1/dcimv1connect"
)

func TestSiteService_CreateSite(t *testing.T) {
	t.Parallel()

	env := newTestAPI(t)
	client := dcimv1connect.NewSiteServiceClient(env.server.Client(), env.server.URL)

	tests := []struct {
		name string
		site string
		want connect.Code
	}{
		{"empty_name", "", connect.CodeInvalidArgument},
		{"valid", "Site A", connect.CodeUnimplemented},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			_, err := client.CreateSite(context.Background(), connect.NewRequest(
				(&dcimv1.CreateSiteRequest_builder{Name: tc.site}).Build(),
			))
			requireCode(t, err, tc.want)
		})
	}
}
