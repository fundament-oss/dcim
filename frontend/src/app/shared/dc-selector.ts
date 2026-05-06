import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DATACENTER_INFO, DatacenterStatus } from '../datacenters/datacenter.model';

@Component({
  selector: 'app-dc-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Datacenter selection">
      @for (dc of datacenters; track dc.id) {
        <button
          (click)="dcSelected.emit(dc.id)"
          class="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500"
          [class]="
            selectedId() === dc.id
              ? 'bg-accent-50 text-accent-700 font-medium'
              : 'text-slate-600 hover:bg-slate-50'
          "
          [attr.aria-pressed]="selectedId() === dc.id"
        >
          <span
            class="h-2 w-2 rounded-full shrink-0"
            [class]="statusDotClass(dc.status)"
            aria-hidden="true"
          ></span>
          <span class="flex-1 text-left">{{ dc.name }}</span>
        </button>
      }
    </nav>
  `,
})
export default class DcSelectorComponent {
  readonly selectedId = input.required<string>();

  readonly dcSelected = output<string>();

  readonly datacenters = DATACENTER_INFO;

  readonly statusDotClass = (status: DatacenterStatus): string => {
    switch (status) {
      case 'operational':
        return 'bg-teal-500';
      case 'degraded':
        return 'bg-amber-500';
      case 'maintenance':
        return 'bg-slate-400';
      default:
        return '';
    }
  };
}
