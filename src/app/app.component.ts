import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { Desktop } from './components/desktop/desktop.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import { StartMenu } from './components/start-menu/start-menu.component';
import { Taskbar } from './components/taskbar/taskbar.component';
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
    Desktop,
    Sidebar,
    StartMenu,
    Taskbar,
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
  





}

