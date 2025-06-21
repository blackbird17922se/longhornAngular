import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class StartMenuComponent {

  @Output() launchApp = new EventEmitter<string>();

  abrir(app: string) {
    console.log('Click en:', app); // <-- nuevo log
    this.launchApp.emit(app);
  }

}
