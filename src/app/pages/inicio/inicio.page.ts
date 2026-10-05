import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { moon, sunny } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    RouterLink
  ]
})
export class InicioPage {
  isDark = false;

  constructor() {
    addIcons({ moon, sunny });
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('ion-palette-dark', this.isDark);
    document.body.classList.toggle('dark', this.isDark);
  }
}
