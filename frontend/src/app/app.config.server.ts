import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideServerRoutesConfig } from '@angular/ssr';
import { RenderMode } from '@angular/ssr';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig([
      {
        path: 'products/:id/edit',
        renderMode: RenderMode.Server // Rendu côté serveur au lieu de prerendering
      },
      {
        path: 'categories/:id/edit',
        renderMode: RenderMode.Server
      },
      {
        path: 'catalogue/:id',
        renderMode: RenderMode.Server
      },
      {
        path: '**',
        renderMode: RenderMode.Prerender // Toutes les autres routes sont pré-rendues
      }
    ])
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
