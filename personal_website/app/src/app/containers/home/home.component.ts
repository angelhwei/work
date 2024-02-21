import { Component } from '@angular/core';
import { HeaderComponent } from '../../components';
import { NavbarComponent } from '../../components';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
