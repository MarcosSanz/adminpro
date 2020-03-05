import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit {

  constructor() {

    const obs = new Observable(observer => {

      let contador = 0;

      const intervalo = setInterval(() => {

        contador += 1;
        observer.next(contador);

        if (contador === 3) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (contador === 2) {
          observer.error('Error');
        }
      }, 1000);
    });

    obs.subscribe(
      numero => console.log('Subscipción: ', numero),
      error => console.log('Error en el obs', error),
      () => console.log('El observador termino!')
    );

  }

  ngOnInit(): void {
  }

}
