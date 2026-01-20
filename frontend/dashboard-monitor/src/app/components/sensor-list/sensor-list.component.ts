import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensor-list.component.html',
  styleUrl: './sensor-list.component.css'
})
export class SensorListComponent implements OnInit {
  sensors: Sensor[] = [];
  selectedSensorId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    console.log('Cargando sensores desde:', this.sensorService);
    this.loading = true;
    this.error = null;
    this.sensorService.getSensors().subscribe({
      next: (data) => {
        console.log('Sensores recibidos:', data);
        console.log('Tipo de datos:', Array.isArray(data), data.length);
        this.sensors = data;
        this.loading = false;
        console.log('Loading después de cargar:', this.loading);
        console.log('Sensores en componente:', this.sensors.length);
        
        // Forzar detección de cambios
        setTimeout(() => {
          console.log('Estado final - sensors:', this.sensors.length, 'loading:', this.loading);
        }, 100);
      },
      error: (err) => {
        console.error('Error loading sensors:', err);
        console.error('URL:', 'http://localhost:5024/api/sensores');
        this.error = 'Error al cargar los sensores. Verifica que el backend está en http://localhost:5024';
        this.loading = false;
      }
    });
  }

  selectSensor(sensor: Sensor): void {
    this.selectedSensorId = sensor.id;
    this.sensorService.selectSensor(sensor);
  }

  getIconBySensorType(type: string): string {
    const icons: { [key: string]: string } = {
      'temperatura': '🌡️',
      'humedad': '💧',
      'presión': '📊',
      'luz': '💡',
      'movimiento': '🔔',
      'default': '📡'
    };
    return icons[type.toLowerCase()] || icons['default'];
  }
}
