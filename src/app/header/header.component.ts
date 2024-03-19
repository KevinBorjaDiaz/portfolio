import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Output() Seccion = new EventEmitter<string>();
    
  activado = 'inicio';

  onSelect(seccion: string){
    this.Seccion.emit(seccion);
    this.activado = seccion;
    console.log(seccion)
  }
  
}
