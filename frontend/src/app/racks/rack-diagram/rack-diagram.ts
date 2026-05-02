import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DeviceState, Rack, RackDevice, RackSlot } from '../rack.model';

@Component({
  selector: 'app-rack-diagram',
  templateUrl: './rack-diagram.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RackDiagramComponent {
  readonly rack = input.required<Rack>();
  readonly viewMode = input<'front' | 'back'>('front');
  readonly activeDeviceId = input<string | null>(null);
  readonly deviceSelect = output<string>();

  readonly rackSlots = computed((): RackSlot[] => {
    const rack = this.rack();
    const slotMap = new Map<number, RackDevice>();
    for (const dev of rack.devices) {
      for (let u = dev.uStart; u < dev.uStart + dev.uSize; u++) {
        slotMap.set(u, dev);
      }
    }
    const slots: RackSlot[] = [];
    const seen = new Set<string>();
    for (let u = rack.totalU; u >= 1; u--) {
      const dev = slotMap.get(u) ?? null;
      if (dev) {
        const isFirst = !seen.has(dev.id);
        if (isFirst) seen.add(dev.id);
        slots.push({ u, device: dev, isFirst });
      } else {
        slots.push({ u, device: null, isFirst: true });
      }
    }
    return slots;
  });

  deviceHeight(device: RackDevice): number {
    return device.uSize * 28 + (device.uSize - 1);
  }

  deviceSlotClasses(device: RackDevice): string {
    if (device.type === 'switch') return 'bg-[#ffb612] border-[#e6a310] text-stone-900';
    if (device.type === 'patch')  return 'bg-[#a90061] border-[#8a004e] text-white';
    if (device.type === 'pdu')    return 'bg-[#42145f] border-[#33104a] text-white';
    const map: Record<DeviceState, string> = {
      allocated: 'bg-indigo-700 border-indigo-800 text-white',
      free:      'rack-slot-free',
      offline:   'bg-red-700 border-red-800 text-white',
      locked:    'bg-[#42145f] border-[#33104a] text-white',
      reserved:  'bg-[#8fcae7] border-[#74b8d8] text-stone-900',
    };
    return map[device.state];
  }

  deviceButtonClasses(device: RackDevice): string {
    const stateClasses = this.deviceSlotClasses(device);
    if (this.isActive(device)) {
      return `${stateClasses} relative z-10 ring-yellow-300! ring-2 ring-offset-1 ring-offset-gray-300"`;
    }
    return stateClasses;
  }

  powerBadgeClass(powerstate: 'ON' | 'OFF'): string {
    return powerstate === 'ON' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600';
  }

  isActive(device: RackDevice): boolean {
    return device.id === this.activeDeviceId();
  }
}
