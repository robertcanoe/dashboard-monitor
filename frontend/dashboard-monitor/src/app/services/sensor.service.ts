import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { Sensor } from '../models/sensor';
import { Reading } from '../models/reading';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:5024/api';
  private selectedSensorSubject = new BehaviorSubject<Sensor | null>(null);
  public selectedSensor$ = this.selectedSensorSubject.asObservable();
  
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
    this.selectedSensorSubject.next(sensor);
  }

  getSelectedSensor(): Sensor | null {
    return this.selectedSensorSubject.value;
  }

  // Auto-refresh lecturas cada X segundos
  getReadingsAutoRefresh(sensorId: number, intervalMs: number = 15000): Observable<Reading[]> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getReadingsBySensor(sensorId))
    );
  }
}