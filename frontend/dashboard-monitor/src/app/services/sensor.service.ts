import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { Sensor } from '../models/sensor';
import { Reading } from '../models/reading';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private readonly apiUrl = 'http://localhost:5024/api';

  readonly selectedSensor = signal<Sensor | null>(null);
  readonly selectedSensorId = computed(() => this.selectedSensor()?.id ?? null);
  
  constructor(private http: HttpClient) { }

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}/sensores`);
  }

  getSensorById(id: number): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/sensores/${id}`);
  }

  getReadingsBySensor(sensorId: number, desde?: string, hasta?: string): Observable<Reading[]> {
    let url = `${this.apiUrl}/lecturas?sensorId=${sensorId}`;
    if (desde) url += `&desde=${desde}`;
    if (hasta) url += `&hasta=${hasta}`;
    return this.http.get<Reading[]>(url);
  }

  createReading(sensorId: number, value: number): Observable<Reading> {
    return this.http.post<Reading>(`${this.apiUrl}/lecturas`, {
      sensorId,
      value,
      timestamp: new Date().toISOString()
    });
  }

  selectSensor(sensor: Sensor): void {
    this.selectedSensor.set(sensor);
  }

  getSensorIcon(type: string): string {
    const icons: Record<string, string> = {
      temperatura: 'T',
      humedad: 'H',
      presion: 'P',
      presión: 'P',
      luz: 'L',
      movimiento: 'M'
    };

    return icons[type.toLowerCase()] ?? 'S';
  }

  getSensorUnit(type: string): string {
    const units: Record<string, string> = {
      temperatura: '°C',
      humedad: '%',
      presion: 'hPa',
      presión: 'hPa',
      luz: 'lux',
      movimiento: 'eventos'
    };

    return units[type.toLowerCase()] ?? '';
  }

  // Auto-refresh de lecturas cada X segundos
  getReadingsAutoRefresh(sensorId: number, intervalMs: number = 15000): Observable<Reading[]> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getReadingsBySensor(sensorId))
    );
  }
}