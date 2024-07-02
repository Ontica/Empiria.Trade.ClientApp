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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { ReportViewerComponent } from './report-builder/report-viewer.component';

import {
  InventoryReportFilterComponent
} from './report-builder/reports-filters/inventory-report-filter.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    ReportBuilderComponent,
    ReportViewerComponent,

    InventoryReportFilterComponent,
  ],
  exports: [
    ReportBuilderComponent,
  ]
})
export class ReportingModule { }
