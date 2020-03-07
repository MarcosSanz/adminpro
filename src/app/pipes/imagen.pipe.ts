import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
    name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

    transform(img: string, tipo: string = 'usuario'): any {

        let url = URL_SERVICIOS + '/img';

        if (!img) {
            return url + '/usuarios/xxx';
        }

        // Si viene una imagen de google usamos esa.
        if (img.indexOf('https') >= 0) {
            return img;
        }

        if (img.indexOf('base64') >= 0) {
            return img;
        }

        // Si no viene de google puede ser tres tipos.
        switch (tipo) {
            case 'usuario':
                url += '/usuarios/' + img;
                break;

            case 'medico':
                url += '/medicos/' + img;
                break;

            case 'hospital':
                url += '/hospitales/' + img;
                break;

            default:
                console.log('Tipo de imagen no existe');
                url += '/usuarios/xxx';
        }

        return url;
    }

}
