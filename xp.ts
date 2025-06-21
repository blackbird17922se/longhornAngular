import { Component, Type } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

import { Desktop } from './components/desktop/desktop.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import { TaskbarComponent } from './components/taskbar/taskbar.component';
import { WindowComponent } from "./components/window/window.component";
import { ContactsComponent } from './programs/contacts.component/contacts.component';
import { StartMenuComponent } from './components/start-menu.component/start-menu.component';

import { WindowData } from './models/window.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgFor,
    Desktop,
    Sidebar,
    ContactsComponent,
    TaskbarComponent,
    WindowComponent,
    StartMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class App {
  sidebarCollapsed = false;
  showWindow = true; // Controla si se muestra la ventana

  // Lista de ventanas activas
  windows: WindowData[] = [];

  startMenuVisible: any;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }


  closeWindow(id: number) {
    const win = this.windows.find(w => w.id === id);
    if (win) win.visible = false;
  }

  minimizeWindow(id: number) {
    const win = this.windows.find(w => w.id === id);
    if (win) {
      win.minimized = true;
      win.visible = false;
    }
  }

  restoreWindow(id: number) {
    const win = this.windows.find(w => w.id === id);
    if (win) {
      win.minimized = false;
      win.visible = true;
    }
  }

  get minimizedWindows(): WindowData[] {
    return this.windows.filter(w => w.minimized);
  }

  openApp(appName: string) {

    console.log('Abriendo app:', appName);
    let component: any;
    let title = '';

    switch (appName) {
      case 'contacts':
        component = ContactsComponent;
        title = 'Contactos';
        break;
      // Aquí puedes añadir más apps en el futuro
      default:
        return;
    }

    const newId = this.windows.length + 1;

    this.windows.push({
      
      id: newId,
      title,
      contentComponent: component,
      visible: true,
      minimized: false
    });
    console.log('Ventanas:', this.windows);

  }
}