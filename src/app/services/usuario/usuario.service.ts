import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import 'rxjs/add/operator/map';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    usuario: Usuario;
    token: string;

    constructor(
        public http: HttpClient,
        public router: Router,
        public subirArchivo: SubirArchivoService
    ) {
        this.cargarStorage();
    }

    estaLogueado() {
        // Comprobamos que este logueado.
        return (this.token.length > 5) ? true : false;
    }

    cargarStorage() {
        // Función para cargar del storage los datos si los tuviese.
        if (localStorage.getItem('token')) {
            this.token = localStorage.getItem('token');
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
        } else {
            this.token = '';
            this.usuario = null;
        }
    }

    guardarStorage(id: string, token: string, usuario: Usuario) {
        // Guardamos datos en el localStorage.
        localStorage.setItem('id', id);
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Seteamos los datos.
        this.usuario = usuario;
        this.token = token;
    }

    logout() {
        // Borramos variables, storage y redireccionamos a login.
        this.usuario = null;
        this.token = '';

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        this.router.navigate(['/login']);
    }

    loginGoogle(token: string) {
        // Sacamos el token de Google.
        const url = URL_SERVICIOS + '/login/google';

        return this.http.post(url, { token })
            .map((resp: any) => {
                this.guardarStorage(resp.id, resp.token, resp.usuario);

                return true;
            });
    }

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
                this.guardarStorage(resp.id, resp.token, resp.usuario);

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

    actualizarUsuario(usuario: Usuario) {
        // Llamada a usuario.
        let url = URL_SERVICIOS + '/usuario/' + usuario._id;
        // Mandamos el token por el url.
        url += '?token=' + this.token;

        return this.http.put(url, usuario)
            .map((resp: any) => {
                if (usuario._id === this.usuario._id) {
                    const usuarioDB: Usuario = resp.usuario;
                    this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
                }
                swal('Usuario actualizado', usuario.nombre, 'success');

                return true;
            });
    }

    cambiarImagen(archivo: File, id: string) {
        this.subirArchivo.subirArchivo(archivo, 'usuarios', id)
            .then((resp: any) => {
                this.usuario.img = resp.usuario.img;
                swal('Imagen Actualizada', this.usuario.nombre, 'success');

                this.guardarStorage(id, this.token, this.usuario);
            })
            .catch(resp => {
                console.log(resp);
            });
    }

    cargarUsuarios(desde: number = 0) {
        const url = URL_SERVICIOS + '/usuario?desde=' + desde;

        return this.http.get(url);
    }

    buscarUsuarios(termino: string) {
        const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

        return this.http.get(url)
            .map((resp: any) => resp.usuarios);
    }

    borrarUsuario(id: string) {

        let url = URL_SERVICIOS + '/usuario/' + id;
        url += '?token=' + this.token;

        return this.http.delete(url)
            .map(resp => {
                swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
                return true;
            });

    }
}
