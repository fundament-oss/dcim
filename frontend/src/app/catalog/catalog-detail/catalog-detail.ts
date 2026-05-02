import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  Asset,
  AssetCategory,
  AssetStatus,
  CatalogEntry,
  MOCK_ASSETS,
  MOCK_CATALOG,
  MOCK_PORT_DEFINITIONS,
  MOCK_PORT_COMPATIBILITIES,
  PortDefinition,
  PortCompatibility,
} from '../../inventory/inventory';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'block bg-slate-50 min-h-screen' },
})
export class CatalogDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly catalogId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  readonly entry = computed<CatalogEntry | undefined>(() =>
    MOCK_CATALOG.find(e => e.id === this.catalogId()),
  );

  readonly assets = computed<Asset[]>(() => {
    const model = this.entry()?.model;
    return model ? MOCK_ASSETS.filter(a => a.model === model) : [];
  });

  readonly deployedCount  = computed(() => this.assets().filter(a => a.status === 'deployed').length);
  readonly availableCount = computed(() => this.assets().filter(a => a.status === 'available').length);
  readonly issuesCount    = computed(() => this.assets().filter(a => a.status === 'needs-repair' || a.status === 'decommissioned').length);

  // ── Port definitions ───────────────────────────────────────────────────────
  readonly mutablePortDefs    = signal([...MOCK_PORT_DEFINITIONS]);
  readonly mutableCompatibilities = signal([...MOCK_PORT_COMPATIBILITIES]);

  readonly portDefs = computed(() =>
    this.mutablePortDefs().filter(p => p.catalogEntryId === this.catalogId()),
  );

  readonly compatibilities = computed(() => {
    const pdIds = new Set(this.portDefs().map(p => p.id));
    return this.mutableCompatibilities().filter(c => pdIds.has(c.portDefinitionId));
  });

  // ── Port definition CRUD state ────────────────────────────────────────────
  editPortDef   = signal<Partial<PortDefinition> | null>(null);
  deletePortDef = signal<PortDefinition | null>(null);

  private readonly portSheetEl  = viewChild<ElementRef>('portSheet');
  private readonly portModalEl  = viewChild<ElementRef>('portModal');
  private readonly fPortName    = viewChild<ElementRef>('fPortName');
  private readonly fPortType    = viewChild<ElementRef>('fPortType');
  private readonly fPortSpeed   = viewChild<ElementRef>('fPortSpeed');
  private readonly fPortPower   = viewChild<ElementRef>('fPortPower');

  // ── Port compatibility CRUD state ─────────────────────────────────────────
  addCompatPortDefId = signal<string | null>(null);
  deleteCompat       = signal<PortCompatibility | null>(null);

  private readonly compatModalEl      = viewChild<ElementRef>('compatModal');
  private readonly compatDeleteModalEl = viewChild<ElementRef>('compatDeleteModal');
  private readonly fCompatEntry       = viewChild<ElementRef>('fCompatEntry');

  // ── Catalog list for compatibility dropdown ────────────────────────────────
  readonly allCatalogEntries = MOCK_CATALOG;

  constructor() {
    effect(() => {
      const el = this.portSheetEl()?.nativeElement as any;
      if (this.editPortDef() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.portModalEl()?.nativeElement as any;
      if (this.deletePortDef() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.compatModalEl()?.nativeElement as any;
      if (this.addCompatPortDefId() !== null) el?.show(); else el?.hide();
    });
    effect(() => {
      const el = this.compatDeleteModalEl()?.nativeElement as any;
      if (this.deleteCompat() !== null) el?.show(); else el?.hide();
    });
  }

  // ── Port definition actions ────────────────────────────────────────────────

  openCreatePortDef(): void {
    this.editPortDef.set({ id: '', catalogEntryId: this.catalogId(), name: '', portType: '' });
  }

  openEditPortDef(pd: PortDefinition): void {
    this.editPortDef.set({ ...pd });
  }

  closePortDefForm(): void {
    this.editPortDef.set(null);
  }

  savePortDef(): void {
    const form = this.editPortDef();
    if (!form) return;
    const name      = (this.fPortName()?.nativeElement as any)?.value as string;
    const portType  = (this.fPortType()?.nativeElement as any)?.value as string;
    const speedRaw  = (this.fPortSpeed()?.nativeElement as any)?.value;
    const powerRaw  = (this.fPortPower()?.nativeElement as any)?.value;
    const speedGbps = speedRaw ? parseFloat(speedRaw) : undefined;
    const powerWatts = powerRaw ? parseFloat(powerRaw) : undefined;
    const updated: PortDefinition = {
      id:              form.id || 'pd-' + Date.now(),
      catalogEntryId:  this.catalogId(),
      name,
      portType,
      ...(speedGbps != null && !isNaN(speedGbps) ? { speedGbps } : {}),
      ...(powerWatts != null && !isNaN(powerWatts) ? { powerWatts } : {}),
    };
    // TODO(api): form.id ? CatalogService.UpdatePortDefinition(UpdatePortDefinitionRequest) : CatalogService.CreatePortDefinition(CreatePortDefinitionRequest)
    if (form.id) {
      this.mutablePortDefs.update(list => list.map(p => p.id === form.id ? updated : p));
    } else {
      this.mutablePortDefs.update(list => [...list, updated]);
    }
    this.editPortDef.set(null);
  }

  openDeletePortDef(pd: PortDefinition): void {
    this.deletePortDef.set(pd);
  }

  cancelDeletePortDef(): void {
    this.deletePortDef.set(null);
  }

  confirmDeletePortDef(): void {
    const target = this.deletePortDef();
    if (!target) return;
    // TODO(api): CatalogService.DeletePortDefinition(DeletePortDefinitionRequest)
    this.mutablePortDefs.update(list => list.filter(p => p.id !== target.id));
    this.mutableCompatibilities.update(list => list.filter(c => c.portDefinitionId !== target.id));
    this.deletePortDef.set(null);
  }

  // ── Port compatibility actions ─────────────────────────────────────────────

  openAddCompatibility(portDefId: string): void {
    this.addCompatPortDefId.set(portDefId);
  }

  cancelAddCompatibility(): void {
    this.addCompatPortDefId.set(null);
  }

  confirmAddCompatibility(): void {
    const pdId    = this.addCompatPortDefId();
    const entryId = (this.fCompatEntry()?.nativeElement as any)?.value as string;
    if (!pdId || !entryId) return;
    // TODO(api): CatalogService.CreatePortCompatibility(CreatePortCompatibilityRequest)
    this.mutableCompatibilities.update(list => [
      ...list,
      { id: 'pc-' + Date.now(), portDefinitionId: pdId, compatibleCatalogEntryId: entryId },
    ]);
    this.addCompatPortDefId.set(null);
  }

  openDeleteCompat(compat: PortCompatibility): void {
    this.deleteCompat.set(compat);
  }

  cancelDeleteCompat(): void {
    this.deleteCompat.set(null);
  }

  confirmDeleteCompat(): void {
    const target = this.deleteCompat();
    if (!target) return;
    // TODO(api): CatalogService.DeletePortCompatibility(DeletePortCompatibilityRequest)
    this.mutableCompatibilities.update(list => list.filter(c => c.id !== target.id));
    this.deleteCompat.set(null);
  }

  compatibleEntryName(entryId: string): string {
    return MOCK_CATALOG.find(e => e.id === entryId)?.model ?? entryId;
  }

  portDefName(pdId: string): string {
    return this.mutablePortDefs().find(p => p.id === pdId)?.name ?? pdId;
  }

  compatibilitiesForPortDef(pdId: string): PortCompatibility[] {
    return this.mutableCompatibilities().filter(c => c.portDefinitionId === pdId);
  }

  specEntries(specs: Record<string, string>): { key: string; value: string }[] {
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }

  categoryIcon(category: AssetCategory): string {
    const map: Partial<Record<AssetCategory, string>> = {
      Server: 'cylinder-split', Switch: 'list', Storage: 'rectangle-stack',
      Power: 'lock-closed', Firewall: 'shield-check-mark', Cooling: 'cloud',
      KVM: 'puzzle-piece', Other: 'ellipsis', Memory: 'folder',
      Disk: 'cylinder-split', NIC: 'puzzle-piece', PSU: 'lock-closed',
      CPU: 'gear', GPU: 'gear', Transceiver: 'puzzle-piece',
    };
    return map[category] ?? 'rectangle-stack';
  }

  statusLabel(status: AssetStatus): string {
    const labels: Record<AssetStatus, string> = {
      deployed: 'Deployed',
      available: 'Available',
      'needs-repair': 'Needs Repair',
      decommissioned: 'Decommissioned',
      'on-order': 'On Order',
      requested: 'Requested',
    };
    return labels[status];
  }

  statusBadgeClass(status: AssetStatus): string {
    const classes: Record<AssetStatus, string> = {
      deployed: 'bg-teal-50 text-teal-700',
      available: 'bg-green-50 text-green-700',
      'needs-repair': 'bg-amber-50 text-amber-700',
      decommissioned: 'bg-slate-100 text-slate-500',
      'on-order': 'bg-blue-50 text-blue-700',
      requested: 'bg-purple-50 text-purple-700',
    };
    return classes[status];
  }

  statusDotClass(status: AssetStatus): string {
    const classes: Record<AssetStatus, string> = {
      deployed: 'bg-teal-400',
      available: 'bg-green-400',
      'needs-repair': 'bg-amber-400',
      decommissioned: 'bg-slate-300',
      'on-order': 'bg-blue-400',
      requested: 'bg-purple-400',
    };
    return classes[status];
  }
}
