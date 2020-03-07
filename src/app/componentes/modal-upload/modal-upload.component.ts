import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import swal from 'sweetalert';
import { ModalUploadService } from './modal-upload.service';

@Component({
    selector: 'app-modal-upload',
    templateUrl: './modal-upload.component.html',
    styles: []
})
export class ModalUploadComponent implements OnInit {

    imagenSubir: File;
    imagenTemp: string | ArrayBuffer;

    constructor(
        public subirArchivoService: SubirArchivoService,
        public modalUploadService: ModalUploadService
    ) { }

    ngOnInit(): void {
    }

    cerrarModal() {
        this.imagenTemp = null;
        this.imagenSubir = null;

        this.modalUploadService.ocultarModal();
    }

    seleccionImage(archivo: File) {

        if (!archivo) {
            this.imagenSubir = null;
            return;
        }

        if (archivo.type.indexOf('image') < 0) {
            swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
            this.imagenSubir = null;
            return;
        }

        this.imagenSubir = archivo;

        const reader = new FileReader();
        const urlImagenTemp = reader.readAsDataURL(archivo);

        reader.onloadend = () => this.imagenTemp = reader.result;

    }

    subirImagen() {

        this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
            .then(resp => {

                this.modalUploadService.notificacion.emit(resp);
                this.cerrarModal();
            })
            .catch(err => {
                console.log('Error en la carga... ');
            });
    }
}
