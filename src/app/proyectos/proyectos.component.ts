import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrl: './proyectos.component.css',
    standalone: false
})
export class ProyectosComponent {
    constructor(public router: Router ) {}

    get showBack(): boolean {
        return this.router.url.includes('/proyectos/');
    }
}
