import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
    selector: 'app-rxjs',
    templateUrl: './rxjs.component.html',
    styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor() {

        // Usamos el retry en el observable para que siga promando el número de veces que queramos.
        this.subscription = this.regresaObservable().pipe(
            retry(2)
        ).subscribe(
            numero => console.log('Subscipción: ', numero),
            error => console.log('Error en el obs', error),
            () => console.log('El observador termino!')
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    regresaObservable(): Observable<any> {

        return new Observable((observer: Subscriber<any>) => {

            let contador = 0;

            const intervalo = setInterval(() => {

                contador++;

                const salida = {
                    valor: contador
                };

                observer.next(salida);

                // Mostramos solo hasta tres.
                // if (contador === 3) {
                //     clearInterval(intervalo);
                //     observer.complete();
                // }
                // Si activamos el clear solo pasará dos veces por aquí.
                // if (contador === 2) {
                // clearInterval(intervalo);
                //     observer.error('Auxilio!');
                // }
            }, 1000);
            // mapeo de datos.
        }).pipe(
            map(resp => resp.valor),
            // Metemos un filtro para que muestre solo impares.
            filter((valor, index) => {
                if ((valor % 2)) {
                    // Impar
                    return true;
                } else {
                    // Par
                    return false;
                }
            })
        );
    }

}
