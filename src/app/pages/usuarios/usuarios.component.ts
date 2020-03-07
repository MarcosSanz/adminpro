import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/componentes/modal-upload/modal-upload.service';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styles: []
})
export class UsuariosComponent implements OnInit {

    usuarios: Usuario[] = [];
    desde = 0;
    totalRegistros = 0;
    cargando = true;

    constructor(
        public usuarioService: UsuarioService,
        public modalUploadService: ModalUploadService
    ) { }

    ngOnInit(): void {
        this.cargarUsuarios();
        this.modalUploadService.notificacion
            .subscribe((resp: any) => this.cargarUsuarios());
    }

    mostrarModal(id: string) {
        this.modalUploadService.mostrarModal('usuarios', id);
    }

    cargarUsuarios() {
        this.cargando = true;

        this.usuarioService.cargarUsuarios(this.desde)
            .subscribe((resp: any) => {

                this.totalRegistros = resp.total;
                this.usuarios = resp.usuarios;

                this.cargando = false;
            });
    }

    cambiarDesde(valor: number) {
        const desde = this.desde + valor;
        console.log(desde);

        if (desde >= this.totalRegistros) {
            return;
        }

        if (desde < 0) {
            return;
        }

        this.desde += valor;
        this.cargarUsuarios();
    }

    buscarUsuario(termino: string) {

        if (termino.length >= 0) {
            this.cargarUsuarios();
            return;
        }

        this.cargando = true;

        this.usuarioService.buscarUsuarios(termino)
            .subscribe((usuarios: Usuario[]) => {

                this.usuarios = usuarios;
                this.cargando = false;
            });
    }

    borrarUsuario(usuario: Usuario) {

        if (usuario._id === this.usuarioService.usuario._id) {
            swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
            return;
        }

        swal.fire({
            title: '¿Esta seguro?',
            text: 'Esta a punto de borrar a ' + usuario.nombre,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, bórralo!'
        })
            .then(borrar => {
                if (borrar) {
                    this.usuarioService.borrarUsuario(usuario._id)
                        .subscribe(borrado => {
                            this.cargarUsuarios();
                        });
                }
            });
    }

    guardarUsuario(usuario: Usuario) {
        this.usuarioService.actualizarUsuario(usuario)
            .subscribe();
    }

}
