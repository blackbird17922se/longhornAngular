import { Component, HostListener, Type } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Desktop } from './components/desktop/desktop.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import { TaskbarComponent } from './components/taskbar/taskbar.component';
import { WindowComponent } from "./components/window/window.component";
import { ContactsComponent } from './programs/contacts.component/contacts.component';
import { StartMenuComponent } from './components/start-menu.component/start-menu.component';

import { WindowData } from './models/window.model';

/** Es el componente raíz de la app, el que engloba todo: escritorio, barra lateral, taskbar...
Aquí manejas el sidebarCollapsed, el enrutamiento (si lo agregas), y el estado global básico. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Desktop,
    Sidebar,
    ContactsComponent,
    TaskbarComponent,
    WindowComponent,
    StartMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './components/window/window.component.scss']
})

export class App {
  sidebarCollapsed = false;
  startMenuVisible = false;

  windows: WindowData[] = [];

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

  // get minimizedWindows(): WindowData[] {
  //   return this.windows.filter(w => w.minimized);
  // }
  get taskbarWindows(): WindowData[] {
    return this.windows.filter(w => w.visible || w.minimized);
  }


  openApp(appName: string) {
    console.log('Abriendo app:', appName);
    let component: any;
    let title = '';
    let icon = '';

    switch (appName) {
      case 'contacts':
        component = ContactsComponent;
        title = 'Contactos';
        icon = '/assets/icons/apps/contacts/contact-tk.png'; // Asegúrate de tener un icono definido
        break;
      default:
        return;
    }

    // Verificar si ya existe
    const existingWindow = this.windows.find(w => w.title === title);
    if (existingWindow) {
      existingWindow.visible = true;
      existingWindow.minimized = false;
      return;
    }

    // Si no existe, crear una nueva
    const newId = this.windows.length + 1;
    this.windows.push({
      id: newId,
      title,
      contentComponent: component,
      visible: true,
      minimized: false,
      icon: icon
    });

    console.log('Ventanas:', this.windows);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isStartMenu = target.closest('app-start-menu');
    const isStartButton = target.closest('.start-button');

    if (!isStartMenu && !isStartButton) {
      this.startMenuVisible = false;
    }
  }

}

