/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';

import { AngularMaterialModule } from '../angular-material.module';

import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SharedContainersModule } from '../containers/shared-containers.module';
import { IconSvgModule } from '../icon-svg.module';

import { ButtonCopyToClipboardComponent } from './button-copy-to-clipboard/button-copy-to-clipboard.component';
import { CheckboxAllComponent } from './check-box-all/check-box-all.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { FileControlComponent } from './file-control/file-control.component';
import { FilePrintPreviewComponent } from './file-print-preview/file-print-preview.component';
import { InputNumericComponent } from './input-numeric/input-numeric.component';
import { MenuComponent } from './menu/menu.component';
import { MonthPickerComponent } from './date-range-picker/month-picker/month-picker.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { TextEditorComponent } from './text-editor/text-editor.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgSelectModule,
    SharedDirectivesModule,
    SharedPipesModule,
    SharedContainersModule,
    QuillModule.forRoot(),
    IconSvgModule,
  ],

  declarations: [
    ButtonCopyToClipboardComponent,
    CheckboxAllComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    FileControlComponent,
    FilePrintPreviewComponent,
    InputNumericComponent,
    MenuComponent,
    MonthPickerComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    TextEditorComponent,
  ],

  exports: [
    ButtonCopyToClipboardComponent,
    CheckboxAllComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    FileControlComponent,
    FilePrintPreviewComponent,
    InputNumericComponent,
    MenuComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    TextEditorComponent,
  ]

})
export class SharedFormControlsModule { }
