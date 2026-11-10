import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-computed-signalss',
  imports: [],
  templateUrl: './computed-signalss.html',
  styleUrl: './computed-signalss.css',
})
export class ComputedSignalss {
  height = signal(100);
  width = signal(20);
  area = computed(() => this.height() * this.width());

  constructor(){
    effect(() =>{
      // console.log("area is:- ", this.area());
      console.log("is updating?");
    });
  }

  updateHeight() {
    this.height.set(this.height() + 10);
  }
}
