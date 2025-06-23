import { AfterViewInit, Component, EventEmitter, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  /* "standalone" = indica que este componente no es parte de un módulo, sino que se puede usar directamente.
    * En Angular 16 y versiones posteriores, puedes crear componentes independientes sin necesidad de módulos.
    * 
    * Cuando un componente en Angular tiene standalone: true, significa que no necesita estar declarado en un 
    * NgModule para funcionar.
    * Con esto, puedes usar este componente en cualquier otro que también sea standalone, sin necesidad de módulos
    */
  standalone: true,
  // "imports" = lista de otros componentes, directivas o pipes que este componente necesita.
  imports: [CommonModule, FormsModule],
  // "templateUrl" = ruta al archivo HTML que define la plantilla de este componente.
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent implements AfterViewInit {

  @Input() title: string = 'Ventana'; // Título de la ventana, por defecto "Ventana"
  @Input() contentComponent!: Type<any>; // Componente dinámico
  @Output() close = new EventEmitter(); // Evento que se emite al cerrar la ventana
  @Output() minimize = new EventEmitter<void>();


  dragging: boolean = false; // Indica si la ventana está siendo arrastrada
  offsetX: number = 0; // Desplazamiento en X al arrastrar
  offsetY: number = 0; // Desplazamiento en Y al arrastrar

  maximized = true; // 👈 Estado de maximización

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

  @ViewChild('contentContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  toggleDropdown(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  toggleFullDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.showFullDropdown = !this.showFullDropdown;
  }

  navigateTo(location: string) {
    console.log('Ir a:', location);
    // Actualiza breadcrumbPath dinámicamente si quieres.
  }

  applyPath() {
    this.isEditingAddress = false;
    console.log('Ruta ingresada:', this.editablePath);
    // Puedes analizar la ruta y regenerar breadcrumbPath si quieres.
  }

  ngAfterViewInit() {
    console.log('WindowComponent inicializado');
    this.container.clear();
    if (this.contentComponent) {
      this.container.createComponent(this.contentComponent);
    }

    // Migrado de Lg vanilla
    setTimeout(() => {
      const arrows = document.querySelectorAll('.node-arrow');
      arrows.forEach(arrow => {
        arrow.addEventListener('click', (e: any) => {
          e.stopPropagation();
          const node = e.target.closest('.breadcrumb-node');
          const dropdown = node?.querySelector('.breadcrumb-dropdown') as HTMLElement;
          const allDropdowns = document.querySelectorAll('.breadcrumb-dropdown');

          allDropdowns.forEach(d => {
            if (d !== dropdown) {
              (d as HTMLElement).style.display = 'none';
            }
          });

          if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          }
        });
      });

      // Cierre global si se hace clic fuera
      document.addEventListener('click', () => {
        document.querySelectorAll('.breadcrumb-dropdown').forEach(drop => {
          (drop as HTMLElement).style.display = 'none';
        });

        const dropdown = document.querySelector('.breadcrumb-dropdown-dir') as HTMLElement;
        const addressB = document.querySelector('.address-bar') as HTMLElement;
        if (dropdown && addressB) {
          dropdown.style.display = 'none';
          addressB.classList.remove('open');
        }
      });

      const toggleBtn = document.getElementById("toggle-dir-dropdown");
      const dropdown = document.querySelector(".breadcrumb-dropdown-dir") as HTMLElement;
      const addressB = document.querySelector(".address-bar") as HTMLElement;

      if (toggleBtn && dropdown && addressB) {
        toggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = dropdown.style.display === "block";
          dropdown.style.display = isOpen ? "none" : "block";

          if (!isOpen) {
            addressB.classList.add("open");
          } else {
            addressB.classList.remove("open");
          }
        });
      }
    }, 0);
  }


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
    if (!this.dragging) return; // Si no está arrastrando, no hace nada
    // Actualiza la posición de la ventana
    const dx = event.clientX - this.offsetX; // Nueva posición en X
    const dy = event.clientY - this.offsetY; // Nueva posición en Y

    const newLeft = win.offsetLeft + dx; // Nueva posición izquierda
    const newTop = win.offsetTop + dy; // Nueva posición superior

    // Asegura que la ventana no se salga de la pantalla
    const screenWidth = window.innerWidth; // Ancho de la pantalla

    win.style.left = `${newLeft}px`; // Actualiza el estilo de la ventana
    win.style.top = `${newTop}px`; // Actualiza el estilo de la ventana

    // Resetea el desplazamiento
    this.offsetX = event.clientX; // Actualiza el desplazamiento en X
    this.offsetY = event.clientY; // Actualiza el desplazamiento en Y

  }
  // Cuando se suelta el ratón al arrastrar
  stopDrag() {
    this.dragging = false; // Detiene el arrastre
  }

}
