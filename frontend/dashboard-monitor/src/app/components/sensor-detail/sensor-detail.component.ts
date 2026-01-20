import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sensor } from '../../models/sensor';
import { Reading } from '../../models/reading';
import { SensorService } from '../../services/sensor.service';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sensor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-detail.component.html',
  styleUrl: './sensor-detail.component.css'
})
export class SensorDetailComponent implements OnInit, OnDestroy {
  @Input() sensor!: Sensor;

  readings: Reading[] = [];
  filteredReadings: Reading[] = [];
  loading = false;
  autoRefresh = true;
  error: string | null = null;

  filterFromDate = '';
  filterToDate = '';

  private destroy$ = new Subject<void>();

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    if (this.sensor) {
      this.loadReadings();
      this.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReadings(): void {
    if (!this.sensor) return;

    this.loading = true;
    this.error = null;

    this.sensorService.getReadingsBySensor(
      this.sensor.id,
      this.filterFromDate,
      this.filterToDate
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.readings = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.filteredReadings = this.readings.slice(0, 20); // Últimas 20
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading readings:', err);
        this.error = 'Error al cargar las lecturas';
        this.loading = false;
      }
    });
  }

  startAutoRefresh(): void {
    if (this.autoRefresh && this.sensor) {
      this.sensorService.getReadingsAutoRefresh(this.sensor.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.readings = data.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            this.filteredReadings = this.readings.slice(0, 20);
          }
        });
    }
  }

  applyFilter(): void {
    this.loadReadings();
  }

  clearFilter(): void {
    this.filterFromDate = '';
    this.filterToDate = '';
    this.loadReadings();
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  getLatestReading(): Reading | undefined {
    return this.readings[0];
  }

  getAverageValue(): number {
    if (this.readings.length === 0) return 0;
    const sum = this.readings.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / this.readings.length) * 100) / 100;
  }

  getMaxValue(): number {
    if (this.readings.length === 0) return 0;
    return Math.max(...this.readings.map(r => r.value));
  }

  getMinValue(): number {
    if (this.readings.length === 0) return 0;
    return Math.min(...this.readings.map(r => r.value));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  }

  getUnidad(tipo: string): string {
    const unidades: { [key: string]: string } = {
      'temperatura': '°C',
      'humedad': '%',
      'presión': 'hPa',
      'luz': 'lux'
    };
    return unidades[tipo.toLowerCase()] || '';
  }

  exportarCSV(): void {
    if (!this.sensor || this.readings.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear el contenido CSV
    const headers = ['Fecha/Hora', 'Sensor', 'Ubicación', 'Tipo', 'Valor', 'Unidad'];
    const unidad = this.getUnidad(this.sensor.type);
    
    const csvContent = [
      headers.join(','),
      ...this.readings.map(r => {
        const fecha = new Date(r.timestamp).toLocaleString('es-ES');
        return [
          `"${fecha}"`,
          `"${this.sensor.name}"`,
          `"${this.sensor.location}"`,
          `"${this.sensor.type}"`,
          r.value,
          `"${unidad}"`
        ].join(',');
      })
    ].join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const nombreArchivo = `lecturas_${this.sensor.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
