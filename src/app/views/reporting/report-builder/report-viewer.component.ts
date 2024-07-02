/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ReportGroup, ReportType, ReportQuery, ReportData, EmptyReportData, EmptyReportQuery,
         EmptyReportType } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum ReportViewerEventType {
  REPORT_ENTRY_CLICKED = 'ReportViewerComponent.Event.ReportEntryClicked',
  EXPORT_DATA_CLICKED  = 'ReportViewerComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-trade-report-viewer',
  templateUrl: './report-viewer.component.html',
})
export class ReportViewerComponent implements OnChanges {

  @Input() reportGroup: ReportGroup;

  @Input() reportQuery: ReportQuery = Object.assign({}, EmptyReportQuery);

  @Input() selectedReportType: ReportType = EmptyReportType;

  @Input() reportData: ReportData = Object.assign({}, EmptyReportData);

  @Input() queryExecuted = false;

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Output() reportViewerEvent = new EventEmitter<EventInfo>();

  reportGroupName = '';

  cardHint = 'Seleccionar los filtros';

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.reportGroup) {
      this.setReportGroupName();
    }

    if (changes.queryExecuted) {
      this.setText();
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.reportViewerEvent, ReportViewerEventType.REPORT_ENTRY_CLICKED,
          {reportEntry: event.payload.entry});
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.isLoading) {
          return;
        }
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        sendEvent(this.reportViewerEvent, ReportViewerEventType.EXPORT_DATA_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupName() {
    switch (this.reportGroup) {
      case ReportGroup.Inventory:
        this.reportGroupName = 'de almacén';
        return;

      default:
        this.reportGroupName = '';
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint =  'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.selectedReportType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.selectedReportType.name} - ${this.reportData.entries.length} ` +
      `registros encontrados`;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
