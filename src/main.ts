import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';
//"bootstrap" = arrancar desde un componente raíz (AppComponent).
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
