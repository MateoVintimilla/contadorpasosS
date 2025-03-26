import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { MotionData } from '../Model/MotionData.model';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: any;

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    // Verificar si el plugin Motion está disponible
    if (!Capacitor.isPluginAvailable('Motion')) {
      console.error('Motion plugin no está disponible');
      return;
    }

    try {
      this.accelListener = await Motion.addListener('accel', (event: any) => {
        const motionData: MotionData = {
          acceleration: {
            x: event.acceleration.x,
            y: event.acceleration.y,
            z: event.acceleration.z
          }
        };
        callback(motionData);
      });
    } catch (error) {
      console.error('Error configurando el listener de movimiento:', error);
    }
  }

  async stopMotionDetection() {
    try {
      if (this.accelListener) {
        await this.accelListener.remove();
      }
    } catch (error) {
      console.error('Error removiendo el listener de movimiento:', error);
    }
  }
}