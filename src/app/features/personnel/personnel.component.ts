import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class PersonnelComponent {}
