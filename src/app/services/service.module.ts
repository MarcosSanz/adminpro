import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsService, SidebarService, SharedService, UsuarioService, LoginGuardGuard, SubirArchivoService } from './service.index';
import { ModalUploadComponent } from '../componentes/modal-upload/modal-upload.component';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        SettingsService,
        SidebarService,
        SharedService,
        UsuarioService,
        LoginGuardGuard,
        SubirArchivoService,
        ModalUploadComponent
    ],
    declarations: []
})
export class ServiceModule { }
