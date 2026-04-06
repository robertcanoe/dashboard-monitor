import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [],
  templateUrl: './sensor-list.component.html',
  styleUrl: './sensor-list.component.css'
})
export class SensorListComponent implements OnInit {
  private readonly sensorService = inject(SensorService);

  readonly sensors = signal<Sensor[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedSensorId = this.sensorService.selectedSensorId;

  readonly sensorsCount = computed(() => this.sensors().length);
  readonly typeCount = computed(() => {
    const types = new Set(this.sensors().map(sensor => sensor.type.toLowerCase()));
    return types.size;
  });

  readonly highlightedSensorName = computed(() => this.sensorService.selectedSensor()?.name ?? 'Ninguno');

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sensorService.getSensors().subscribe({
      next: data => {
        this.sensors.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar sensores. Comprueba que el backend esta en http://localhost:5024');
        this.loading.set(false);
      }
    });
  }

  selectSensor(sensor: Sensor): void {
    this.sensorService.selectSensor(sensor);
  }

  getIconBySensorType(type: string): string {
    return this.sensorService.getSensorIcon(type);
  }
}
