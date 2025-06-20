import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common'; // ✅ este es el que te falta


@Component({
  selector: 'app-taskbar',
  standalone: true,
  templateUrl: './taskbar.html',
  styleUrls: ['./taskbar.scss'],
    imports: [NgClass] // ✅ aquí lo agregas
})
export class Taskbar {
  @Input() collapsed = false; // ✅ ESTO DEBE IR AQUÍ, no dentro de ninguna función
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit(); // ✅ si usas esta función, así se emite
  }
}
