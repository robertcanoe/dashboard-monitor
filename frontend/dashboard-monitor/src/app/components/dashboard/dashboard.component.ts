import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorListComponent } from '../sensor-list/sensor-list.component';
import { SensorDetailComponent } from '../sensor-detail/sensor-detail.component';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SensorListComponent, SensorDetailComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedSensor: Sensor | null = null;
  private subscription?: Subscription;

  constructor(private sensorService: SensorService) {
    console.log('Dashboard inicializado');
  }

  ngOnInit(): void {
    this.subscription = this.sensorService.selectedSensor$.subscribe(sensor => {
      console.log('Sensor seleccionado en dashboard:', sensor);
      this.selectedSensor = sensor;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
