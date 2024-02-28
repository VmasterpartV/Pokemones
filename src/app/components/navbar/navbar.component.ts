import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string;
  isDarkMode: boolean;

  constructor(private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.darkModeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.body.setAttribute('data-bs-theme', theme);
  }
}
