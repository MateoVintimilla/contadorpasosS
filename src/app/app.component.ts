import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionComponent } from './components/motion/motion.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MotionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
