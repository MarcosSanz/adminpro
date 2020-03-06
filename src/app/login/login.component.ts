import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    recuerdame = false;
    email: string;

    constructor(
        public router: Router,
        public usuarioService: UsuarioService
    ) { }

    ngOnInit(): void {
        // Fijamos el mail si está recordado en el localstorage.
        this.email = localStorage.getItem('email') || '';
        if ( this.email.length > 1) {
            this.recuerdame = true;
        }
    }

    ingresar(forma: NgForm) {

        if (forma.invalid) {
            return;
        }

        const usuario = new Usuario(null, forma.value.email, forma.value.password);

        this.usuarioService.login(usuario, forma.value.recuerdame)
            .subscribe(correcto => this.router.navigate(['/dashboard']));
    }

}
