import { Component, EventEmitter, Input, Output, ViewEncapsulation, AfterViewInit, OnDestroy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  Node,
  Connection,
  NodeChange,
  EdgeChange,
  OnConnectStartParams,
  ReactFlowInstance,
  OnSelectionChangeParams,
  Edge,
  DefaultEdgeOptions,
  HandleType,
  NodeTypes,
  EdgeTypes,
  ConnectionLineType,
  ConnectionLineComponent,
  ConnectionMode,
  KeyCode,
  NodeOrigin,
  Viewport,
  CoordinateExtent,
  PanOnScrollMode,
  FitViewOptions,
  PanelPosition,
  ProOptions,
  OnError,
} from 'reactflow';
import { ReactFlowWrappableComponent } from './reactflow';

@Component({
  selector: 'ngx-reactflow',
  template: `<div #reactContainer class="w-full h-full"></div>`,
  styleUrls: ['../../../node_modules/reactflow/dist/style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReactFlowComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('reactContainer', { static: true }) container!: ElementRef;

  private root: any;

  ngReactComponent = ReactFlowWrappableComponent;

  @Input() nodes?: Node<any, string | undefined>[] | undefined;
  @Input() edges?: Edge<any>[] | undefined;
  @Input() defaultEdgeOptions?: DefaultEdgeOptions | undefined;

  @Output() onNodeClick = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeDoubleClick = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeMouseEnter = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeMouseMove = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeMouseLeave = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeContextMenu = new EventEmitter<[MouseEvent, Node]>();
  @Output() onNodeDragStart = new EventEmitter<[MouseEvent, Node, Node[]]>();
  @Output() onNodeDrag = new EventEmitter<[MouseEvent, Node, Node[]]>();
  @Output() onNodeDragStop = new EventEmitter<[MouseEvent, Node, Node[]]>();
  @Output() onEdgeClick = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeUpdate = new EventEmitter<[any, Connection]>();
  @Output() onEdgeContextMenu = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeMouseEnter = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeMouseMove = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeMouseLeave = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeDoubleClick = new EventEmitter<[MouseEvent, Edge]>();
  @Output() onEdgeUpdateStart = new EventEmitter<[MouseEvent, Edge<any>, HandleType]>();
  @Output() onEdgeUpdateEnd = new EventEmitter<[MouseEvent, Edge<any>, HandleType]>();
  @Output() onNodesChange = new EventEmitter<[NodeChange[]]>();
  @Output() onEdgesChange = new EventEmitter<[EdgeChange[]]>();
  @Output() onNodesDelete = new EventEmitter<[Node[]]>();
  @Output() onEdgesDelete = new EventEmitter<[Edge[]]>();
  @Output() onSelectionDragStart = new EventEmitter<[MouseEvent, Node[]]>();
  @Output() onSelectionDrag = new EventEmitter<[MouseEvent, Node[]]>();
  @Output() onSelectionDragStop = new EventEmitter<[MouseEvent, Node[]]>();
  @Output() onSelectionStart = new EventEmitter<[MouseEvent]>();
  @Output() onSelectionEnd = new EventEmitter<[MouseEvent]>();
  @Output() onSelectionContextMenu = new EventEmitter<[MouseEvent, Node<any, string | undefined>[]]>();
  @Output() onConnect = new EventEmitter<[Connection]>();
  @Output() onConnectStart = new EventEmitter<[MouseEvent, OnConnectStartParams]>();
  @Output() onConnectEnd = new EventEmitter<[MouseEvent]>();
  @Output() onClickConnectStart = new EventEmitter<[MouseEvent, OnConnectStartParams]>();
  @Output() onClickConnectEnd = new EventEmitter<[MouseEvent]>();
  @Output() onInit = new EventEmitter<[ReactFlowInstance<any, any>]>();
  @Output() onMove = new EventEmitter<[MouseEvent, Viewport]>();
  @Output() onMoveStart = new EventEmitter<[MouseEvent, Viewport]>();
  @Output() onMoveEnd = new EventEmitter<[MouseEvent, Viewport]>();
  @Output() onSelectionChange = new EventEmitter<[OnSelectionChangeParams]>();
  @Output() onPaneScroll = new EventEmitter<[WheelEvent]>();
  @Output() onPaneClick = new EventEmitter<[MouseEvent]>();
  @Output() onPaneContextMenu = new EventEmitter<[MouseEvent]>();
  @Output() onPaneMouseEnter = new EventEmitter<[MouseEvent]>();
  @Output() onPaneMouseMove = new EventEmitter<[MouseEvent]>();
  @Output() onPaneMouseLeave = new EventEmitter<[MouseEvent]>();
  @Output() onError = new EventEmitter<OnError>();

  @Input() nodeTypes?: NodeTypes | undefined;
  @Input() edgeTypes?: EdgeTypes | undefined;
  @Input() connectionLineType?: ConnectionLineType | undefined;
  @Input() connectionLineStyle?: React.CSSProperties | undefined;
  @Input() connectionLineComponent?: ConnectionLineComponent | undefined;
  @Input() connectionLineContainerStyle?: React.CSSProperties | undefined;
  @Input() connectionMode?: ConnectionMode | undefined;
  @Input() deleteKeyCode?: KeyCode | null | undefined;
  @Input() selectionKeyCode?: KeyCode | null | undefined;
  @Input() selectionOnDrag?: boolean | undefined;
  @Input() panActivationKeyCode?: KeyCode | null | undefined;
  @Input() multiSelectionKeyCode?: KeyCode | null | undefined;
  @Input() zoomActivationKeyCode?: KeyCode | null | undefined;
  @Input() snapToGrid?: boolean | undefined;
  @Input() snapGrid?: [number, number] | undefined;
  @Input() onlyRenderVisibleElements?: boolean | undefined;
  @Input() nodesDraggable?: boolean | undefined;
  @Input() nodesConnectable?: boolean | undefined;
  @Input() nodesFocusable?: boolean | undefined;
  @Input() nodeOrigin?: NodeOrigin | undefined;
  @Input() edgesFocusable?: boolean | undefined;
  @Input() elementsSelectable?: boolean | undefined;
  @Input() selectNodesOnDrag?: boolean | undefined;
  @Input() panOnDrag?: boolean | number[] | undefined;
  @Input() minZoom?: number | undefined;
  @Input() maxZoom?: number | undefined;
  @Input() defaultViewport?: Viewport | undefined;
  @Input() translateExtent?: CoordinateExtent | undefined;
  @Input() preventScrolling?: boolean | undefined;
  @Input() nodeExtent?: CoordinateExtent | undefined;
  @Input() defaultMarkerColor?: string | undefined;
  @Input() zoomOnScroll?: boolean | undefined;
  @Input() zoomOnPinch?: boolean | undefined;
  @Input() panOnScroll?: boolean | undefined;
  @Input() panOnScrollSpeed?: number | undefined;
  @Input() panOnScrollMode?: PanOnScrollMode | undefined;
  @Input() zoomOnDoubleClick?: boolean | undefined;
  @Input() edgeUpdaterRadius?: number | undefined;
  @Input() noDragClassName?: string | undefined;
  @Input() noWheelClassName?: string | undefined;
  @Input() noPanClassName?: string | undefined;
  @Input() fitView?: boolean | undefined;
  @Input() fitViewOptions?: FitViewOptions | undefined;
  @Input() connectOnClick?: boolean | undefined;
  @Input() attributionPosition?: PanelPosition | undefined;
  @Input() proOptions?: ProOptions | undefined;
  @Input() elevateNodesOnSelect?: boolean | undefined;
  @Input() elevateEdgesOnSelect?: boolean | undefined;
  @Input() disableKeyboardA11y?: boolean | undefined;
  @Input() autoPanOnNodeDrag?: boolean | undefined;
  @Input() autoPanOnConnect?: boolean | undefined;
  @Input() connectionRadius?: number | undefined;

  ngAfterViewInit() {
    const props = this.getProps();
    this.root = ReactDOM.createRoot(this.container.nativeElement);
    this.root.render(React.createElement(this.ngReactComponent, props));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.root) {
      const props = this.getProps();
      this.root.render(React.createElement(this.ngReactComponent, props));
    }
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }

  private getProps() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      defaultEdgeOptions: this.defaultEdgeOptions,
      nodeTypes: this.nodeTypes,
      edgeTypes: this.edgeTypes,
      connectionLineType: this.connectionLineType,
      connectionLineStyle: this.connectionLineStyle,
      connectionLineComponent: this.connectionLineComponent,
      connectionLineContainerStyle: this.connectionLineContainerStyle,
      connectionMode: this.connectionMode,
      deleteKeyCode: this.deleteKeyCode,
      selectionKeyCode: this.selectionKeyCode,
      selectionOnDrag: this.selectionOnDrag,
      panActivationKeyCode: this.panActivationKeyCode,
      multiSelectionKeyCode: this.multiSelectionKeyCode,
      zoomActivationKeyCode: this.zoomActivationKeyCode,
      snapToGrid: this.snapToGrid,
      snapGrid: this.snapGrid,
      onlyRenderVisibleElements: this.onlyRenderVisibleElements,
      nodesDraggable: this.nodesDraggable,
      nodesConnectable: this.nodesConnectable,
      nodesFocusable: this.nodesFocusable,
      nodeOrigin: this.nodeOrigin,
      edgesFocusable: this.edgesFocusable,
      elementsSelectable: this.elementsSelectable,
      selectNodesOnDrag: this.selectNodesOnDrag,
      panOnDrag: this.panOnDrag,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      defaultViewport: this.defaultViewport,
      translateExtent: this.translateExtent,
      preventScrolling: this.preventScrolling,
      nodeExtent: this.nodeExtent,
      defaultMarkerColor: this.defaultMarkerColor,
      zoomOnScroll: this.zoomOnScroll,
      zoomOnPinch: this.zoomOnPinch,
      panOnScroll: this.panOnScroll,
      panOnScrollSpeed: this.panOnScrollSpeed,
      panOnScrollMode: this.panOnScrollMode,
      zoomOnDoubleClick: this.zoomOnDoubleClick,
      edgeUpdaterRadius: this.edgeUpdaterRadius,
      noDragClassName: this.noDragClassName,
      noWheelClassName: this.noWheelClassName,
      noPanClassName: this.noPanClassName,
      fitView: this.fitView,
      fitViewOptions: this.fitViewOptions,
      connectOnClick: this.connectOnClick,
      attributionPosition: this.attributionPosition,
      proOptions: this.proOptions,
      elevateNodesOnSelect: this.elevateNodesOnSelect,
      elevateEdgesOnSelect: this.elevateEdgesOnSelect,
      disableKeyboardA11y: this.disableKeyboardA11y,
      autoPanOnNodeDrag: this.autoPanOnNodeDrag,
      autoPanOnConnect: this.autoPanOnConnect,
      connectionRadius: this.connectionRadius,
      onNodeClick: (event: MouseEvent, node: Node) => this.onNodeClick.emit([event, node]),
      onNodeDoubleClick: (event: MouseEvent, node: Node) => this.onNodeDoubleClick.emit([event, node]),
      onNodeMouseEnter: (event: MouseEvent, node: Node) => this.onNodeMouseEnter.emit([event, node]),
      onNodeMouseMove: (event: MouseEvent, node: Node) => this.onNodeMouseMove.emit([event, node]),
      onNodeMouseLeave: (event: MouseEvent, node: Node) => this.onNodeMouseLeave.emit([event, node]),
      onNodeContextMenu: (event: MouseEvent, node: Node) => this.onNodeContextMenu.emit([event, node]),
      onNodeDragStart: (event: MouseEvent, node: Node, nodes: Node[]) => this.onNodeDragStart.emit([event, node, nodes]),
      onNodeDrag: (event: MouseEvent, node: Node, nodes: Node[]) => this.onNodeDrag.emit([event, node, nodes]),
      onNodeDragStop: (event: MouseEvent, node: Node, nodes: Node[]) => this.onNodeDragStop.emit([event, node, nodes]),
      onEdgeClick: (event: MouseEvent, edge: Edge) => this.onEdgeClick.emit([event, edge]),
      onEdgeUpdate: (oldEdge: any, newConnection: Connection) => this.onEdgeUpdate.emit([oldEdge, newConnection]),
      onEdgeContextMenu: (event: MouseEvent, edge: Edge) => this.onEdgeContextMenu.emit([event, edge]),
      onEdgeMouseEnter: (event: MouseEvent, edge: Edge) => this.onEdgeMouseEnter.emit([event, edge]),
      onEdgeMouseMove: (event: MouseEvent, edge: Edge) => this.onEdgeMouseMove.emit([event, edge]),
      onEdgeMouseLeave: (event: MouseEvent, edge: Edge) => this.onEdgeMouseLeave.emit([event, edge]),
      onEdgeDoubleClick: (event: MouseEvent, edge: Edge) => this.onEdgeDoubleClick.emit([event, edge]),
      onEdgeUpdateStart: (event: MouseEvent, edge: Edge, handleType: HandleType) => this.onEdgeUpdateStart.emit([event, edge, handleType]),
      onEdgeUpdateEnd: (event: MouseEvent, edge: Edge, handleType: HandleType) => this.onEdgeUpdateEnd.emit([event, edge, handleType]),
      onNodesChange: (changes: NodeChange[]) => this.onNodesChange.emit([changes]),
      onEdgesChange: (changes: EdgeChange[]) => this.onEdgesChange.emit([changes]),
      onNodesDelete: (nodes: Node[]) => this.onNodesDelete.emit([nodes]),
      onEdgesDelete: (edges: Edge[]) => this.onEdgesDelete.emit([edges]),
      onSelectionDragStart: (event: MouseEvent, nodes: Node[]) => this.onSelectionDragStart.emit([event, nodes]),
      onSelectionDrag: (event: MouseEvent, nodes: Node[]) => this.onSelectionDrag.emit([event, nodes]),
      onSelectionDragStop: (event: MouseEvent, nodes: Node[]) => this.onSelectionDragStop.emit([event, nodes]),
      onSelectionStart: (event: MouseEvent) => this.onSelectionStart.emit([event]),
      onSelectionEnd: (event: MouseEvent) => this.onSelectionEnd.emit([event]),
      onSelectionContextMenu: (event: MouseEvent, nodes: Node[]) => this.onSelectionContextMenu.emit([event, nodes]),
      onConnect: (connection: Connection) => this.onConnect.emit([connection]),
      onConnectStart: (event: MouseEvent, params: OnConnectStartParams) => this.onConnectStart.emit([event, params]),
      onConnectEnd: (event: MouseEvent) => this.onConnectEnd.emit([event]),
      onClickConnectStart: (event: MouseEvent, params: OnConnectStartParams) => this.onClickConnectStart.emit([event, params]),
      onClickConnectEnd: (event: MouseEvent) => this.onClickConnectEnd.emit([event]),
      onInit: (instance: ReactFlowInstance) => this.onInit.emit([instance]),
      onMove: (event: MouseEvent, viewport: Viewport) => this.onMove.emit([event, viewport]),
      onMoveStart: (event: MouseEvent, viewport: Viewport) => this.onMoveStart.emit([event, viewport]),
      onMoveEnd: (event: MouseEvent, viewport: Viewport) => this.onMoveEnd.emit([event, viewport]),
      onSelectionChange: (params: OnSelectionChangeParams) => this.onSelectionChange.emit([params]),
      onPaneScroll: (event: WheelEvent) => this.onPaneScroll.emit([event]),
      onPaneClick: (event: MouseEvent) => this.onPaneClick.emit([event]),
      onPaneContextMenu: (event: MouseEvent) => this.onPaneContextMenu.emit([event]),
      onPaneMouseEnter: (event: MouseEvent) => this.onPaneMouseEnter.emit([event]),
      onPaneMouseMove: (event: MouseEvent) => this.onPaneMouseMove.emit([event]),
      onPaneMouseLeave: (event: MouseEvent) => this.onPaneMouseLeave.emit([event]),
      onError: (error: OnError) => this.onError.emit(error),
    };
  }
}
