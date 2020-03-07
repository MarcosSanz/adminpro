import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare const gapi: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    recuerdame = false;
    email: string;
    auth2: any;

    constructor(
        public router: Router,
        public usuarioService: UsuarioService
    ) { }

    ngOnInit(): void {
        // Fijamos el mail si está recordado en el localstorage.
        this.googleInit();
        this.email = localStorage.getItem('email') || '';
        if (this.email.length > 1) {
            this.recuerdame = true;
        }
    }

    googleInit() {
        // Autorización de Google.
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '361759443978-gqg4m7uchreus416gjbiv3nmiiuceodm.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });

            this.attachSignin(document.getElementById('btnGoogle'));
        });
    }

    attachSignin(element) {
        // Autorización de Google.
        this.auth2.attachClickHandler(element, {}, (googleUser) => {
            const token = googleUser.getAuthResponse().id_token;
            // Pasamos el token desde el servicio.
            this.usuarioService.loginGoogle(token)
            .subscribe(() => this.router.navigate(['/dashboard']));
        });
    }

    ingresar(forma: NgForm) {

        if (forma.invalid) {
            return;
        }
        // Comprobar si el usuario está recordado.
        const usuario = new Usuario(null, forma.value.email, forma.value.password);
        this.usuarioService.login(usuario, forma.value.recuerdame)
            .subscribe(correcto => this.router.navigate(['/dashboard']));
    }

}
