import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComputedSignalss } from './computed-signalss/computed-signalss';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComputedSignalss],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular21');

}
