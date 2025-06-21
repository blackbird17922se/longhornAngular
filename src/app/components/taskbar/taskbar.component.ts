import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartMenuComponent } from '../start-menu.component/start-menu.component';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss'],
  imports: [CommonModule, StartMenuComponent]
})
export class TaskbarComponent {

  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() minimizedWindows: { id: number; title: string }[] = [];
  @Output() restoreWindow = new EventEmitter<number>();
  @ViewChild('startButton', { read: ElementRef }) startButtonRef!: ElementRef;

  startMenuVisible = false;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleStartMenu() {
    this.startMenuVisible = !this.startMenuVisible;
  }

  // Detecta clics globales fuera del menú y botón
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideButton = this.startButtonRef?.nativeElement.contains(target);
    const clickedInsideMenu = document.querySelector('app-start-menu')?.contains(target);

    if (!clickedInsideButton && !clickedInsideMenu) {
      this.startMenuVisible = false;
    }
  }

  // Cierra el menú al presionar Esc
  @HostListener('document:keydown.escape')
  handleEscape() {
    this.startMenuVisible = false;
  }

}
