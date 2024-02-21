import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    document.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  handleScroll() {
    const background = document.querySelector("#background") as HTMLElement;

    const { scrollY, innerHeight } = window;

    const currentIndex = Math.floor(scrollY / (innerHeight - 200));

    if (background) {
      background.style.transform = `translateX(${
        currentIndex > 0 ? 56 * currentIndex : 0
      }px)`;
    }
  }
}
