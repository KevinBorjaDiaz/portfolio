import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: false,
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})

export class TimerComponent {
  time1 : number | undefined;
  time2 : number | undefined;
  cycles : number | undefined;
  offset : number | undefined;
  waiting = false;

  phase1 = "Phase 1"
  phase2 = "Phase 2"
  
  time = 0;
  counter = 0;
  currentPhase = this.phase1;

  startTime = 0;
  running = false;

  async start() {
    if (!this.time1 || !this.time2) return;

    this.counter = 0;

    await this.startCycle();
  }

  startPhase() {
    this.startTime = performance.now();
    this.running = true;
    this.loop();
  }

  loop() {
    if (!this.running) return;
    
    const now = performance.now();
    const elapsed = now - this.startTime;

    const limit = this.currentPhase === this.phase1
      ? this.time1 ?? 0
      : this.time2 ?? 0;

    this.time = elapsed / 1000;

    if (elapsed >= limit * 1000) {
      this.beep();
      console.log("beep");
      if (this.currentPhase === this.phase1) {
        this.currentPhase = this.phase2;
      } else if (this.cycles != undefined && this.counter == this.cycles - 1){
        this.counter++;
        this.stop();
        return;
      }
      else {
        this.counter++;
        this.startCycle();
        return;
      }

      this.startPhase();
      return;
    }

    requestAnimationFrame(() => this.loop());
  }

  stop() {
    this.running = false;
  }

  beep() {
    const audio = new Audio('assets/beep.m4a');
    audio.play().catch(() => {});
  }

  async startCycle() {
    this.running = false;

    const offset = this.offset;
    if (offset != null) {
      this.waiting = true;

      await new Promise(resolve => 
        setTimeout(resolve, offset * 1000)
      );

      this.beep();
      this.waiting = false;
    }

    this.currentPhase = this.phase1;
    this.startPhase();
  }
}