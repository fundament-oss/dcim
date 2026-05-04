import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  DATACENTER_INFO,
  DatacenterInfo,
  MOCK_RACK_ROWS,
  MOCK_ROOMS,
  RackRow,
  Room,
} from '../datacenter.model';
import { RACKS } from '../../racks/rack.model';

interface NativeElementRef {
  nativeElement: { value: string; show?: () => void; hide?: () => void };
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-datacenter-detail',
  templateUrl: './datacenter-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'flex flex-col bg-white text-slate-900' },
})
export default class DatacenterDetailComponent {
  private readonly route = inject(ActivatedRoute);

  // TODO(api): SiteService.GetSite(GetSiteRequest)
  readonly dc = computed<DatacenterInfo | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return DATACENTER_INFO.find((d) => d.id === id);
  });

  // ── Rooms ──────────────────────────────────────────────────────────────────

  // TODO(api): RoomService.ListRooms({ site_id })
  readonly mutableRooms = signal([...MOCK_ROOMS]);

  readonly dcRooms = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return this.mutableRooms().filter((r) => r.siteId === id);
  });

  // ── Rack rows ──────────────────────────────────────────────────────────────

  // TODO(api): RackRowService.ListRackRows({ room_id })
  readonly mutableRackRows = signal([...MOCK_RACK_ROWS]);

  rackRowsForRoom(roomId: string): RackRow[] {
    return this.mutableRackRows().filter((rr) => rr.roomId === roomId);
  }

  // ── Racks in this DC ───────────────────────────────────────────────────────

  readonly dcRacks = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return RACKS.filter((r) => r.dcId === id);
  });

  // ── Room CRUD ──────────────────────────────────────────────────────────────

  editRoom = signal<Partial<Room> | null>(null);

  deleteRoom = signal<Room | null>(null);

  private readonly roomSheetEl = viewChild<NativeElementRef>('roomSheet');

  private readonly roomModalEl = viewChild<NativeElementRef>('roomModal');

  private readonly fRoomName = viewChild<NativeElementRef>('fRoomName');

  private readonly fRoomFloor = viewChild<NativeElementRef>('fRoomFloor');

  // ── RackRow CRUD ───────────────────────────────────────────────────────────

  editRackRow = signal<Partial<RackRow> | null>(null);

  deleteRackRow = signal<RackRow | null>(null);

  activeRoomId = signal<string>('');

  private readonly rowSheetEl = viewChild<NativeElementRef>('rowSheet');

  private readonly rowModalEl = viewChild<NativeElementRef>('rowModal');

  private readonly fRowName = viewChild<NativeElementRef>('fRowName');

  private readonly fRowX = viewChild<NativeElementRef>('fRowX');

  private readonly fRowY = viewChild<NativeElementRef>('fRowY');

  constructor() {
    effect(() => {
      const el = this.roomSheetEl()?.nativeElement;
      if (this.editRoom() !== null) el?.show?.();
      else el?.hide?.();
    });
    effect(() => {
      const el = this.roomModalEl()?.nativeElement;
      if (this.deleteRoom() !== null) el?.show?.();
      else el?.hide?.();
    });
    effect(() => {
      const el = this.rowSheetEl()?.nativeElement;
      if (this.editRackRow() !== null) el?.show?.();
      else el?.hide?.();
    });
    effect(() => {
      const el = this.rowModalEl()?.nativeElement;
      if (this.deleteRackRow() !== null) el?.show?.();
      else el?.hide?.();
    });
  }

  // ── Room actions ───────────────────────────────────────────────────────────

  openCreateRoom(): void {
    const dcId = this.route.snapshot.paramMap.get('id') ?? '';
    this.editRoom.set({ id: '', siteId: dcId, name: '', floor: 1 });
  }

  openEditRoom(room: Room): void {
    this.editRoom.set({ ...room });
  }

  closeRoomForm(): void {
    this.editRoom.set(null);
  }

  saveRoom(): void {
    const form = this.editRoom();
    if (!form) return;
    const name = this.fRoomName()?.nativeElement.value ?? '';
    const floor = parseInt(this.fRoomFloor()?.nativeElement.value ?? '1', 10) || 1;
    const updated: Room = {
      id: form.id || `room-${Date.now()}`,
      siteId: form.siteId!,
      name,
      floor,
    };
    // TODO(api): form.id ? RoomService.UpdateRoom(UpdateRoomRequest) : RoomService.CreateRoom(CreateRoomRequest)
    if (form.id) {
      this.mutableRooms.update((list) => list.map((r) => (r.id === form.id ? updated : r)));
    } else {
      this.mutableRooms.update((list) => [...list, updated]);
    }
    this.editRoom.set(null);
  }

  openDeleteRoom(room: Room): void {
    this.deleteRoom.set(room);
  }

  cancelDeleteRoom(): void {
    this.deleteRoom.set(null);
  }

  confirmDeleteRoom(): void {
    const target = this.deleteRoom();
    if (!target) return;
    // TODO(api): RoomService.DeleteRoom(DeleteRoomRequest)
    this.mutableRooms.update((list) => list.filter((r) => r.id !== target.id));
    this.mutableRackRows.update((list) => list.filter((rr) => rr.roomId !== target.id));
    this.deleteRoom.set(null);
  }

  // ── Rack row actions ───────────────────────────────────────────────────────

  openCreateRackRow(roomId: string): void {
    this.activeRoomId.set(roomId);
    this.editRackRow.set({ id: '', roomId, name: '', positionX: 1, positionY: 1 });
  }

  openEditRackRow(rr: RackRow): void {
    this.activeRoomId.set(rr.roomId);
    this.editRackRow.set({ ...rr });
  }

  closeRackRowForm(): void {
    this.editRackRow.set(null);
  }

  saveRackRow(): void {
    const form = this.editRackRow();
    if (!form) return;
    const name = this.fRowName()?.nativeElement.value ?? '';
    const posX = parseInt(this.fRowX()?.nativeElement.value ?? '1', 10) || 1;
    const posY = parseInt(this.fRowY()?.nativeElement.value ?? '1', 10) || 1;
    const updated: RackRow = {
      id: form.id || `rr-${Date.now()}`,
      roomId: form.roomId!,
      name,
      positionX: posX,
      positionY: posY,
    };
    // TODO(api): form.id ? RackRowService.UpdateRackRow(UpdateRackRowRequest) : RackRowService.CreateRackRow(CreateRackRowRequest)
    if (form.id) {
      this.mutableRackRows.update((list) => list.map((rr) => (rr.id === form.id ? updated : rr)));
    } else {
      this.mutableRackRows.update((list) => [...list, updated]);
    }
    this.editRackRow.set(null);
  }

  openDeleteRackRow(rr: RackRow): void {
    this.deleteRackRow.set(rr);
  }

  cancelDeleteRackRow(): void {
    this.deleteRackRow.set(null);
  }

  confirmDeleteRackRow(): void {
    const target = this.deleteRackRow();
    if (!target) return;
    // TODO(api): RackRowService.DeleteRackRow(DeleteRackRowRequest)
    this.mutableRackRows.update((list) => list.filter((rr) => rr.id !== target.id));
    this.deleteRackRow.set(null);
  }
}
