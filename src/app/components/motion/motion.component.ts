import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  motionData: MotionData = {};
  steps: number = 0;
  acceleration: number = 0;

  // Parámetros de detección de pasos
  private lastPeakTime: number = 0;
  private lastValleyTime: number = 0;
  private peakAcceleration: number = 0;
  private valleyAcceleration: number = 0;
  private stepDetectionThreshold: number = 2; // Ajusta este valor para sensibilidad
  private stepMinInterval: number = 250; // Mínimo intervalo entre pasos (ms)
  private stepMaxInterval: number = 2000; // Máximo intervalo entre pasos (ms)

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.startStepCounter();
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  private startStepCounter() {
    this.motionS.startMotionDetection((data: MotionData) => {
      if (data.acceleration) {
        // Calcular la magnitud de aceleración total
        const currentAcceleration = Math.sqrt(
          Math.pow(data.acceleration.x || 0, 2) +
          Math.pow(data.acceleration.y || 0, 2) +
          Math.pow(data.acceleration.z || 0, 2)
        );

        // Guardar la aceleración actual
        this.acceleration = currentAcceleration;

        // Implementar algoritmo de detección de pasos más avanzado
        this.detectStep(currentAcceleration);
      }
    });
  }

  private detectStep(currentAcceleration: number) {
    const currentTime = Date.now();

    // Detectar picos y valles de aceleración
    if (currentAcceleration > this.peakAcceleration) {
      this.peakAcceleration = currentAcceleration;
      this.lastPeakTime = currentTime;
    }

    if (currentAcceleration < this.valleyAcceleration) {
      this.valleyAcceleration = currentAcceleration;
      this.lastValleyTime = currentTime;
    }

    // Condiciones para detectar un paso
    const peakToValleyDiff = this.peakAcceleration - this.valleyAcceleration;
    const timeBetweenPeakAndValley = this.lastPeakTime - this.lastValleyTime;
    const timeSinceLastStep = currentTime - (this.lastPeakTime || 0);

    // Criterios de detección de paso
    if (
      peakToValleyDiff > this.stepDetectionThreshold && 
      Math.abs(timeBetweenPeakAndValley) < 500 && // Intervalo corto entre pico y valle
      timeSinceLastStep > this.stepMinInterval && 
      timeSinceLastStep < this.stepMaxInterval
    ) {
      this.steps++;

      // Resetear para la próxima detección
      this.peakAcceleration = 0;
      this.valleyAcceleration = Number.MAX_SAFE_INTEGER;
    }
  }
}