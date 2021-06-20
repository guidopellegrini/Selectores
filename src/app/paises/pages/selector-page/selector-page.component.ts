import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : [ '', Validators.required],
    pais    : [ '', Validators.required],
    frontera: [ '', Validators.required],
  })

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(

        tap( (_) => {
          this.miFormulario.get('pais')?.reset('');
          this.paises = [];
          this.cargando = true;
        }),

        switchMap( region => this.paisesService.getPaisesPorRegion(region) )
      )

      .subscribe( paises => { 
        this.paises = paises || []
        this.cargando = false;
      })

      // cuando cambie el pais
      this.miFormulario.get('pais')?.valueChanges
      .pipe(

        tap( (_) => {
          this.miFormulario.get('frontera')?.reset('');
          this.fronteras = [];
          this.cargando = true;
        }),

        switchMap( paisAlpha => this.paisesService.getPaisPorCodigo(paisAlpha) ),

        switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ))
      )

      .subscribe( paises => { 
        this.fronteras = paises;
        this.cargando = false;
      })

  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
