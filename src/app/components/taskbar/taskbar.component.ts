import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss'],
  imports: [CommonModule]
})
export class TaskbarComponent {
  @Input() collapsed = false;
  @Input() minimizedWindows: { id: number; title: string }[] = [];

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() restoreWindow = new EventEmitter<number>();

  @Output() toggleStartMenu = new EventEmitter<void>(); // ✅ Este es el nuevo

  @ViewChild('startButton', { read: ElementRef }) startButtonRef!: ElementRef;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleStartMenuClick() {
    this.toggleStartMenu.emit(); // ✅ Emite evento al padre
  }
}

