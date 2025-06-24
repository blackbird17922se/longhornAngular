import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class Sidebar implements OnInit, OnDestroy {
  intervalId: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    this.iniciarReloj();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  iniciarReloj() {
    this.updateClock();
    this.intervalId = setInterval(() => this.updateClock(), 1000);
  }

  updateClock(): void {
    const now = new Date();

    const second = now.getSeconds();
    const minute = now.getMinutes();
    const hour = now.getHours();

    const secondDeg = second * 6;
    const minuteDeg = minute * 6 + second * 0.1;
    const hourDeg = (hour % 12) * 30 + minute * 0.5;

    const secondHand = document.getElementById("second-hand");
    const minuteHand = document.getElementById("minute-hand");
    const hourHand = document.getElementById("hour-hand");

    if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const paddedMin = String(minute).padStart(2, '0');

    const digitalTime = document.getElementById("digital-time");
    if (digitalTime) {
      digitalTime.textContent = `${hour12}:${paddedMin} ${ampm}`;
    }

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const mes = meses[now.getMonth()];
    const dia = now.getDate();

    const dateElem = document.getElementById("date");
    if (dateElem) {
      dateElem.textContent = `${mes} ${dia}`;
    }
  }
}
