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
import { TiktokComponent } from './proyectos/personales/tiktok/tiktok.component';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'conoceme', component: ConocemeComponent },
  { path: 'cv', component: CvComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'proyectos/personales', component: PersonalesComponent },
  { path: 'proyectos/escolares', component: EscolaresComponent },
  { path: 'proyectos/personales/tiktok', component: TiktokComponent },
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
    TiktokComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
