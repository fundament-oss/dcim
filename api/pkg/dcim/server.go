package dcim

import (
	"log/slog"
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/grpcreflect"
	"github.com/fundament-oss/dcim/api/pkg/proto/gen/v1/dcimv1connect"
)

type Server struct {
	logger  *slog.Logger
	handler http.Handler
}

func New(logger *slog.Logger) *Server {
	s := &Server{
		logger: logger,
	}

	mux := http.NewServeMux()

	interceptors := connect.WithInterceptors()

	mux.Handle(dcimv1connect.NewSiteServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewRoomServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewRackRowServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewRackServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewAssetServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewPlacementServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewPhysicalConnectionServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewCatalogServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewLogicalDesignServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewLogicalDeviceServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewLogicalConnectionServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewLogicalDeviceLayoutServiceHandler(s, interceptors))
	mux.Handle(dcimv1connect.NewNoteServiceHandler(s, interceptors))

	reflector := grpcreflect.NewStaticReflector(
		"dcim.v1.SiteService",
		"dcim.v1.RoomService",
		"dcim.v1.RackRowService",
		"dcim.v1.RackService",
		"dcim.v1.AssetService",
		"dcim.v1.PlacementService",
		"dcim.v1.PhysicalConnectionService",
		"dcim.v1.CatalogService",
		"dcim.v1.LogicalDesignService",
		"dcim.v1.LogicalDeviceService",
		"dcim.v1.LogicalConnectionService",
		"dcim.v1.LogicalDeviceLayoutService",
		"dcim.v1.NoteService",
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))

	s.handler = mux

	return s
}

func (s *Server) Handler() http.Handler {
	return s.handler
}
