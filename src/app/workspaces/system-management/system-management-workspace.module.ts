/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { AccessControlModule } from '@app/views/_access-control/access-control.module';

import { SystemManagementWorkspaceRoutingModule } from './system-management-workspace-routing.module';

import { ControlPanelMainPageComponent } from './control-panel-main-page.component';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AccessControlModule,

    SystemManagementWorkspaceRoutingModule,
  ],

  declarations: [
    ControlPanelMainPageComponent,
  ],

  exports: [

  ]

})
export class SystemManagementWorkspaceModule { }
