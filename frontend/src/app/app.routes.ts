import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent),
      },
      {
        path: 'catalog/:id',
        loadComponent: () =>
          import('./catalog/catalog-detail/catalog-detail').then(m => m.CatalogDetailComponent),
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./catalog/catalog').then(m => m.CatalogComponent),
      },
      {
        path: 'inventory/:id',
        loadComponent: () =>
          import('./inventory/asset-detail/asset-detail').then(m => m.AssetDetailComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./inventory/inventory').then(m => m.InventoryComponent),
      },
      {
        path: 'datacenters/:id',
        loadComponent: () =>
          import('./datacenters/datacenter-detail/datacenter-detail').then(m => m.DatacenterDetailComponent),
      },
      {
        path: 'datacenters',
        loadComponent: () =>
          import('./datacenters/datacenters').then(m => m.DatacentersComponent),
      },
      {
        path: 'racks/device/:id',
        loadComponent: () =>
          import('./racks/device-detail/device-detail').then(m => m.DeviceDetailComponent),
      },
      {
        path: 'racks/:rackId',
        loadComponent: () =>
          import('./racks/racks').then(m => m.RacksComponent),
      },
      {
        path: 'racks',
        loadComponent: () =>
          import('./racks/racks').then(m => m.RacksComponent),
      },
      {
        path: 'patch-mapping',
        loadComponent: () =>
          import('./patch-mapping/patch-mapping').then(m => m.PatchMappingComponent),
      },
      {
        path: 'task-management-admin',
        loadComponent: () =>
          import('./task-management-admin/task-management-admin').then(m => m.TaskManagementAdminComponent),
      },
      {
        path: 'designs/:id',
        loadComponent: () =>
          import('./designs/design-detail/design-detail').then(m => m.DesignDetailComponent),
      },
      {
        path: 'designs',
        loadComponent: () =>
          import('./designs/designs').then(m => m.DesignsComponent),
      },
    ],
  },
  {
    path: 'task-management-technician',
    loadComponent: () =>
      import('./task-management-technician/task-management-technician').then(m => m.TaskManagementTechnicianComponent),
  },
];
