// contacts.component.ts
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  ElementRef,
  OnDestroy,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ContactsComponent {
  selectedForm: 'name' | 'email' | null = null;

  @ViewChild('nameForm') nameFormRef!: ElementRef;
  @ViewChild('emailForm') emailFormRef!: ElementRef;
  @Input() title: string = 'Ventana'; // Título de la ventana, por defecto "Ventana"
  @Input() contentComponent!: Type<any>; // Componente dinámico
  @Output() close = new EventEmitter(); // Evento que se emite al cerrar la ventana
  @Output() minimize = new EventEmitter<void>();

  openForm(form: 'name' | 'email') {
    this.selectedForm = form;
  }

  closeForm() {
    this.selectedForm = null;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Si no hay formulario abierto, no hacemos nada
    if (!this.selectedForm) return;

    // Referencia al formulario actual
    const activeFormRef =
      this.selectedForm === 'name' ? this.nameFormRef : this.emailFormRef;

    if (
      activeFormRef &&
      activeFormRef.nativeElement &&
      !activeFormRef.nativeElement.contains(target) &&
      !target.classList.contains('a-input')
    ) {
      this.closeForm();
    }
  }

}
