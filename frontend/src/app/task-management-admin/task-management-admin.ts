import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

interface Technician {
  id: number;
  name: string;
  initials: string;
  color: string;
  available: boolean;
}

interface Note {
  author: number | null;
  text: string;
  time: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  assignee: number | null;
  due: string;
  created: string;
  notes: Note[];
}

interface StatusStyle {
  bg: string;
  text: string;
  dot: string;
  kanbanAccent: string;
  kanbanBorder: string;
}

interface PriorityStyle {
  bg: string;
  text: string;
  dot: string;
  ring: string;
}

@Component({
  selector: 'app-task-management-admin',
  templateUrl: './task-management-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'flex flex-col bg-white text-slate-900' },
})
export default class TaskManagementAdminComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // ── Technicians ──
    const technicians: Technician[] = [
      { id: 1, name: 'Jan de Vries', initials: 'JV', color: 'bg-blue-600', available: true },
      { id: 2, name: 'Sara Ahmed', initials: 'SA', color: 'bg-emerald-600', available: true },
      { id: 3, name: 'Thomas Bakker', initials: 'TB', color: 'bg-amber-600', available: false },
      { id: 4, name: 'Lisa Chen', initials: 'LC', color: 'bg-violet-600', available: true },
      { id: 5, name: 'Mark Jansen', initials: 'MJ', color: 'bg-rose-600', available: true },
    ];

    // ── Tasks ──
    const tasks: Task[] = [
      {
        id: 1,
        title: 'Replace broken harddisk',
        description:
          'Failed disk in Bay 3 of backup-srv-07 at Rack 123. Replace with Seagate Exos X18 (ST16000NM000J, 16 TB). The RAID controller shows the drive as failed since yesterday evening.',
        status: 'In Progress',
        priority: 'Critical',
        category: 'Hardware',
        location: 'DC Amsterdam-West · Rack 123',
        assignee: 1,
        due: '2026-03-20',
        created: '2026-03-15',
        notes: [
          {
            author: 1,
            text: 'Arrived at rack. Disk bay 3 LED is solid red. Starting replacement procedure.',
            time: '2 hours ago',
          },
          {
            author: null,
            text: 'Spare disk is available in storage room B, shelf 3. Serial: ZLR1N5JY.',
            time: '5 hours ago',
          },
        ],
      },
      {
        id: 2,
        title: 'Check cooling unit — Row 5',
        description:
          'Temperature sensors in Row 5 are reporting 2°C above normal baseline. Inspect the cooling unit for potential blockage or fan failure.',
        status: 'Ready',
        priority: 'High',
        category: 'Cooling',
        location: 'DC Amsterdam-West · Hall A, Row 5',
        assignee: null,
        due: '2026-03-21',
        created: '2026-03-17',
        notes: [
          {
            author: null,
            text: 'Monitoring dashboard shows temps rising over the past 48h. Not yet critical but trending up.',
            time: '1 day ago',
          },
        ],
      },
      {
        id: 3,
        title: 'Inspect PDU — Hall A',
        description:
          'Routine quarterly inspection of the PDU in Hall A. Check all breakers, verify load balancing, and ensure no burnt contacts.',
        status: 'Ready',
        priority: 'Medium',
        category: 'Power',
        location: 'DC Amsterdam-West · Hall A',
        assignee: 2,
        due: '2026-03-25',
        created: '2026-03-16',
        notes: [],
      },
      {
        id: 4,
        title: 'Replace network switch — Rack 87',
        description:
          'The Cisco Nexus switch in Rack 87 has intermittent port failures on ports 24-28. Replace with the new Arista unit from stock.',
        status: 'In Progress',
        priority: 'High',
        category: 'Network',
        location: 'DC Amsterdam-West · Rack 87',
        assignee: 4,
        due: '2026-03-19',
        created: '2026-03-14',
        notes: [
          {
            author: 4,
            text: 'Migration window confirmed with NOC for tonight 22:00–02:00. Pre-staging the replacement switch now.',
            time: '3 hours ago',
          },
          {
            author: null,
            text: 'NOC has been notified. Maintenance window approved.',
            time: '1 day ago',
          },
        ],
      },
      {
        id: 5,
        title: 'Firmware update — UPS units Hall B',
        description:
          'Apply firmware v4.2.1 to all three Eaton UPS units in Hall B. Requires sequential update — do not update all at once.',
        status: 'Review',
        priority: 'Medium',
        category: 'Power',
        location: 'DC Amsterdam-West · Hall B',
        assignee: 3,
        due: '2026-03-22',
        created: '2026-03-13',
        notes: [
          {
            author: 3,
            text: 'UPS-1 and UPS-2 updated successfully. UPS-3 scheduled for tomorrow morning. All readings normal after update.',
            time: '6 hours ago',
          },
        ],
      },
      {
        id: 6,
        title: 'Install additional cameras — Entrance B',
        description:
          'Mount two new security cameras at Entrance B as per the security audit recommendations. Cabling is already in place.',
        status: 'Blocked',
        priority: 'Low',
        category: 'Security',
        location: 'DC Amsterdam-West · Entrance B',
        assignee: 5,
        due: '2026-03-28',
        created: '2026-03-10',
        notes: [
          {
            author: 5,
            text: 'Cameras arrived but mounting brackets are the wrong model. Waiting for replacement brackets from supplier.',
            time: '2 days ago',
          },
          { author: null, text: 'Supplier confirmed new brackets ship Monday.', time: '1 day ago' },
        ],
      },
      {
        id: 7,
        title: 'Decommission server DB-14',
        description:
          'Server DB-14 in Rack 45 has been migrated to new hardware. Wipe disks, remove from rack, and update asset inventory.',
        status: 'Done',
        priority: 'Low',
        category: 'Hardware',
        location: 'DC Amsterdam-West · Rack 45',
        assignee: 1,
        due: '2026-03-17',
        created: '2026-03-08',
        notes: [
          {
            author: 1,
            text: 'Disks wiped with DBAN (3-pass). Server removed from rack and placed in decommission staging. Asset inventory updated.',
            time: '1 day ago',
          },
        ],
      },
      {
        id: 8,
        title: 'Repair cable management — Rack 92',
        description:
          'Cables in Rack 92 are obstructing airflow. Re-route and zip-tie all patch cables. Replace any damaged cables.',
        status: 'In Progress',
        priority: 'Medium',
        category: 'Hardware',
        location: 'DC Amsterdam-West · Rack 92',
        assignee: 2,
        due: '2026-03-23',
        created: '2026-03-16',
        notes: [],
      },
    ];

    // ── Style maps ──
    const statusStyles: Record<string, StatusStyle> = {
      Ready: {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        kanbanAccent: 'bg-slate-400',
        kanbanBorder: 'border-slate-200',
      },
      'In Progress': {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
        kanbanAccent: 'bg-indigo-500',
        kanbanBorder: 'border-indigo-200',
      },
      Review: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        kanbanAccent: 'bg-amber-500',
        kanbanBorder: 'border-amber-200',
      },
      Blocked: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
        kanbanAccent: 'bg-red-500',
        kanbanBorder: 'border-red-200',
      },
      Done: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        kanbanAccent: 'bg-emerald-500',
        kanbanBorder: 'border-emerald-200',
      },
    };

    const priorityStyles: Record<string, PriorityStyle> = {
      Critical: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
        ring: 'ring-red-200/80',
      },
      High: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
        ring: 'ring-orange-200/80',
      },
      Medium: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        dot: 'bg-yellow-400',
        ring: 'ring-yellow-200/80',
      },
      Low: {
        bg: 'bg-slate-100',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
        ring: 'ring-slate-200/80',
      },
    };

    const categoryIcons: Record<string, string> = {
      Hardware: 'cylinder-split',
      Network: 'list',
      Cooling: 'cloud',
      Power: 'lock-closed',
      Security: 'shield-check-mark',
      Other: 'ellipsis',
    };

    const kanbanColumns = ['Ready', 'In Progress', 'Review', 'Blocked', 'Done'];

    // ── State ──
    let currentView = 'list';
    const selectedTasks = new Set<number>();
    let editingTaskId: number | null = null;
    let toastTimeout: number | undefined;

    // ── DOM refs ──
    const taskListEl = document.getElementById('taskList') as HTMLElement;
    const kanbanBoard = document.getElementById('kanbanBoard') as HTMLElement;
    const listView = document.getElementById('listView') as HTMLElement;
    const kanbanView = document.getElementById('kanbanView') as HTMLElement;
    const viewToggle = document.getElementById('viewToggle') as HTMLElement;
    const selectAllCb = document.getElementById('selectAll') as HTMLElement;
    const bulkBar = document.getElementById('bulkBar') as HTMLElement;
    const bulkCount = document.getElementById('bulkCount') as HTMLElement;
    const detailSheet = document.getElementById('detailSheet') as HTMLElement & {
      show(): void;
      hide(): void;
      dataset: DOMStringMap;
    };
    const editModal = document.getElementById('editModal') as HTMLElement;
    const toastEl = document.getElementById('toast') as HTMLElement;
    const toastText = document.getElementById('toastText') as HTMLElement;

    // ── Helpers ──
    function getTech(id: number | null): Technician | null {
      return technicians.find((t) => t.id === id) ?? null;
    }

    function formatDate(str: string | null): string {
      if (!str) return '—';
      const d = new Date(`${str}T00:00:00`);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function statusBadge(status: string): string {
      const s = statusStyles[status] ?? statusStyles['Ready'];
      return `<span class="inline-flex items-center gap-1.5 rounded-full ${s.bg} px-2.5 py-0.5 text-xs font-medium ${s.text}"><span class="h-1.5 w-1.5 rounded-full ${s.dot} shrink-0"></span>${status}</span>`;
    }

    function priorityBadge(priority: string): string {
      const p = priorityStyles[priority] ?? priorityStyles['Medium'];
      return `<span class="inline-flex items-center gap-1.5 text-xs font-medium ${p.text}"><span class="h-2 w-2 rounded-full ${p.dot} shrink-0"></span>${priority}</span>`;
    }

    function avatarHTML(tech: Technician | null, size = 'h-7 w-7 text-xs'): string {
      if (!tech)
        return `<span class="inline-flex ${size} items-center justify-center rounded-full bg-slate-200 text-slate-500 font-medium shrink-0"><nldd-icon name="person" class="w-3 h-3"></nldd-icon></span>`;
      return `<span class="inline-flex ${size} items-center justify-center rounded-full ${tech.color} text-white font-semibold shrink-0" title="${tech.name}">${tech.initials}</span>`;
    }

    function showToast(msg: string): void {
      toastText.textContent = msg;
      toastEl.classList.remove('opacity-0');
      toastEl.classList.add('opacity-100');
      clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => {
        toastEl.classList.remove('opacity-100');
        toastEl.classList.add('opacity-0');
      }, 2000);
    }

    function openModal(modal: HTMLElement): void {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modal: HTMLElement): void {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }

    function updateBulkBar(): void {
      if (selectedTasks.size > 0) {
        bulkBar.classList.remove('hidden');
        bulkBar.classList.add('flex');
        bulkCount.textContent = `${selectedTasks.size} selected`;
      } else {
        bulkBar.classList.add('hidden');
        bulkBar.classList.remove('flex');
      }
    }

    function openEditModal(taskId: number | null): void {
      editingTaskId = taskId;
      const task = taskId !== null ? tasks.find((t) => t.id === taskId) : null;

      (document.getElementById('editModalTitle') as HTMLElement).textContent = task
        ? 'Edit task'
        : 'New task';
      (document.getElementById('editTitle') as HTMLInputElement).value = task ? task.title : '';
      (document.getElementById('editDescription') as HTMLTextAreaElement).value = task
        ? task.description
        : '';
      (document.getElementById('editStatus') as HTMLSelectElement).value = task
        ? task.status
        : 'Ready';
      (document.getElementById('editPriority') as HTMLSelectElement).value = task
        ? task.priority
        : 'Medium';
      (document.getElementById('editCategory') as HTMLSelectElement).value = task
        ? task.category
        : 'Hardware';
      (document.getElementById('editDue') as HTMLInputElement).value = task ? task.due : '';
      (document.getElementById('editLocation') as HTMLInputElement).value = task
        ? task.location
        : '';

      const assigneeContainer = document.querySelector('#assigneeSelector .grid') as HTMLElement;
      let aHTML = `
        <label class="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50 has-checked:ring-2 has-checked:ring-indigo-500 has-checked:border-transparent transition-colors">
          <input type="radio" name="assignee" value="" class="h-4 w-4 rounded-full border-2 border-slate-300" ${!task || !task.assignee ? 'checked' : ''} />
          <div class="flex items-center gap-2.5">
            ${avatarHTML(null, 'h-8 w-8 text-sm')}
            <span class="text-sm font-medium text-slate-500">Unassigned</span>
          </div>
        </label>
      `;
      technicians.forEach((t) => {
        aHTML += `
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50 has-checked:ring-2 has-checked:ring-indigo-500 has-checked:border-transparent transition-colors">
            <input type="radio" name="assignee" value="${t.id}" class="h-4 w-4 rounded-full border-2 border-slate-300" ${task && task.assignee === t.id ? 'checked' : ''} />
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              ${avatarHTML(t, 'h-8 w-8 text-sm')}
              <div class="flex-1 min-w-0">
                <span class="text-sm font-medium text-slate-700">${t.name}</span>
                <span class="ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${t.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}">${t.available ? 'Available' : 'Busy'}</span>
              </div>
            </div>
          </label>
        `;
      });
      assigneeContainer.innerHTML = aHTML;
      openModal(editModal);
    }

    function openDetail(id: number): void {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      (document.getElementById('detailTitle') as HTMLElement).textContent = task.title;
      (document.getElementById('detailDescription') as HTMLElement).textContent = task.description;
      (document.getElementById('detailLocation') as HTMLElement).textContent = task.location;
      (document.getElementById('detailDue') as HTMLElement).textContent = formatDate(task.due);
      (document.getElementById('detailCreated') as HTMLElement).textContent = formatDate(
        task.created,
      );

      const tech = getTech(task.assignee);
      (document.getElementById('detailAssignee') as HTMLElement).innerHTML = tech
        ? `${avatarHTML(tech, 'h-7 w-7 text-xs')} <span>${tech.name}</span>`
        : `${avatarHTML(null, 'h-7 w-7 text-xs')} <span class="text-slate-400 font-normal">Unassigned</span>`;

      const ss = statusStyles[task.status];
      const statusEl = document.getElementById('detailStatus') as HTMLElement;
      statusEl.className = `inline-flex items-center gap-1.5 rounded-full ${ss.bg} px-2.5 py-0.5 text-xs font-medium ${ss.text}`;
      statusEl.innerHTML = `<span class="h-1.5 w-1.5 rounded-full ${ss.dot}"></span>${task.status}`;

      const ps = priorityStyles[task.priority];
      const priorityEl = document.getElementById('detailPriority') as HTMLElement;
      priorityEl.className = `inline-flex items-center gap-1.5 rounded-full ${ps.bg} px-2.5 py-0.5 text-xs font-medium ${ps.text} ring-1 ${ps.ring}`;
      priorityEl.innerHTML = `<span class="h-1.5 w-1.5 rounded-full ${ps.dot}"></span>${task.priority}`;

      (document.getElementById('detailCategory') as HTMLElement).innerHTML =
        `<nldd-icon name="${categoryIcons[task.category] ?? 'ellipsis'}" class="w-3.5 h-3.5"></nldd-icon> ${task.category}`;

      // Notes
      (document.getElementById('detailNoteCount') as HTMLElement).textContent =
        `(${task.notes.length})`;
      let notesHTML = '';
      task.notes.forEach((note) => {
        const author = note.author !== null ? getTech(note.author) : null;
        const authorName = author ? author.name : 'Admin';
        const avatar = author
          ? avatarHTML(author, 'h-7 w-7 text-xs')
          : `<span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold shrink-0 select-none">A</span>`;
        notesHTML += `
          <div class="flex gap-3">
            <div class="shrink-0 pt-0.5">${avatar}</div>
            <div class="flex-1 rounded-xl bg-slate-50 px-3.5 py-3">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-xs font-semibold text-slate-700">${authorName}</span>
                <span class="text-xs text-slate-400 shrink-0">${note.time}</span>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">${note.text}</p>
            </div>
          </div>
        `;
      });
      if (task.notes.length === 0) {
        notesHTML = `<p class="text-sm text-slate-400 text-center py-4">No notes yet</p>`;
      }
      (document.getElementById('detailNotes') as HTMLElement).innerHTML = notesHTML;

      (document.getElementById('detailEditBtn') as HTMLElement).onclick = () => {
        detailSheet.hide();
        openEditModal(task.id);
      };
      detailSheet.dataset['taskId'] = String(id);
      detailSheet.show();
    }

    function addNote(): void {
      const input = document.getElementById('newNoteInput') as HTMLInputElement;
      const text = (input.value ?? '').trim();
      if (!text) return;
      const taskId = parseInt(detailSheet.dataset['taskId']!, 10);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      task.notes.unshift({ author: null, text, time: 'Just now' });
      input.value = '';
      openDetail(taskId);
      showToast('Note added');
    }

    // ── Render List View ──
    function renderList(): void {
      let html = '';
      tasks.forEach((task) => {
        const tech = getTech(task.assignee);
        const isSelected = selectedTasks.has(task.id);
        const icon = categoryIcons[task.category] ?? 'ellipsis';
        const taskId = `T-${2890 + task.id}`;
        html += `
          <tr class="border-b border-slate-100 transition-colors hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-indigo-50/60' : ''}" data-open="${task.id}">
            <td class="w-10 px-3 py-3" data-no-open>
              <nldd-checkbox class="task-cb" accessible-label="Select task ${taskId}" data-id="${task.id}" ${isSelected ? 'checked' : ''}></nldd-checkbox>
            </td>
            <td class="w-20 px-2 py-3">
              <span class="font-mono text-xs text-slate-400">${taskId}</span>
            </td>
            <td class="min-w-0 px-2 py-3">
              <p class="text-sm font-medium text-slate-900 leading-snug truncate max-w-xs">${task.title}</p>
              <p class="mt-0.5 text-xs text-slate-400 truncate flex items-center gap-1">
                <nldd-icon name="apartment-building" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></nldd-icon>${task.location}
              </p>
            </td>
            <td class="w-32 px-2 py-3">${statusBadge(task.status)}</td>
            <td class="w-24 px-2 py-3">${priorityBadge(task.priority)}</td>
            <td class="w-28 px-2 py-3">
              <span class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <nldd-icon name="${icon}" style="width:14px;height:14px;color:#94a3b8;display:inline-block;vertical-align:middle;"></nldd-icon>${task.category}
              </span>
            </td>
            <td class="w-12 px-2 py-3 text-center">${avatarHTML(tech, 'h-7 w-7 text-xs')}</td>
            <td class="w-28 px-2 py-3 text-xs text-slate-500">
              ${task.due ? formatDate(task.due) : '<span class="text-slate-300">—</span>'}
            </td>
          </tr>
        `;
      });
      taskListEl.innerHTML = html;
      (document.getElementById('taskCount') as HTMLElement).textContent =
        `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

      taskListEl.querySelectorAll('tr[data-open]').forEach((el) => {
        el.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).closest('[data-no-open]')) return;
          openDetail(parseInt((el as HTMLElement).dataset['open']!, 10));
        });
      });
      taskListEl.querySelectorAll('.task-cb').forEach((cb) => {
        cb.addEventListener('change', (e) => {
          e.stopPropagation();
          const el = cb as HTMLElement;
          const id = parseInt(el.dataset['id']!, 10);
          if ((e as CustomEvent).detail.checked) selectedTasks.add(id);
          else selectedTasks.delete(id);
          updateBulkBar();
          renderList();
        });
      });
    }

    // ── Render Kanban View ──
    function renderKanban(): void {
      let html = '';
      kanbanColumns.forEach((col) => {
        const s = statusStyles[col];
        const colTasks = tasks.filter((t) => t.status === col);
        html += `
          <div class="shrink-0 w-72 snap-center">
            <div class="mb-3 flex items-center gap-2">
              <span class="h-2 w-2 rounded-full ${s.dot}"></span>
              <h3 class="text-sm font-semibold text-slate-700">${col}</h3>
              <span class="ml-auto inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">${colTasks.length}</span>
            </div>
            <div class="space-y-2">
        `;
        colTasks.forEach((task) => {
          const tech = getTech(task.assignee);
          const icon = categoryIcons[task.category] ?? 'ti-dots';
          html += `
            <div class="cursor-pointer rounded-xl border ${s.kanbanBorder} bg-white p-3.5 hover:shadow-md hover:shadow-slate-200/80 transition-shadow" data-open="${task.id}">
              <h4 class="text-sm font-medium text-slate-900 leading-snug">${task.title}</h4>
              <div class="mt-2 flex items-center gap-1.5">
                ${priorityBadge(task.priority)}
                <span class="inline-flex items-center gap-1 text-xs text-slate-400">
                  <nldd-icon name="${icon}" style="width:13px;height:13px;"></nldd-icon>${task.category}
                </span>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <span class="inline-flex items-center gap-1 text-xs text-slate-400 truncate max-w-[60%]">
                  <nldd-icon name="apartment-building" style="width:11px;height:11px;"></nldd-icon>${task.location.split('·')[1]?.trim() ?? task.location}
                </span>
                <div class="flex items-center gap-2">
                  ${task.due ? `<span class="text-xs text-slate-400">${formatDate(task.due).replace(/,.*/, '')}</span>` : ''}
                  ${avatarHTML(tech, 'h-6 w-6 text-[10px]')}
                </div>
              </div>
              ${task.notes.length ? `<div class="mt-2.5 flex items-center gap-1 text-xs text-slate-400 border-t border-slate-100 pt-2.5"><nldd-icon name="envelope" style="width:13px;height:13px;"></nldd-icon>${task.notes.length} note${task.notes.length !== 1 ? 's' : ''}</div>` : ''}
            </div>
          `;
        });
        if (colTasks.length === 0) {
          html += `<div class="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">No tasks</div>`;
        }
        html += `</div></div>`;
      });
      kanbanBoard.innerHTML = html;

      kanbanBoard.querySelectorAll('[data-open]').forEach((el) => {
        el.addEventListener('click', () =>
          openDetail(parseInt((el as HTMLElement).dataset['open']!, 10)),
        );
      });
    }

    // ── View toggle ──
    function setView(view: string): void {
      currentView = view;
      const isKanban = view === 'kanban';
      listView.classList.toggle('hidden', isKanban);
      kanbanView.classList.toggle('hidden', !isKanban);
      viewToggle.setAttribute('value', view);
      if (isKanban) renderKanban();
      else renderList();
    }

    // ── Event listeners ──
    viewToggle.addEventListener('change', (e: Event) => setView((e as CustomEvent).detail.value));

    selectAllCb.addEventListener('change', (e: Event) => {
      if ((e as CustomEvent).detail.checked) tasks.forEach((t) => selectedTasks.add(t.id));
      else selectedTasks.clear();
      updateBulkBar();
      renderList();
    });

    (document.getElementById('sendNoteBtn') as HTMLElement).addEventListener('click', addNote);
    (document.getElementById('newNoteInput') as HTMLElement).addEventListener(
      'keydown',
      (e: Event) => {
        if ((e as KeyboardEvent).key === 'Enter') addNote();
      },
    );

    (document.getElementById('addTaskFab') as HTMLElement).addEventListener('click', () =>
      openEditModal(null),
    );

    (document.getElementById('editSaveBtn') as HTMLElement).addEventListener('click', () => {
      const titleInput = document.getElementById('editTitle') as HTMLInputElement;
      const title = (titleInput.value ?? '').trim();
      if (!title) {
        titleInput.focus();
        return;
      }

      const assigneeInput = document.querySelector(
        'input[name="assignee"]:checked',
      ) as HTMLInputElement | null;
      const assigneeVal = assigneeInput?.value;
      const data = {
        title,
        description: (
          document.getElementById('editDescription') as HTMLTextAreaElement
        ).value.trim(),
        status: (document.getElementById('editStatus') as HTMLSelectElement).value,
        priority: (document.getElementById('editPriority') as HTMLSelectElement).value,
        category: (document.getElementById('editCategory') as HTMLSelectElement).value,
        due: (document.getElementById('editDue') as HTMLInputElement).value,
        location: (
          (document.getElementById('editLocation') as HTMLInputElement).value ?? ''
        ).trim(),
        assignee: assigneeVal ? parseInt(assigneeVal, 10) : null,
      };

      if (editingTaskId !== null) {
        const task = tasks.find((t) => t.id === editingTaskId);
        if (task) Object.assign(task, data);
        showToast('Task updated');
      } else {
        tasks.push({
          id: Date.now(),
          ...data,
          created: new Date().toISOString().split('T')[0],
          notes: [],
        });
        showToast('Task created');
      }

      closeModal(editModal);
      if (currentView === 'list') renderList();
      else renderKanban();
    });

    (document.getElementById('detailCloseBtn') as HTMLElement).addEventListener('click', () =>
      detailSheet.hide(),
    );
    (document.getElementById('editCloseBtn') as HTMLElement).addEventListener('click', () =>
      closeModal(editModal),
    );
    (document.getElementById('editCancelBtn') as HTMLElement).addEventListener('click', () =>
      closeModal(editModal),
    );

    editModal.addEventListener('click', (e: Event) => {
      if (e.target === editModal) closeModal(editModal);
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        detailSheet.hide();
        closeModal(editModal);
      }
    });

    // ── Init ──
    setView('list');
  }
}
