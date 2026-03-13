import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class WorkOrdersComponent {}
