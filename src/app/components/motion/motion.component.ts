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
  private lastAcceleration: number = 0;
  private threshold: number = 10; // Adjust sensitivity
  private stepCooldown: number = 0;

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.startStepCounter();
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  private startStepCounter() {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data;

      if (data.acceleration) {
        // Calculate total acceleration magnitude
        const currentAcceleration = Math.sqrt(
          Math.pow(data.acceleration.x || 0, 2) +
          Math.pow(data.acceleration.y || 0, 2) +
          Math.pow(data.acceleration.z || 0, 2)
        );

        // Simple step detection algorithm
        if (this.stepCooldown > 0) {
          this.stepCooldown--;
        }

        // Detect significant change in acceleration
        const accelerationChange = Math.abs(currentAcceleration - this.lastAcceleration);
        
        if (accelerationChange > this.threshold && this.stepCooldown === 0) {
          this.steps++;
          this.stepCooldown = 5; // Prevent rapid step counting
        }

        this.acceleration = currentAcceleration;
        this.lastAcceleration = currentAcceleration;
      }
    });
  }
}