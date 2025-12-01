import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { CvComponent } from './cv/cv.component';
import { ConocemeComponent } from './conoceme/conoceme.component';
import { ContactoComponent } from './contacto/contacto.component';
import { TiktokComponent } from './proyectos/tiktok/tiktok.component';
import { WordleComponent } from './proyectos/wordle/wordle.component';

const appRoutes: Routes = [
  { path: 'inicio', component: InicioComponent },

  { path: 'proyectos', component: ProyectosComponent },
  { path: 'proyectos/tiktok', component: TiktokComponent },
  { path: 'proyectos/wordle', component: WordleComponent },

  { path: 'conoceme', component: ConocemeComponent },
  { path: 'cv', component: CvComponent },
  { path: 'contacto', component: ContactoComponent },
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
    TiktokComponent,
    WordleComponent,
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
