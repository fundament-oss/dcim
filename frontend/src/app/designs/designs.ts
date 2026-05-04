import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LogicalDesign,
  LogicalDesignStatus,
  MOCK_DESIGNS,
} from './design.model';

interface NativeElementRef {
  nativeElement: { value: string; show?: () => void; hide?: () => void };
}

@Component({
  selector: 'app-designs',
  templateUrl: './designs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'flex flex-col min-h-screen bg-white' },
})
export default class DesignsComponent {
  statusFilter = signal<LogicalDesignStatus | 'all'>('all');

  searchQuery  = signal('');

  // ── Mutable designs list ───────────────────────────────────────────────────
  readonly mutableDesigns = signal([...MOCK_DESIGNS]);

  // ── CRUD state — null = closed, object = open ──────────────────────────────
  editDesign   = signal<Partial<LogicalDesign> | null>(null);

  deleteDesign = signal<LogicalDesign | null>(null);

  private readonly designSheetEl = viewChild<NativeElementRef>('designSheet');

  private readonly deleteModalEl = viewChild<NativeElementRef>('deleteModal');

  private readonly fDesignName   = viewChild<NativeElementRef>('fDesignName');

  constructor() {
    effect(() => {
      const el = this.designSheetEl()?.nativeElement;
      if (this.editDesign() !== null) el?.show?.(); else el?.hide?.();
    });
    effect(() => {
      const el = this.deleteModalEl()?.nativeElement;
      if (this.deleteDesign() !== null) el?.show?.(); else el?.hide?.();
    });
  }

  readonly filtered = computed(() => {
    const q      = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    return this.mutableDesigns().filter(d => {
      if (status !== 'all' && d.status !== status) return false;
      if (q && !d.name.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  readonly counts = computed(() => {
    const all = this.mutableDesigns();
    return {
      all:      all.length,
      draft:    all.filter(d => d.status === 'draft').length,
      active:   all.filter(d => d.status === 'active').length,
      archived: all.filter(d => d.status === 'archived').length,
    };
  });

  // ── Actions ────────────────────────────────────────────────────────────────

  openNewDesign(): void {
    this.editDesign.set({ id: '', name: '', version: 1, status: 'draft' });
  }

  closeDesignForm(): void {
    this.editDesign.set(null);
  }

  saveDesign(): void {
    const name = this.fDesignName()?.nativeElement.value ?? '';
    if (!name?.trim()) return;
    // TODO(api): LogicalDesignService.CreateLogicalDesign(CreateLogicalDesignRequest)
    const design: LogicalDesign = {
      id:      `design-${  Date.now()}`,
      name:    name.trim(),
      version: 1,
      status:  'draft',
      created: new Date().toISOString().slice(0, 10),
    };
    this.mutableDesigns.update(list => [design, ...list]);
    this.editDesign.set(null);
  }

  archiveDesign(design: LogicalDesign): void {
    // TODO(api): LogicalDesignService.UpdateLogicalDesign({ id, status: 'archived' })
    this.mutableDesigns.update(list =>
      list.map(d => d.id === design.id ? { ...d, status: 'archived' as LogicalDesignStatus } : d),
    );
  }

  openDeleteDesign(design: LogicalDesign): void {
    this.deleteDesign.set(design);
  }

  cancelDeleteDesign(): void {
    this.deleteDesign.set(null);
  }

  confirmDeleteDesign(): void {
    const target = this.deleteDesign();
    if (!target) return;
    // TODO(api): LogicalDesignService.DeleteLogicalDesign(DeleteLogicalDesignRequest)
    this.mutableDesigns.update(list => list.filter(d => d.id !== target.id));
    this.deleteDesign.set(null);
  }

  readonly statusBadgeClass = (status: LogicalDesignStatus): string => {
    const statusMap: Record<LogicalDesignStatus, string> = {
      draft:    'bg-slate-100 text-slate-600',
      active:   'bg-green-50 text-green-700',
      archived: 'bg-amber-50 text-amber-700',
    };
    return statusMap[status];
  };

  readonly statusLabel = (status: LogicalDesignStatus): string => {
    const statusMap: Record<LogicalDesignStatus, string> = {
      draft:    'Draft',
      active:   'Active',
      archived: 'Archived',
    };
    return statusMap[status];
  };

  readonly formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
