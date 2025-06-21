import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-window',

  standalone: true,
  imports: [],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class Window {
  @Input() title: string = 'Ventana'; // Título de la ventana, por defecto "Ventana"
  @Output() close = new EventEmitter(); // Evento que se emite al cerrar la ventana

  dragging: boolean = false; // Indica si la ventana está siendo arrastrada
  offsetX: number = 0; // Desplazamiento en X al arrastrar
  offsetY: number = 0; // Desplazamiento en Y al arrastrar


  // Cuando se empieza a arrastrar
  startDrag(event: MouseEvent) {
    this.dragging = true; // Inicia el arrastre
    this.offsetX = event.clientX - event.clientX; // Calcula el desplazamiento en X
    this.offsetY = event.clientY - event.clientY; // Calcula el desplazamiento en Y
  }

  // Cuando se arrastra la ventana
  onDrag(event: MouseEvent , win: HTMLElement) {
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
