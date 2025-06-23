import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';

/**
 * Componente de ventana que representa una ventana en el escritorio.
 * 
 * Este componente puede ser utilizado para crear ventanas que se pueden abrir, cerrar y manipular en el escritorio.
 * Un componente reutilizable, tipo ventana flotante, que:
 * Tiene una barra de título (con nombre del programa).
 * Puede moverse (drag).
 * Puede cerrarse.
 * A futuro, puede minimizarse o maximizarse.
 * Contiene dentro cualquier otro componente (explorador, música, etc.).
 * 
 * @example
 * <app-window></app-window>
*/
@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent implements AfterViewInit, OnDestroy {

  @Input() title: string = 'Ventana'; // Título de la ventana, por defecto "Ventana"
  @Input() contentComponent!: Type<any>; // Componente dinámico
  @Output() close = new EventEmitter(); // Evento que se emite al cerrar la ventana
  @Output() minimize = new EventEmitter<void>();

  @ViewChild('contentContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  dragging: boolean = false; // Indica si la ventana está siendo arrastrada
  offsetX: number = 0; // Desplazamiento en X al arrastrar
  offsetY: number = 0; // Desplazamiento en Y al arrastrar
  maximized: boolean = true; // 👈 Estado de maximización

  isEditingAddress = false;
  dropdownIndex: number | null = null;
  showFullDropdown = false;
  hovered: number | null = null;

  breadcrumbPath = [
    { label: 'Mi PC', dropdown: ['Desktop', 'Documentos', 'Descargas'] },
    { label: 'Contactos', dropdown: ['Documentos', 'Música', 'Videos'] }
  ];

  allLocations = ['Mi PC', 'Documentos', 'Música', 'Videos', 'Imágenes', 'Descargas'];
  editablePath = 'C:/Contactos';

  // NUEVO: guarda posición y tamaño antes de maximizar
  private prevState = {
    top: '100px',
    left: '100px',
    width: '400px',
    height: 'auto'
  };


  ngAfterViewInit() {
    console.log('WindowComponent inicializado');

    // Carga el componente dinámico
    this.container.clear();
    if (this.contentComponent) {
      this.container.createComponent(this.contentComponent);
    }

    // Inicializa el breadcrumb y sus eventos
    this.inicializarbreadcrumb();
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  /** Maneja el clic en el área de dirección */
  handleAddressClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Si se hizo clic dentro de un breadcrumb-node, no hacer nada
    if (target.closest('.breadcrumb-node') || target.closest('.breadcrumb-toggle-btn')) return;

    console.log('Se hizo clic en address-bar fuera de breadcrumb-nodes');
    this.isEditingAddress = true;
    this.inicializarbreadcrumb();
  }
  applyPath() {
    this.isEditingAddress = false;
    console.log('Ruta ingresada:', this.editablePath);
    // Aquí puedes regenerar breadcrumbPath si quieres
    this.inicializarbreadcrumb();
  }

   /** Cierra edición si se hace clic fuera del address-bar */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const addressBar = document.querySelector('.address-bar');

    // ⚠️ Si se hace clic dentro de la dropdown general o botón, no hagas nada
    const clickedToggleBtn = target.closest('#toggle-dir-dropdown');
    const clickedDropdownDir = target.closest('.breadcrumb-dropdown-dir');

    if (clickedToggleBtn || clickedDropdownDir) return;

    if (this.isEditingAddress && addressBar && !addressBar.contains(target)) {
      this.isEditingAddress = false;
      console.log('ya no es edición');
    }

    this.inicializarbreadcrumb(); // Siempre reengancha
  }



  /************************ PARA BREADCUM ******************* */
  inicializarbreadcrumb() {
    console.log('Inicializando breadcrumb');

    setTimeout(() => {
      // 1. Limpia y vuelve a agregar eventos a cada arrow
      document.querySelectorAll('.node-arrow').forEach(arrow => {
        const newArrow = arrow.cloneNode(true) as HTMLElement;
        arrow.replaceWith(newArrow);
      });

      // 2. Reagrega la lógica de abrir/cerrar dropdowns por nodo
      document.querySelectorAll('.node-arrow').forEach(arrow => {
        arrow.addEventListener('click', (e: any) => {
          e.stopPropagation();
          const node = e.target.closest('.breadcrumb-node') as HTMLElement;
          const dropdown = node?.querySelector('.breadcrumb-dropdown') as HTMLElement;

          const allDropdowns = document.querySelectorAll('.breadcrumb-dropdown');
          allDropdowns.forEach(d => {
            if (d !== dropdown) (d as HTMLElement).style.display = 'none';
          });

          if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          }
        });
      });

      // 3. Botón ▼ lateral (dropdown-dir)
      const oldToggleBtn = document.getElementById('toggle-dir-dropdown');
      if (oldToggleBtn) {
        const newToggleBtn = oldToggleBtn.cloneNode(true) as HTMLElement;
        oldToggleBtn.replaceWith(newToggleBtn);

        const dropdown = document.querySelector('.breadcrumb-dropdown-dir') as HTMLElement;
        const addressB = document.querySelector('.address-bar') as HTMLElement;

        if (dropdown && addressB) {
          newToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            addressB.classList.toggle('open', !isOpen);
          });
        }
      }

      // 4. Manejo de clics por fuera para cerrar todo
      document.removeEventListener('click', this.handleOutsideClick);
      document.addEventListener('click', this.handleOutsideClick);

    }, 0);
  }

  handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Cierra todos los dropdowns breadcrumb-node
    document.querySelectorAll('.breadcrumb-dropdown').forEach(drop => {
      (drop as HTMLElement).style.display = 'none';
    });

    // Cierra dropdown-dir si está abierto
    const dropdownDir = document.querySelector('.breadcrumb-dropdown-dir') as HTMLElement;
    const addressB = document.querySelector('.address-bar') as HTMLElement;
    if (dropdownDir && addressB) {
      dropdownDir.style.display = 'none';
      addressB.classList.remove('open');
    }
  };


  /*************************** EVENTOS DE LA VENTANA: MINIMIZAR, RESTAURAR, MOVER, CERRAR ********************/
  // Cambia entre maximizado/restaurado
  toggleMaximize(win: HTMLElement) {
    if (!this.maximized) {
      // Guarda estado actual antes de maximizar
      this.prevState = {
        top: win.style.top,
        left: win.style.left,
        width: win.style.width,
        height: win.style.height
      };

      // Maximiza
      win.style.top = '0';
      win.style.left = '0';
      win.style.width = '100%';
      win.style.height = '100%';
    } else {
      // Restaura
      win.style.top = this.prevState.top;
      win.style.left = this.prevState.left;
      win.style.width = this.prevState.width;
      win.style.height = this.prevState.height;
    }
    this.maximized = !this.maximized;
  }

  // Cuando se empieza a arrastrar
  startDrag(event: MouseEvent) {
    this.dragging = true; // Inicia el arrastre
    this.offsetX = event.clientX; // Calcula el desplazamiento en X
    this.offsetY = event.clientY; // Calcula el desplazamiento en Y
  }

  // Cuando se arrastra la ventana
  onDrag(event: MouseEvent, win: HTMLElement) {
    if (!this.dragging) return;

    // Calcula nueva posición
    const dx = event.clientX - this.offsetX;
    const dy = event.clientY - this.offsetY;

    const newLeft = win.offsetLeft + dx;
    const newTop = win.offsetTop + dy;

    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;

    // Actualiza el desplazamiento
    this.offsetX = event.clientX;
    this.offsetY = event.clientY;
  }

  // Cuando se suelta el ratón al arrastrar
  stopDrag() {
    this.dragging = false; // Detiene el arrastre
  }

}
