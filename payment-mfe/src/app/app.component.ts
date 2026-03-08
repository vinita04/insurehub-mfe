import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { seedMockData } from './shared/data/mock-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    seedMockData();
  }
}
