import { Component, ChangeDetectionStrategy, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

interface GatherItem {
  label: string;
  taskFor?: string;
}

interface Step {
  title: string;
  description: string;
  icon: string;
  svg: string;
}

interface Task {
  title: string;
  priority: 'critical' | 'high' | 'normal';
  location: string;
  steps: Step[];
}

@Component({
  selector: 'app-task-management-technician',
  templateUrl: './task-management-technician.html',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-neutral-50 font-sans text-neutral-900 antialiased' },
})
export class TaskManagementTechnicianComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const DC_NAME = 'DC Amsterdam-West';

    // ── Gather items (combined, deduplicated) ──
    const gatherItems: GatherItem[] = [
      { label: 'Anti-static wrist strap' },
      { label: 'Phillips-head screwdriver' },
      { label: 'Multimeter' },
      { label: 'Seagate Exos X18, 16 TB', taskFor: 'Replace broken harddisk — Rack 123' },
      { label: 'Cisco Catalyst 9200L switch', taskFor: 'Replace network switch — Rack 87' },
    ];

    // ── Tasks (priority-sorted: critical first) ──
    const tasks: Task[] = [
      {
        title: 'Replace broken harddisk',
        priority: 'critical',
        location: `${DC_NAME} · Rack 123`,
        steps: [
          {
            title: 'Navigate to data center Hall B',
            description: 'Head to Hall B via the main corridor. Follow the blue floor markers. Your destination is Row 12, approximately halfway down the hall on the left side.',
            icon: 'info-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="10" y="20" width="100" height="60" rx="6" stroke="#e2e8f0" stroke-width="1.5" fill="#f8fafc"/>
              <rect x="18" y="28" width="30" height="44" rx="3" stroke="#cbd5e1" stroke-width="1" fill="white"/>
              <text x="33" y="42" text-anchor="middle" fill="#94a3b8" font-size="7" font-weight="600">Hall A</text>
              <rect x="56" y="28" width="30" height="44" rx="3" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <text x="71" y="42" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">Hall B</text>
              <line x1="62" y1="50" x2="62" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="68" y1="50" x2="68" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="74" y1="50" x2="74" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="80" y1="50" x2="80" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <circle cx="68" cy="58" r="4" fill="#6366f1"/>
              <circle cx="68" cy="58" r="2" fill="white"/>
              <path d="M48 50 L56 50" stroke="#6366f1" stroke-width="2" stroke-dasharray="3 2"/>
              <text x="71" y="54" text-anchor="middle" fill="#4f46e5" font-size="5">Row 12</text>
            </svg>`,
          },
          {
            title: 'Enter the cold aisle',
            description: 'Use your access badge on the card reader to enter the cold aisle between Row 12 and Row 13. The door will lock behind you automatically. Ensure the aisle containment doors are properly sealed after entry.',
            icon: 'arrow-right',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="25" y="15" width="35" height="65" rx="4" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="30" y="20" width="25" height="55" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <circle cx="50" cy="48" r="2.5" fill="#6366f1"/>
              <rect x="70" y="30" width="22" height="32" rx="4" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="74" y="36" width="14" height="8" rx="2" fill="#a5b4fc"/>
              <rect x="74" y="48" width="14" height="8" rx="2" fill="#c7d2fe"/>
              <path d="M60 48 L70 42" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 2"/>
              <path d="M76 85 Q81 80 86 85" stroke="#22c55e" stroke-width="2" fill="none"/>
              <circle cx="81" cy="88" r="1" fill="#22c55e"/>
            </svg>`,
          },
          {
            title: 'Locate Rack 123',
            description: 'Rack 123 is on the left side of the aisle, the 4th rack from the entrance. It has a label plate reading "R-123" at the top. Verify the rack number before proceeding.',
            icon: 'database',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="10" y="15" width="18" height="70" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f8fafc"/>
              <rect x="30" y="15" width="18" height="70" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f8fafc"/>
              <rect x="50" y="15" width="18" height="70" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f8fafc"/>
              <rect x="70" y="12" width="22" height="76" rx="3" stroke="#6366f1" stroke-width="2.5" fill="#eef2ff"/>
              <rect x="74" y="20" width="14" height="6" rx="1" fill="#a5b4fc"/>
              <rect x="74" y="30" width="14" height="6" rx="1" fill="#a5b4fc"/>
              <rect x="74" y="40" width="14" height="6" rx="1" fill="#a5b4fc"/>
              <rect x="74" y="50" width="14" height="6" rx="1" fill="#c7d2fe"/>
              <rect x="74" y="60" width="14" height="6" rx="1" fill="#c7d2fe"/>
              <text x="81" y="10" text-anchor="middle" fill="#6366f1" font-size="6" font-weight="700">R-123</text>
              <rect x="94" y="15" width="18" height="70" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f8fafc"/>
              <path d="M81 92 L81 88" stroke="#6366f1" stroke-width="2"/>
              <polygon points="76,92 86,92 81,97" fill="#6366f1"/>
            </svg>`,
          },
          {
            title: 'Open the rack',
            description: 'Enter access code 4591 on the rack\'s keypad lock. The lock indicator LED will turn green. Pull the handle to open the front door. Keep the door open during the procedure.',
            icon: 'lock-open',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="35" y="20" width="50" height="55" rx="6" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="43" y="35" width="12" height="10" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <rect x="59" y="35" width="12" height="10" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <rect x="43" y="49" width="12" height="10" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <rect x="59" y="49" width="12" height="10" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <text x="49" y="43" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">4</text>
              <text x="65" y="43" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">5</text>
              <text x="49" y="57" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">9</text>
              <text x="65" y="57" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">1</text>
              <circle cx="75" cy="28" r="4" fill="#22c55e"/>
              <path d="M73 28 l2 2 l3-4" stroke="white" stroke-width="1.5" fill="none"/>
            </svg>`,
          },
          {
            title: 'Locate device "backup-srv-07" at U32',
            description: 'Count rack units from the bottom. U32 is in the upper third of the rack. The server is labeled "backup-srv-07" on a pull-out tag on the left side. It\'s a 2U server with a dark gray bezel.',
            icon: 'search',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="30" y="8" width="60" height="84" rx="4" stroke="#cbd5e1" stroke-width="1.5" fill="white"/>
              <rect x="35" y="14" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="24" width="50" height="7" rx="1.5" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5"/>
              <text x="42" y="30" fill="#6366f1" font-size="5" font-weight="600">backup-srv-07</text>
              <rect x="35" y="34" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="44" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="54" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="64" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="74" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <text x="28" y="30" text-anchor="end" fill="#6366f1" font-size="5" font-weight="600">U32</text>
              <path d="M22 28 L30 28" stroke="#6366f1" stroke-width="1.5"/>
            </svg>`,
          },
          {
            title: 'Remove failed harddisk (Bay 3, top-left)',
            description: 'Put on your anti-static wrist strap and ground yourself. Locate Bay 3 at the top-left of the server\'s drive cage. Press the orange release latch and slide the caddy out gently. Place the failed drive in the anti-static bag.',
            icon: 'cylinder-split-slash',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="20" y="25" width="60" height="50" rx="4" stroke="#cbd5e1" stroke-width="1.5" fill="white"/>
              <rect x="26" y="31" width="22" height="16" rx="2" stroke="#ef4444" stroke-width="2" fill="#fef2f2" stroke-dasharray="4 2"/>
              <text x="37" y="42" text-anchor="middle" fill="#ef4444" font-size="6" font-weight="600">Bay 3</text>
              <rect x="52" y="31" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <rect x="26" y="52" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <rect x="52" y="52" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <path d="M37 35 L37 20 L95 20 L95 55" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4 2"/>
              <rect x="85" y="40" width="22" height="35" rx="3" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="89" y="46" width="14" height="3" rx="1" fill="#a5b4fc"/>
              <rect x="89" y="52" width="14" height="3" rx="1" fill="#a5b4fc"/>
              <circle cx="96" cy="67" r="4" stroke="#a5b4fc" stroke-width="1.5" fill="none"/>
              <circle cx="96" cy="67" r="1" fill="#a5b4fc"/>
            </svg>`,
          },
          {
            title: 'Install replacement harddisk',
            description: 'Take the new Seagate Exos X18 out of its packaging. Align the drive caddy with Bay 3 rails and slide it in firmly until it clicks into place. The activity LED should blink amber briefly, then turn solid green.',
            icon: 'cylinder-split',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="20" y="25" width="60" height="50" rx="4" stroke="#cbd5e1" stroke-width="1.5" fill="white"/>
              <rect x="26" y="31" width="22" height="16" rx="2" stroke="#22c55e" stroke-width="2" fill="#f0fdf4"/>
              <text x="37" y="42" text-anchor="middle" fill="#22c55e" font-size="6" font-weight="600">Bay 3</text>
              <rect x="52" y="31" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <rect x="26" y="52" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <rect x="52" y="52" width="22" height="16" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f1f5f9"/>
              <path d="M95 55 L95 20 L37 20 L37 31" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4 2"/>
              <polygon points="34,30 37,25 40,30" fill="#6366f1"/>
              <rect x="85" y="40" width="22" height="35" rx="3" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="89" y="46" width="14" height="3" rx="1" fill="#a5b4fc"/>
              <rect x="89" y="52" width="14" height="3" rx="1" fill="#a5b4fc"/>
              <circle cx="96" cy="67" r="4" stroke="#a5b4fc" stroke-width="1.5" fill="none"/>
              <circle cx="96" cy="67" r="1" fill="#a5b4fc"/>
              <circle cx="30" cy="29" r="3" fill="#22c55e"/>
            </svg>`,
          },
          {
            title: 'Verify & close up',
            description: 'Wait 30 seconds for the RAID controller to detect the new drive. The status LED on Bay 3 should be solid green. Check the server\'s front LCD panel — it should show "Rebuild in progress" or "Drive OK". Close and lock the rack door.',
            icon: 'check-mark-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="25" y="15" width="70" height="50" rx="6" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="32" y="22" width="56" height="30" rx="3" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <text x="60" y="34" text-anchor="middle" fill="#6366f1" font-size="5.5" font-weight="500">RAID Status</text>
              <rect x="40" y="39" width="40" height="6" rx="3" fill="#dcfce7"/>
              <rect x="40" y="39" width="32" height="6" rx="3" fill="#22c55e"/>
              <text x="60" y="44" text-anchor="middle" fill="white" font-size="4" font-weight="700">Rebuilding 80%</text>
              <circle cx="35" cy="72" r="5" fill="#22c55e"/>
              <path d="M33 72 l2 2 l3-4" stroke="white" stroke-width="1.5" fill="none"/>
              <text x="44" y="74" fill="#16a34a" font-size="5.5" font-weight="600">Drive OK — Bay 3</text>
              <rect x="25" y="80" width="70" height="8" rx="2" stroke="#cbd5e1" stroke-width="1" fill="#f8fafc"/>
              <rect x="29" y="82" width="4" height="4" rx="1" fill="#22c55e"/>
              <rect x="36" y="82" width="4" height="4" rx="1" fill="#22c55e"/>
              <rect x="43" y="82" width="4" height="4" rx="1" fill="#e2e8f0"/>
              <rect x="50" y="82" width="4" height="4" rx="1" fill="#e2e8f0"/>
            </svg>`,
          },
        ],
      },
      {
        title: 'Replace network switch',
        priority: 'high',
        location: `${DC_NAME} · Rack 87`,
        steps: [
          {
            title: 'Navigate to Rack 87',
            description: 'Head to Row 9 in Hall B. Rack 87 is on the right side of the aisle, the 2nd rack from the entrance. The label plate reads "R-087".',
            icon: 'info-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="10" y="20" width="100" height="60" rx="6" stroke="#e2e8f0" stroke-width="1.5" fill="#f8fafc"/>
              <rect x="18" y="28" width="30" height="44" rx="3" stroke="#cbd5e1" stroke-width="1" fill="white"/>
              <text x="33" y="42" text-anchor="middle" fill="#94a3b8" font-size="7" font-weight="600">Hall A</text>
              <rect x="56" y="28" width="30" height="44" rx="3" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <text x="71" y="42" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">Hall B</text>
              <line x1="62" y1="50" x2="62" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="68" y1="50" x2="68" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="74" y1="50" x2="74" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <circle cx="65" cy="55" r="4" fill="#6366f1"/>
              <circle cx="65" cy="55" r="2" fill="white"/>
              <text x="72" y="51" fill="#4f46e5" font-size="5">Row 9</text>
            </svg>`,
          },
          {
            title: 'Open rack & locate switch at U18',
            description: 'Enter code 7823 on the keypad. U18 holds a 1U Cisco switch labeled "sw-core-03". It has an amber status LED — this is the failed unit.',
            icon: 'lock-open',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="30" y="8" width="60" height="84" rx="4" stroke="#cbd5e1" stroke-width="1.5" fill="white"/>
              <rect x="35" y="14" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="24" width="50" height="7" rx="1.5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
              <text x="42" y="30" fill="#b45309" font-size="5" font-weight="600">sw-core-03 ⚠</text>
              <rect x="35" y="34" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="44" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <rect x="35" y="54" width="50" height="7" rx="1.5" fill="#f1f5f9"/>
              <text x="28" y="30" text-anchor="end" fill="#6366f1" font-size="5" font-weight="600">U18</text>
              <path d="M22 28 L30 28" stroke="#6366f1" stroke-width="1.5"/>
            </svg>`,
          },
          {
            title: 'Remove failed switch',
            description: 'Label all connected cables with the provided tags before disconnecting. Unscrew the rack ears (2 screws each side) and slide the switch forward. Place in the anti-static bag.',
            icon: 'cylinder-split-slash',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="20" y="35" width="60" height="14" rx="2" stroke="#ef4444" stroke-width="2" fill="#fef2f2" stroke-dasharray="4 2"/>
              <text x="50" y="45" text-anchor="middle" fill="#ef4444" font-size="6" font-weight="600">sw-core-03</text>
              <path d="M30 49 L30 62" stroke="#cbd5e1" stroke-width="2"/>
              <path d="M42 49 L42 62" stroke="#cbd5e1" stroke-width="2"/>
              <path d="M54 49 L54 62" stroke="#cbd5e1" stroke-width="2"/>
              <path d="M66 49 L66 62" stroke="#cbd5e1" stroke-width="2"/>
              <path d="M95 42 L85 42" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 2"/>
              <polygon points="87,39 82,42 87,45" fill="#6366f1"/>
            </svg>`,
          },
          {
            title: 'Install Cisco Catalyst 9200L',
            description: 'Slide the new switch into U18. Secure with rack ear screws. Re-connect cables in the order matching your labels. The switch will power on and run POST diagnostics.',
            icon: 'list',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="20" y="35" width="60" height="14" rx="2" stroke="#22c55e" stroke-width="2" fill="#f0fdf4"/>
              <text x="50" y="45" text-anchor="middle" fill="#16a34a" font-size="6" font-weight="600">Catalyst 9200L</text>
              <path d="M30 49 L30 62" stroke="#6366f1" stroke-width="2"/>
              <path d="M42 49 L42 62" stroke="#6366f1" stroke-width="2"/>
              <path d="M54 49 L54 62" stroke="#6366f1" stroke-width="2"/>
              <path d="M66 49 L66 62" stroke="#6366f1" stroke-width="2"/>
              <circle cx="30" cy="33" r="2" fill="#22c55e"/>
              <circle cx="42" cy="33" r="2" fill="#22c55e"/>
              <circle cx="54" cy="33" r="2" fill="#22c55e"/>
              <path d="M82 42 L92 42" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 2"/>
              <polygon points="90,39 95,42 90,45" fill="#6366f1"/>
            </svg>`,
          },
          {
            title: 'Verify connectivity & close rack',
            description: 'Wait 2 minutes for the switch to boot. All port LEDs should turn green. Confirm "sw-core-03" is back online on the NOC dashboard. Close and lock the rack.',
            icon: 'check-mark-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="25" y="15" width="70" height="50" rx="6" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="32" y="22" width="56" height="30" rx="3" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <text x="60" y="32" text-anchor="middle" fill="#6366f1" font-size="5.5" font-weight="500">NOC Dashboard</text>
              <circle cx="45" cy="43" r="4" fill="#22c55e"/>
              <path d="M43 43 l2 2 l3-4" stroke="white" stroke-width="1.5" fill="none"/>
              <text x="54" y="46" fill="#16a34a" font-size="5" font-weight="600">sw-core-03 online</text>
              <circle cx="35" cy="72" r="5" fill="#22c55e"/>
              <path d="M33 72 l2 2 l3-4" stroke="white" stroke-width="1.5" fill="none"/>
              <text x="44" y="74" fill="#16a34a" font-size="5.5" font-weight="600">All ports active</text>
            </svg>`,
          },
        ],
      },
      {
        title: 'Inspect PDU',
        priority: 'normal',
        location: `${DC_NAME} · Hall A`,
        steps: [
          {
            title: 'Navigate to PDU — Hall A, Row 3',
            description: 'Head to Hall A via the main corridor. The PDU is a vertical unit mounted on the right side of Rack 42, Row 3. It\'s labeled "PDU-A-042".',
            icon: 'info-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="10" y="20" width="100" height="60" rx="6" stroke="#e2e8f0" stroke-width="1.5" fill="#f8fafc"/>
              <rect x="18" y="28" width="30" height="44" rx="3" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <text x="33" y="42" text-anchor="middle" fill="#6366f1" font-size="7" font-weight="600">Hall A</text>
              <line x1="24" y1="50" x2="24" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="30" y1="50" x2="30" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="36" y1="50" x2="36" y2="68" stroke="#a5b4fc" stroke-width="1" stroke-dasharray="2 2"/>
              <circle cx="30" cy="58" r="4" fill="#6366f1"/>
              <circle cx="30" cy="58" r="2" fill="white"/>
              <text x="37" y="54" fill="#4f46e5" font-size="5">Row 3</text>
              <rect x="56" y="28" width="30" height="44" rx="3" stroke="#cbd5e1" stroke-width="1" fill="white"/>
              <text x="71" y="42" text-anchor="middle" fill="#94a3b8" font-size="7" font-weight="600">Hall B</text>
            </svg>`,
          },
          {
            title: 'Record power load readings',
            description: 'Use the multimeter to measure input voltage on all three phases. Expected: 220–240V each. Note any circuit above 80% capacity on the PDU\'s LCD display.',
            icon: 'exclamation-triangle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="40" y="10" width="40" height="55" rx="4" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <rect x="45" y="18" width="30" height="16" rx="2" fill="white" stroke="#a5b4fc" stroke-width="1"/>
              <text x="60" y="25" text-anchor="middle" fill="#6366f1" font-size="5" font-weight="600">PDU-A-042</text>
              <text x="60" y="31" text-anchor="middle" fill="#334155" font-size="5">231V  18.4A</text>
              <rect x="45" y="38" width="8" height="12" rx="1.5" fill="#22c55e"/>
              <rect x="56" y="38" width="8" height="12" rx="1.5" fill="#22c55e"/>
              <rect x="67" y="38" width="8" height="12" rx="1.5" fill="#f59e0b"/>
              <text x="49" y="48" text-anchor="middle" fill="white" font-size="4">L1</text>
              <text x="60" y="48" text-anchor="middle" fill="white" font-size="4">L2</text>
              <text x="71" y="48" text-anchor="middle" fill="white" font-size="4">L3</text>
              <circle cx="60" cy="76" r="10" stroke="#6366f1" stroke-width="2" fill="#f8fafc"/>
              <path d="M55 76 L59 72 L61 76 L65 70" stroke="#6366f1" stroke-width="1.5" fill="none"/>
            </svg>`,
          },
          {
            title: 'Inspect cable management & outlets',
            description: 'Check for loose cables, damaged outlets, or signs of heat stress (discolouration, melting). Verify all outlet covers are in place on unused ports. Note any anomalies.',
            icon: 'info-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="40" y="10" width="40" height="70" rx="4" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <circle cx="60" cy="28" r="8" stroke="#6366f1" stroke-width="1.5" fill="white"/>
              <rect x="57" y="24" width="2.5" height="5" rx="1" fill="#6366f1"/>
              <rect x="62" y="24" width="2.5" height="5" rx="1" fill="#6366f1"/>
              <circle cx="60" cy="28" r="1.5" fill="#6366f1"/>
              <circle cx="60" cy="48" r="8" stroke="#6366f1" stroke-width="1.5" fill="white"/>
              <rect x="57" y="44" width="2.5" height="5" rx="1" fill="#6366f1"/>
              <rect x="62" y="44" width="2.5" height="5" rx="1" fill="#6366f1"/>
              <circle cx="60" cy="48" r="1.5" fill="#6366f1"/>
              <circle cx="60" cy="67" r="8" stroke="#22c55e" stroke-width="1.5" fill="#f0fdf4"/>
              <path d="M57 67 l3 3 l4-5" stroke="#22c55e" stroke-width="1.5" fill="none"/>
            </svg>`,
          },
          {
            title: 'Document findings & close',
            description: 'Record all readings and observations. If any circuit is above 80% load or anomalies were found, flag the issue in the system before leaving.',
            icon: 'check-mark-circle',
            svg: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-40 w-full" aria-hidden="true">
              <rect x="35" y="10" width="50" height="65" rx="6" stroke="#6366f1" stroke-width="2" fill="#eef2ff"/>
              <path d="M55 16 h10 v4 a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2z" fill="#6366f1"/>
              <circle cx="60" cy="14" r="3" fill="#6366f1"/>
              <line x1="45" y1="34" x2="49" y2="38" stroke="#22c55e" stroke-width="1.5"/>
              <line x1="49" y1="38" x2="55" y2="30" stroke="#22c55e" stroke-width="1.5"/>
              <rect x="59" y="32" width="18" height="2.5" rx="1" fill="#a5b4fc"/>
              <line x1="45" y1="46" x2="49" y2="50" stroke="#22c55e" stroke-width="1.5"/>
              <line x1="49" y1="50" x2="55" y2="42" stroke="#22c55e" stroke-width="1.5"/>
              <rect x="59" y="44" width="14" height="2.5" rx="1" fill="#a5b4fc"/>
              <rect x="45" y="56" width="28" height="2.5" rx="1" fill="#c7d2fe"/>
              <rect x="45" y="62" width="20" height="2.5" rx="1" fill="#c7d2fe"/>
            </svg>`,
          },
        ],
      },
    ];

    // ── State ──
    type Phase = 'gather' | 'task';
    let phase: Phase = 'gather';
    let currentTaskIndex = 0;
    let currentStepIndex = 0;
    const checkedItems = new Set<number>();
    const completedTaskSteps = new Map<number, Set<number>>();
    let gatherCompleted = false;

    const totalSteps = 1 + tasks.reduce((s, t) => s + t.steps.length, 0);

    function getCompletedCount(): number {
      let n = gatherCompleted ? 1 : 0;
      completedTaskSteps.forEach(s => { n += s.size; });
      return n;
    }

    // ── DOM refs ──
    const timeline       = document.getElementById('wizardTimeline') as HTMLElement;
    const prevBtn        = document.getElementById('prevBtn') as HTMLElement;
    const doneBtn        = document.getElementById('doneBtn') as HTMLElement;
    const progressFill   = document.getElementById('progressFill') as HTMLElement;
    const progressLabel  = document.getElementById('progressLabel') as HTMLElement;
    const progressBar    = document.getElementById('progressBar') as HTMLElement;
    const bottomBar      = document.getElementById('bottomBar') as HTMLElement;
    const taskHeader     = document.getElementById('taskHeader') as HTMLElement;
    const completeScreen = document.getElementById('completeScreen') as HTMLElement;
    const photoModal     = document.getElementById('photoModal') as HTMLElement;
    const noteModal      = document.getElementById('noteModal') as HTMLElement;
    const photoStepLabel = document.getElementById('photoStepLabel') as HTMLElement;
    const noteStepLabel  = document.getElementById('noteStepLabel') as HTMLElement;
    const toast          = document.getElementById('toast') as HTMLElement;
    const toastText      = document.getElementById('toastText') as HTMLElement;
    const menuBtn        = document.getElementById('menuBtn') as HTMLElement;
    const menuDropdown   = document.getElementById('menuDropdown') as HTMLElement;
    const photoInput     = document.getElementById('photoInput') as HTMLInputElement;
    const photoPreview   = document.getElementById('photoPreview') as HTMLElement;
    const photoPreviewImg = document.getElementById('photoPreviewImg') as HTMLImageElement;
    const noteTextarea   = document.getElementById('noteTextarea') as HTMLTextAreaElement;

    // ── Helpers ──
    function priorityBadge(priority: Task['priority']): string {
      if (priority === 'critical') {
        return `<span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-200/80" aria-label="Priority: Critical"><span class="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></span>Critical</span>`;
      }
      if (priority === 'high') {
        return `<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200/80" aria-label="Priority: High"><span class="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>High</span>`;
      }
      return '';
    }

    function renderDescription(text: string): string {
      const lines = text.split('\n');
      let html = '';
      let listItems: string[] = [];
      function flushList(): void {
        if (listItems.length) {
          html += `<ul class="mt-1.5 list-disc pl-5 text-sm leading-relaxed text-slate-500 space-y-0.5">${listItems.map(t => `<li>${t}</li>`).join('')}</ul>`;
          listItems = [];
        }
      }
      lines.forEach(line => {
        if (line.startsWith('- ')) {
          listItems.push(line.slice(2));
        } else {
          flushList();
          if (line.trim()) html += `<p class="mt-1.5 text-sm leading-relaxed text-slate-500">${line}</p>`;
        }
      });
      flushList();
      return html;
    }

    function currentStepLabel(): string {
      if (phase === 'gather') return 'Gather tools & parts';
      const task = tasks[currentTaskIndex];
      return `${task.title} — Step ${currentStepIndex + 1}: ${task.steps[currentStepIndex].title}`;
    }

    // ── Render header ──
    function renderHeader(): void {
      if (phase === 'gather') {
        taskHeader.innerHTML = `
          <h1 class="text-xl font-semibold text-slate-900">${DC_NAME}</h1>
          <p class="mt-1.5 text-sm text-slate-400">${tasks.length} tasks &middot; Work order WO-2241</p>
        `;
      } else {
        const task = tasks[currentTaskIndex];
        taskHeader.innerHTML = `
          <h1 class="text-xl font-semibold text-slate-900">${task.title}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            ${priorityBadge(task.priority)}
            <span class="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700 ring-1 ring-accent-200/80" aria-label="Status: In progress"><span class="h-1.5 w-1.5 rounded-full bg-accent-500 shrink-0"></span>In Progress</span>
          </div>
          <p class="mt-1.5 text-sm text-slate-400">${task.location}</p>
        `;
      }
    }

    // ── Render progress ──
    function renderProgress(): void {
      const completed = getCompletedCount();
      const pct = (completed / totalSteps) * 100;
      progressFill.style.width = pct + '%';
      progressLabel.textContent = `${completed}/${totalSteps}`;
      progressBar.setAttribute('aria-valuenow', String(completed));
      progressBar.setAttribute('aria-valuemax', String(totalSteps));
      progressBar.setAttribute('aria-label', `Task progress: ${completed} of ${totalSteps} steps completed`);
    }

    // ── Render nav buttons ──
    function renderNavButtons(): void {
      prevBtn.toggleAttribute('disabled', phase === 'gather');
      const isLastTask = currentTaskIndex === tasks.length - 1;
      const isLastStep = phase === 'task' && currentStepIndex === tasks[currentTaskIndex].steps.length - 1;
      if (phase === 'task' && isLastTask && isLastStep) {
        doneBtn.setAttribute('text', 'Complete');
        doneBtn.setAttribute('end-icon', 'check-mark-circle');
        doneBtn.setAttribute('aria-label', 'Complete all tasks');
      } else {
        doneBtn.setAttribute('text', 'Done');
        doneBtn.setAttribute('end-icon', 'check-mark-small');
        doneBtn.setAttribute('aria-label', 'Mark step as done');
      }
    }

    // ── Main render ──
    function render(): void {
      renderHeader();
      renderProgress();
      renderNavButtons();

      let html = '';

      // ─ Gather row ─
      const isGatherActive = phase === 'gather';
      const gatherCircleCls = gatherCompleted
        ? 'bg-accent-600 text-white'
        : isGatherActive
          ? 'border-2 border-accent-600 bg-white font-semibold text-accent-600 text-sm'
          : 'border-2 border-slate-300 bg-white text-sm font-medium text-slate-400';
      const gatherCircleContent = gatherCompleted
        ? '<nldd-icon name="check-mark" class="w-3.5 h-3.5" aria-hidden="true"></nldd-icon>'
        : '1';
      const gatherLineColor = gatherCompleted ? 'bg-accent-300' : 'bg-slate-200';
      const gatherOpacity = isGatherActive ? 'opacity-100' : 'opacity-50';
      const gatherCardCls = isGatherActive
        ? 'rounded-xl bg-white p-4 shadow-sm outline outline-2 outline-accent-500 outline-offset-0'
        : 'py-2';

      let checklistHtml = '';
      if (isGatherActive) {
        const checkedCount = checkedItems.size;
        checklistHtml = `
          <p class="mt-1.5 text-sm leading-relaxed text-slate-500">Collect all items from the supply room before heading to the floor.</p>
          <div class="mt-3 space-y-1" role="list" aria-label="Items to gather">
            ${gatherItems.map((item, i) => {
              const checked = checkedItems.has(i);
              return `
                <div class="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50" data-gather-row="${i}" role="listitem">
                  <nldd-checkbox ${checked ? 'checked' : ''} accessible-label="${item.label}" data-gather-item="${i}"></nldd-checkbox>
                  <div class="select-none" aria-hidden="true">
                    <span class="text-sm ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}">${item.label}</span>
                    ${item.taskFor ? `<p class="text-xs text-slate-400 mt-0.5">for: ${item.taskFor}</p>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ${checkedCount > 0 ? `<p class="mt-2 text-xs text-slate-400">${checkedCount} of ${gatherItems.length} collected</p>` : ''}
        `;
      }

      html += `
        <div class="relative flex gap-4 ${gatherOpacity}" ${isGatherActive ? 'aria-current="step"' : ''}>
          <div class="flex flex-col items-center">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${gatherCircleCls}" aria-hidden="true">${gatherCircleContent}</div>
            <div class="my-1 w-0.5 flex-1 ${gatherLineColor}"></div>
          </div>
          <div class="flex-1 ${gatherCardCls} pb-8">
            <div class="flex items-center gap-2">
              <nldd-icon name="inbox" style="width:20px;height:20px;" class="${isGatherActive ? 'text-accent-600' : gatherCompleted ? 'text-accent-400' : 'text-slate-400'}" aria-hidden="true"></nldd-icon>
              <h3 class="text-sm font-semibold ${isGatherActive ? 'text-slate-900' : 'text-slate-700'}">Gather tools &amp; parts</h3>
            </div>
            ${checklistHtml}
          </div>
        </div>
      `;

      // ─ Task rows ─
      tasks.forEach((task, taskIdx) => {
        const isActive = phase === 'task' && currentTaskIndex === taskIdx;
        const completedSet = completedTaskSteps.get(taskIdx);
        const isDone = (completedSet?.size ?? 0) === task.steps.length && task.steps.length > 0;
        const isLast = taskIdx === tasks.length - 1;

        const circleNum = taskIdx + 2;
        const circleCls = isDone
          ? 'bg-accent-600 text-white'
          : isActive
            ? 'border-2 border-accent-600 bg-white font-semibold text-accent-600 text-sm'
            : 'border-2 border-slate-300 bg-white text-sm font-medium text-slate-400';
        const circleContent = isDone
          ? '<nldd-icon name="check-mark" class="w-3.5 h-3.5" aria-hidden="true"></nldd-icon>'
          : String(circleNum);
        const lineColor = isDone ? 'bg-accent-300' : 'bg-slate-200';
        const rowOpacity = isActive ? 'opacity-100' : isDone ? 'opacity-60' : 'opacity-40';

        // Step sub-items (only when this task is active)
        let subStepsHtml = '';
        if (isActive) {
          subStepsHtml = task.steps.map((step, si) => {
            const stepDone = completedSet?.has(si) ?? false;
            const stepActive = si === currentStepIndex;
            const isLastStep = si === task.steps.length - 1;

            const sCircleCls = stepDone
              ? 'bg-accent-600 text-white'
              : stepActive
                ? 'border-2 border-accent-600 bg-white font-semibold text-accent-600 text-xs'
                : 'border-2 border-slate-200 bg-white text-xs font-medium text-slate-400';
            const sCircleContent = stepDone
              ? '<nldd-icon name="check-mark" style="width:10px;height:10px;" aria-hidden="true"></nldd-icon>'
              : String(si + 1);
            const sLineColor = stepDone ? 'bg-accent-300' : 'bg-slate-200';
            const sOpacity = stepActive ? 'opacity-100' : 'opacity-50';
            const sCardCls = stepActive
              ? 'rounded-xl bg-white p-4 shadow-sm outline outline-2 outline-accent-500 outline-offset-0 mb-4'
              : 'py-1.5';

            let interactiveAttr = '';
            let cursorCls = '';
            if (stepDone) {
              interactiveAttr = `role="button" tabindex="0" data-task="${taskIdx}" data-step="${si}" aria-label="Step ${si + 1}: ${step.title} — Completed. Tap to revisit"`;
              cursorCls = 'cursor-pointer hover:opacity-70';
            }

            return `
              <div class="relative flex gap-3 ${sOpacity} ${cursorCls} transition-opacity" ${interactiveAttr} ${stepActive ? 'aria-current="step"' : ''}>
                <div class="flex flex-col items-center">
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${sCircleCls}" aria-hidden="true">${sCircleContent}</div>
                  ${!isLastStep ? `<div class="my-1 w-0.5 flex-1 ${sLineColor}"></div>` : ''}
                </div>
                <div class="flex-1 ${sCardCls} pb-4">
                  <div class="flex items-center gap-2">
                    <nldd-icon name="${step.icon}" style="width:18px;height:18px;" class="${stepActive ? 'text-accent-600' : stepDone ? 'text-accent-400' : 'text-slate-400'}" aria-hidden="true"></nldd-icon>
                    <h3 class="text-sm font-medium ${stepActive ? 'text-slate-900' : 'text-slate-600'}">${step.title}</h3>
                  </div>
                  ${stepActive ? renderDescription(step.description) : ''}
                  ${stepActive ? `<div class="mt-3">${step.svg}</div>` : ''}
                </div>
              </div>
            `;
          }).join('');
        }

        html += `
          <div class="relative flex gap-4 ${rowOpacity} transition-opacity">
            <div class="flex flex-col items-center">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${circleCls}" aria-hidden="true">${circleContent}</div>
              ${!isLast ? `<div class="my-1 w-0.5 flex-1 ${lineColor}"></div>` : ''}
            </div>
            <div class="flex-1 pb-2">
              <div class="py-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-semibold ${isActive ? 'text-slate-900' : isDone ? 'text-slate-500' : 'text-slate-600'}">${task.title}</span>
                  ${priorityBadge(task.priority)}
                </div>
                <p class="text-xs text-slate-400 mt-0.5">${task.location}</p>
              </div>
              ${subStepsHtml ? `<div class="mt-1">${subStepsHtml}</div>` : ''}
            </div>
          </div>
        `;
      });

      timeline.innerHTML = html;

      // Gather item handlers
      if (phase === 'gather') {
        timeline.querySelectorAll('[data-gather-row]').forEach(el => {
          el.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('nldd-checkbox')) {
              (el.querySelector('nldd-checkbox') as any)?.toggle();
            }
          });
        });
        timeline.querySelectorAll('[data-gather-item]').forEach(el => {
          el.addEventListener('change', (e: Event) => {
            const idx = parseInt((el as HTMLElement).dataset['gatherItem']!);
            if ((e as CustomEvent).detail.checked) checkedItems.add(idx);
            else checkedItems.delete(idx);
            render();
          });
        });
      }

      // Step jump handlers (completed steps)
      timeline.querySelectorAll('[data-step]').forEach(el => {
        const taskIdx = parseInt((el as HTMLElement).dataset['task']!);
        const stepIdx = parseInt((el as HTMLElement).dataset['step']!);
        el.addEventListener('click', () => jumpToStep(taskIdx, stepIdx));
        el.addEventListener('keydown', (e: Event) => {
          const key = (e as KeyboardEvent).key;
          if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            jumpToStep(taskIdx, stepIdx);
          }
        });
      });
    }

    function scrollToCurrentStep(): void {
      setTimeout(() => {
        const el = timeline.querySelector('[aria-current="step"]');
        if (!el) return;
        const nav = document.querySelector('nav') as HTMLElement;
        const topOffset = nav.offsetHeight + 16;
        const targetY = el.getBoundingClientRect().top + window.scrollY - topOffset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }, 50);
    }

    function jumpToStep(taskIdx: number, stepIdx: number): void {
      phase = 'task';
      currentTaskIndex = taskIdx;
      currentStepIndex = stepIdx;
      render();
      scrollToCurrentStep();
    }

    // ── Done button ──
    doneBtn.addEventListener('click', () => {
      if (phase === 'gather') {
        if (checkedItems.size < gatherItems.length) {
          showToast(`${checkedItems.size}/${gatherItems.length} items checked — proceeding`);
        }
        gatherCompleted = true;
        phase = 'task';
        currentTaskIndex = 0;
        currentStepIndex = 0;
        render();
        scrollToCurrentStep();
        return;
      }

      if (!completedTaskSteps.has(currentTaskIndex)) {
        completedTaskSteps.set(currentTaskIndex, new Set());
      }
      completedTaskSteps.get(currentTaskIndex)!.add(currentStepIndex);

      const task = tasks[currentTaskIndex];
      if (currentStepIndex < task.steps.length - 1) {
        currentStepIndex++;
        render();
        scrollToCurrentStep();
      } else if (currentTaskIndex < tasks.length - 1) {
        currentTaskIndex++;
        currentStepIndex = 0;
        render();
        scrollToCurrentStep();
      } else {
        timeline.classList.add('hidden');
        taskHeader.classList.add('hidden');
        bottomBar.classList.add('hidden');
        completeScreen.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // ── Previous button ──
    prevBtn.addEventListener('click', () => {
      if (phase === 'gather') return;
      if (currentStepIndex > 0) {
        currentStepIndex--;
      } else if (currentTaskIndex > 0) {
        currentTaskIndex--;
        currentStepIndex = tasks[currentTaskIndex].steps.length - 1;
      } else {
        phase = 'gather';
      }
      render();
      scrollToCurrentStep();
    });

    // ── Menu ──
    menuBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      menuDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => menuDropdown.classList.add('hidden'));

    // ── Photo modal ──
    (document.getElementById('photoBtn') as HTMLElement).addEventListener('click', () => {
      photoStepLabel.textContent = currentStepLabel();
      photoPreview.classList.add('hidden');
      photoInput.value = '';
      photoModal.classList.remove('hidden');
      photoModal.classList.add('flex');
    });

    photoInput.addEventListener('change', (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          photoPreviewImg.src = ev.target!.result as string;
          photoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    (document.getElementById('photoCancelBtn') as HTMLElement).addEventListener('click', () => {
      photoModal.classList.add('hidden');
      photoModal.classList.remove('flex');
    });

    (document.getElementById('photoSaveBtn') as HTMLElement).addEventListener('click', () => {
      photoModal.classList.add('hidden');
      photoModal.classList.remove('flex');
      showToast('Photo saved');
    });

    // ── Notes modal ──
    (document.getElementById('noteBtn') as HTMLElement).addEventListener('click', () => {
      noteStepLabel.textContent = currentStepLabel();
      noteTextarea.value = '';
      noteModal.classList.remove('hidden');
      noteModal.classList.add('flex');
      setTimeout(() => noteTextarea.focus(), 100);
    });

    (document.getElementById('noteCancelBtn') as HTMLElement).addEventListener('click', () => {
      noteModal.classList.add('hidden');
      noteModal.classList.remove('flex');
    });

    (document.getElementById('noteSaveBtn') as HTMLElement).addEventListener('click', () => {
      noteModal.classList.add('hidden');
      noteModal.classList.remove('flex');
      showToast('Note saved');
    });

    [photoModal, noteModal].forEach(modal => {
      modal.addEventListener('click', (e: Event) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        [photoModal, noteModal].forEach(m => {
          m.classList.add('hidden');
          m.classList.remove('flex');
        });
        menuDropdown.classList.add('hidden');
      }
    });

    // ── Toast ──
    let toastTimeout: number | undefined;
    function showToast(msg: string): void {
      toastText.textContent = msg;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, 2500);
    }

    // ── Init ──
    render();
  }
}
