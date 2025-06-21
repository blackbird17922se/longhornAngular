import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

import { Desktop } from './components/desktop/desktop.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import { StartMenu } from './components/start-menu/start-menu.component';
import { TaskbarComponent } from './components/taskbar/taskbar.component';
import { Window } from "./components/window/window.component";
import { WindowData } from './models/window.model';

/** Es el componente raíz de la app, el que engloba todo: escritorio, barra lateral, taskbar...
Aquí manejas el sidebarCollapsed, el enrutamiento (si lo agregas), y el estado global básico. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgFor,
    Desktop,
    Sidebar,
    StartMenu,
    TaskbarComponent,
    Window
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  sidebarCollapsed = false;
  showWindow = true; // Controla si se muestra la ventana


  // Lista de ventanas activas
  windows: WindowData[] = [
    {
      id: 1,
      title: 'Mi Ventana',
      content: 'Este es el contenido de la ventana',
      visible: true,
      minimized: false
    }
  ];

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


}

