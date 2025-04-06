import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { CvComponent } from './cv/cv.component';
import { ConocemeComponent } from './conoceme/conoceme.component';
import { ContactoComponent } from './contacto/contacto.component';
import { Routes, RouterModule } from '@angular/router';
import { PersonalesComponent } from './proyectos/personales/personales.component';
import { EscolaresComponent } from './proyectos/escolares/escolares.component';

const appRoutes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'conoceme', component: ConocemeComponent },
  { path: 'cv', component: CvComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'proyectos/personales', component: PersonalesComponent },
  { path: 'proyectos/escolares', component: EscolaresComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    ProyectosComponent,
    CvComponent,
    ConocemeComponent,
    ContactoComponent,
    PersonalesComponent,
    EscolaresComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
