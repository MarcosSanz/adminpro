import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import 'rxjs/add/operator/map';
import swal from 'sweetalert';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(
        public http: HttpClient
    ) { }

    login(usuario: Usuario, recordar: boolean = false) {

        // Recordar datos del mail si pulsamos recuerdame.
        if (recordar) {
            localStorage.setItem('email', usuario.email);
        } else {
            localStorage.removeItem('email');
        }

        const url = URL_SERVICIOS + '/login';
        return this.http.post(url, usuario)
            .map((resp: any) => {
                localStorage.setItem('id', resp.id);
                localStorage.setItem('token', resp.token);
                localStorage.setItem('usuario', JSON.stringify(resp.usuario));

                return true;
            });
    }

    crearUsuario(usuario: Usuario) {

        const url = URL_SERVICIOS + '/usuario';

        return this.http.post(url, usuario)
            .map((resp: any) => {

                swal('Usuario creado', usuario.email, 'success');
                return resp.usuario;
            });
    }
}
