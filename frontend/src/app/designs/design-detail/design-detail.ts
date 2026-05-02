import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DesignFlowWrapperComponent } from '../design-flow-wrapper';
import {
  LogicalConnection,
  LogicalConnectionType,
  LogicalDesign,
  LogicalDevice,
  LogicalDeviceLayout,
  LogicalDeviceRole,
  MOCK_DESIGNS,
  MOCK_LOGICAL_CONNECTIONS,
  MOCK_LOGICAL_DEVICES,
  MOCK_DEVICE_LAYOUTS,
  DEVICE_ROLE_COLORS,
} from '../design.model';

const ALL_ROLES: LogicalDeviceRole[] = [
  'Compute', 'ToR', 'Spine', 'Core', 'PDU', 'Patch Panel',
  'Storage', 'Firewall', 'Load Balancer', 'Console Server',
  'Cable Manager', 'Adapter',
];

@Component({
  selector: 'app-design-detail',
  templateUrl: './design-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DesignFlowWrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'flex flex-col overflow-hidden', style: 'height: calc(100dvh - 4.25rem)' },
})
export class DesignDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly designId = this.route.snapshot.paramMap.get('id') ?? '';

  // ── Mutable state ──────────────────────────────────────────────────────────
  readonly mutableDesigns     = signal([...MOCK_DESIGNS]);
  readonly mutableDevices     = signal([...MOCK_LOGICAL_DEVICES]);
  readonly mutableConnections = signal([...MOCK_LOGICAL_CONNECTIONS]);
  readonly mutableLayouts     = signal([...MOCK_DEVICE_LAYOUTS]);

  readonly design = computed<LogicalDesign | undefined>(() =>
    this.mutableDesigns().find(d => d.id === this.designId),
  );

  readonly devices = computed(() =>
    this.mutableDevices().filter(d => d.designId === this.designId),
  );

  readonly connections = computed(() =>
    this.mutableConnections().filter(c => c.designId === this.designId),
  );

  readonly layouts = computed(() => this.mutableLayouts());

  // ── Selection ──────────────────────────────────────────────────────────────
  selectedDeviceId = signal<string | null>(null);

  readonly selectedDevice = computed(() => {
    const id = this.selectedDeviceId();
    return id ? this.mutableDevices().find(d => d.id === id) ?? null : null;
  });

  readonly selectedDeviceConnections = computed(() => {
    const id = this.selectedDeviceId();
    if (!id) return [];
    return this.mutableConnections().filter(
      c => c.designId === this.designId && (c.sourceDeviceId === id || c.targetDeviceId === id),
    );
  });

  // ── Device CRUD state ──────────────────────────────────────────────────────
  editDevice   = signal<Partial<LogicalDevice> | null>(null);
  deleteDevice = signal<LogicalDevice | null>(null);

  private readonly deviceSheetEl  = viewChild<ElementRef>('deviceSheet');
  private readonly deviceModalEl  = viewChild<ElementRef>('deviceModal');
  private readonly fDeviceName    = viewChild<ElementRef>('fDeviceName');
  private readonly fDeviceRole    = viewChild<ElementRef>('fDeviceRole');

  // ── Connection CRUD state ──────────────────────────────────────────────────
  editConnection   = signal<Partial<LogicalConnection> | null>(null);
  deleteConnection = signal<LogicalConnection | null>(null);

  private readonly connSheetEl    = viewChild<ElementRef>('connSheet');
  private readonly connModalEl    = viewChild<ElementRef>('connModal');
  private readonly fConnSrcDevice = viewChild<ElementRef>('fConnSrcDevice');
  private readonly fConnSrcPort   = viewChild<ElementRef>('fConnSrcPort');
  private readonly fConnTgtDevice = viewChild<ElementRef>('fConnTgtDevice');
  private readonly fConnTgtPort   = viewChild<ElementRef>('fConnTgtPort');
  private readonly fConnType      = viewChild<ElementRef>('fConnType');

  readonly allRoles = ALL_ROLES;

  constructor() {
    effect(() => {
      const el = this.deviceSheetEl()?.nativeElement as any;
      if (this.editDevice() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.deviceModalEl()?.nativeElement as any;
      if (this.deleteDevice() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.connSheetEl()?.nativeElement as any;
      if (this.editConnection() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.connModalEl()?.nativeElement as any;
      if (this.deleteConnection() !== null) el?.show(); else el?.hide();
    });
  }

  // ── Device actions ─────────────────────────────────────────────────────────

  openAddDevice(): void {
    this.editDevice.set({ id: '', designId: this.designId, name: '', role: 'Compute' });
  }

  openEditDevice(device: LogicalDevice): void {
    this.editDevice.set({ ...device });
  }

  closeDeviceForm(): void {
    this.editDevice.set(null);
  }

  saveDevice(): void {
    const form = this.editDevice();
    if (!form) return;
    const name = (this.fDeviceName()?.nativeElement as any)?.value as string;
    const role = ((this.fDeviceRole()?.nativeElement as any)?.value ?? 'Compute') as LogicalDeviceRole;
    const updated: LogicalDevice = {
      id:       form.id || 'dev-' + Date.now(),
      designId: this.designId,
      name,
      role,
    };
    // TODO(api): form.id ? LogicalDeviceService.UpdateLogicalDevice(UpdateLogicalDeviceRequest) : LogicalDeviceService.CreateLogicalDevice(CreateLogicalDeviceRequest)
    if (form.id) {
      this.mutableDevices.update(list => list.map(d => d.id === form.id ? updated : d));
    } else {
      this.mutableDevices.update(list => [...list, updated]);
      this.mutableLayouts.update(list => [...list, { deviceId: updated.id, x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 }]);
    }
    this.editDevice.set(null);
  }

  openDeleteDevice(device: LogicalDevice): void {
    this.deleteDevice.set(device);
    this.editDevice.set(null);
  }

  cancelDeleteDevice(): void {
    this.deleteDevice.set(null);
  }

  confirmDeleteDevice(): void {
    const target = this.deleteDevice();
    if (!target) return;
    // TODO(api): LogicalDeviceService.DeleteLogicalDevice(DeleteLogicalDeviceRequest)
    this.mutableDevices.update(list => list.filter(d => d.id !== target.id));
    this.mutableConnections.update(list =>
      list.filter(c => c.sourceDeviceId !== target.id && c.targetDeviceId !== target.id),
    );
    this.mutableLayouts.update(list => list.filter(l => l.deviceId !== target.id));
    if (this.selectedDeviceId() === target.id) this.selectedDeviceId.set(null);
    this.deleteDevice.set(null);
  }

  // ── Connection actions ─────────────────────────────────────────────────────

  openAddConnection(): void {
    this.editConnection.set({
      id: '',
      designId: this.designId,
      sourceDeviceId: this.selectedDeviceId() ?? '',
      sourcePortRole: '',
      targetDeviceId: '',
      targetPortRole: '',
      connectionType: 'network',
    });
  }

  openEditConnection(conn: LogicalConnection): void {
    this.editConnection.set({ ...conn });
  }

  closeConnForm(): void {
    this.editConnection.set(null);
  }

  saveConnection(): void {
    const form = this.editConnection();
    if (!form) return;
    const srcDeviceId = (this.fConnSrcDevice()?.nativeElement as any)?.value as string;
    const srcPort     = (this.fConnSrcPort()?.nativeElement as any)?.value as string;
    const tgtDeviceId = (this.fConnTgtDevice()?.nativeElement as any)?.value as string;
    const tgtPort     = (this.fConnTgtPort()?.nativeElement as any)?.value as string;
    const connType    = ((this.fConnType()?.nativeElement as any)?.value ?? 'network') as LogicalConnectionType;
    const updated: LogicalConnection = {
      id:              form.id || 'conn-' + Date.now(),
      designId:        this.designId,
      sourceDeviceId:  srcDeviceId,
      sourcePortRole:  srcPort,
      targetDeviceId:  tgtDeviceId,
      targetPortRole:  tgtPort,
      connectionType:  connType,
    };
    // TODO(api): form.id ? LogicalConnectionService.UpdateLogicalConnection(UpdateLogicalConnectionRequest) : LogicalConnectionService.CreateLogicalConnection(CreateLogicalConnectionRequest)
    if (form.id) {
      this.mutableConnections.update(list => list.map(c => c.id === form.id ? updated : c));
    } else {
      this.mutableConnections.update(list => [...list, updated]);
    }
    this.editConnection.set(null);
  }

  openDeleteConnection(conn: LogicalConnection): void {
    this.deleteConnection.set(conn);
    this.editConnection.set(null);
  }

  cancelDeleteConnection(): void {
    this.deleteConnection.set(null);
  }

  confirmDeleteConnection(): void {
    const target = this.deleteConnection();
    if (!target) return;
    // TODO(api): LogicalConnectionService.DeleteLogicalConnection(DeleteLogicalConnectionRequest)
    this.mutableConnections.update(list => list.filter(c => c.id !== target.id));
    this.deleteConnection.set(null);
  }

  // ── Design status transitions ──────────────────────────────────────────────

  activateDesign(): void {
    // TODO(api): LogicalDesignService.UpdateLogicalDesign({ id, status: 'active' })
    this.mutableDesigns.update(list =>
      list.map(d => d.id === this.designId ? { ...d, status: 'active' as const } : d),
    );
  }

  archiveDesign(): void {
    // TODO(api): LogicalDesignService.UpdateLogicalDesign({ id, status: 'archived' })
    this.mutableDesigns.update(list =>
      list.map(d => d.id === this.designId ? { ...d, status: 'archived' as const } : d),
    );
  }

  // ── Layout persistence ─────────────────────────────────────────────────────

  onLayoutChanged(layouts: LogicalDeviceLayout[]): void {
    // TODO(api): LogicalDeviceLayoutService.SaveLogicalDeviceLayout(SaveLogicalDeviceLayoutRequest)
    this.mutableLayouts.set(layouts);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  deviceName(id: string): string {
    return this.mutableDevices().find(d => d.id === id)?.name ?? id;
  }

  roleColor(role: LogicalDeviceRole): string {
    return DEVICE_ROLE_COLORS[role]?.text ?? '#475569';
  }

  roleBg(role: LogicalDeviceRole): string {
    return DEVICE_ROLE_COLORS[role]?.bg ?? '#f8fafc';
  }

  roleBorder(role: LogicalDeviceRole): string {
    return DEVICE_ROLE_COLORS[role]?.border ?? '#94a3b8';
  }

  connTypeLabel(type: LogicalConnectionType): string {
    const map: Record<LogicalConnectionType, string> = {
      network: 'Network',
      power:   'Power',
      console: 'Console',
    };
    return map[type];
  }

  connTypeBadgeClass(type: LogicalConnectionType): string {
    const map: Record<LogicalConnectionType, string> = {
      network: 'bg-blue-50 text-blue-700',
      power:   'bg-amber-50 text-amber-700',
      console: 'bg-slate-100 text-slate-600',
    };
    return map[type];
  }

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      draft:    'bg-slate-100 text-slate-600',
      active:   'bg-green-50 text-green-700',
      archived: 'bg-amber-50 text-amber-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-600';
  }
}
