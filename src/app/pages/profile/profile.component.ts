import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styles: []
})
export class ProfileComponent implements OnInit {

    usuario: Usuario;
    imagenSubir: File;
    imagenTemp: string | ArrayBuffer;

    constructor(
        public usuarioService: UsuarioService
    ) {
        this.usuario = this.usuarioService.usuario;
    }

    ngOnInit(): void {
    }

    guardar(usuario: Usuario) {

        // Actualizamos los datos del usuario.
        this.usuario.nombre = usuario.nombre;
        // Si es de Google no se podrá actualizar.
        if (!this.usuario.google) {
            this.usuario.email = usuario.email;
        }

        // Recuperamos respuesta del servicio actualizado.
        this.usuarioService.actualizarUsuario(this.usuario)
            .subscribe();
    }

    seleccionImagen(archivo: File) {

        if (!archivo) {
            this.imagenSubir = null;
            return;
        }

        // Si no es una imagen.
        if (archivo.type.indexOf('image') < 0) {
            swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
            this.imagenSubir = null;
            return;
        }

        // Setear la imagen.
        this.imagenSubir = archivo;

        const reader = new FileReader();
        const urlImagenTemp = reader.readAsDataURL(archivo);

        reader.onloadend = () => this.imagenTemp = reader.result;
    }

    cambiarImagen() {
        this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
    }

}
