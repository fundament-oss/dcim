import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideNgIconsConfig } from '@ng-icons/core';
import { routes } from './app.routes';
import { ConfigService } from './config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    // Initialize configuration before app starts
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.loadConfig();
    }),
    provideNgIconsConfig({
      size: '1rem', // Default icon size
    }),
  ],
};
