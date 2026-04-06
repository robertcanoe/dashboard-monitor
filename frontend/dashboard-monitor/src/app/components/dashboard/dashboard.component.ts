import { Component, inject } from '@angular/core';
import { SensorListComponent } from '../sensor-list/sensor-list.component';
import { SensorDetailComponent } from '../sensor-detail/sensor-detail.component';
import { SensorService } from '../../services/sensor.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SensorListComponent, SensorDetailComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly sensorService = inject(SensorService);

  readonly selectedSensor = this.sensorService.selectedSensor;
  readonly todayLabel = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());
}
