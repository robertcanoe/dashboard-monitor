import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { Reading } from '../../models/reading';
import { SensorService } from '../../services/sensor.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sensor-detail',
  standalone: true,
  imports: [],
  templateUrl: './sensor-detail.component.html',
  styleUrl: './sensor-detail.component.css'
})
export class SensorDetailComponent {
  private readonly sensorService = inject(SensorService);
  private pollSubscription?: Subscription;

  readonly sensor = input.required<Sensor>();
  readonly readings = signal<Reading[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly autoRefresh = signal(true);

  readonly filterFromDate = signal('');
  readonly filterToDate = signal('');
  readonly appliedFilter = signal<{ from: string; to: string }>({ from: '', to: '' });
  readonly refreshNonce = signal(0);

  readonly unit = computed(() => this.sensorService.getSensorUnit(this.sensor().type));
  readonly latestReading = computed(() => this.readings()[0] ?? null);
  readonly averageValue = computed(() => {
    const data = this.readings();
    if (data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, reading) => acc + reading.value, 0);
    return Math.round((sum / data.length) * 100) / 100;
  });
  readonly maxValue = computed(() => {
    const data = this.readings();
    return data.length > 0 ? Math.max(...data.map(reading => reading.value)) : 0;
  });
  readonly minValue = computed(() => {
    const data = this.readings();
    return data.length > 0 ? Math.min(...data.map(reading => reading.value)) : 0;
  });
  readonly displayedReadings = computed(() => this.readings().slice(0, 20));
  readonly trend = computed<'up' | 'down' | 'stable'>(() => {
    const data = this.readings();

    if (data.length < 2) {
      return 'stable';
    }

    if (data[0].value > data[1].value) {
      return 'up';
    }

    if (data[0].value < data[1].value) {
      return 'down';
    }

    return 'stable';
  });
  readonly trendLabel = computed(() => {
    const trend = this.trend();

    if (trend === 'up') {
      return 'Tendencia al alza';
    }

    if (trend === 'down') {
      return 'Tendencia a la baja';
    }

    return 'Tendencia estable';
  });

  constructor() {
    effect(
      onCleanup => {
        const selected = this.sensor();
        const auto = this.autoRefresh();
        const filter = this.appliedFilter();

        // Trigger extra recarga manual al actualizar ahora.
        this.refreshNonce();

        this.pollSubscription?.unsubscribe();
        this.loading.set(true);
        this.error.set(null);

        if (auto) {
          this.pollSubscription = timer(0, 15000)
            .pipe(
              switchMap(() =>
                this.sensorService.getReadingsBySensor(
                  selected.id,
                  filter.from || undefined,
                  filter.to || undefined
                )
              )
            )
            .subscribe({
              next: data => {
                this.readings.set(this.sortReadings(data));
                this.loading.set(false);
              },
              error: () => {
                this.error.set('Error al cargar las lecturas del sensor.');
                this.loading.set(false);
              }
            });
        } else {
          this.pollSubscription = this.sensorService
            .getReadingsBySensor(selected.id, filter.from || undefined, filter.to || undefined)
            .subscribe({
              next: data => {
                this.readings.set(this.sortReadings(data));
                this.loading.set(false);
              },
              error: () => {
                this.error.set('Error al cargar las lecturas del sensor.');
                this.loading.set(false);
              }
            });
        }

        onCleanup(() => {
          this.pollSubscription?.unsubscribe();
        });
      },
      { allowSignalWrites: true }
    );
  }

  private sortReadings(data: Reading[]): Reading[] {
    return [...data].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  setFilterFromDate(value: string): void {
    this.filterFromDate.set(value);
  }

  setFilterToDate(value: string): void {
    this.filterToDate.set(value);
  }

  applyFilter(): void {
    this.appliedFilter.set({ from: this.filterFromDate(), to: this.filterToDate() });
  }

  clearFilter(): void {
    this.filterFromDate.set('');
    this.filterToDate.set('');
    this.appliedFilter.set({ from: '', to: '' });
  }

  refreshNow(): void {
    this.refreshNonce.update(value => value + 1);
  }

  toggleAutoRefresh(): void {
    this.autoRefresh.update(value => !value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  }

  exportarCSV(): void {
    if (this.readings().length === 0) {
      window.alert('No hay datos para exportar.');
      return;
    }

    const headers = ['Fecha/Hora', 'Sensor', 'Ubicación', 'Tipo', 'Valor', 'Unidad'];
    const sensor = this.sensor();
    const unidad = this.unit();
    
    const csvContent = [
      headers.join(','),
      ...this.readings().map(r => {
        const fecha = new Date(r.timestamp).toLocaleString('es-ES');
        return [
          `"${fecha}"`,
          `"${sensor.name}"`,
          `"${sensor.location}"`,
          `"${sensor.type}"`,
          r.value,
          `"${unidad}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const nombreArchivo = `lecturas_${sensor.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
