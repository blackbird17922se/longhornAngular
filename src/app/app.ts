import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Desktop } from './components/desktop/desktop.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import { StartMenu} from './components/start-menu/start-menu.component';
import { Taskbar } from './components/taskbar/taskbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Desktop,
    Sidebar,
    StartMenu,
    Taskbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

