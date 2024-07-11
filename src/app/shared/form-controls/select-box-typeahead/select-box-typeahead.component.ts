/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output,
         SimpleChanges, TemplateRef, forwardRef } from '@angular/core';

import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, delay, distinctUntilChanged, filter, map, of,
         switchMap, tap } from 'rxjs';

import { EmpObservable, Identifiable, isEmpty } from '@app/core';

import { SearcherAPIS, SearcherDataService } from '@app/data-services/_searcher.data.service';

import { DataTableQuery, EmptyDataTable } from '@app/models';


export interface SelectBoxTypeaheadConfig {
  bindByValue?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  searchByQuery?: boolean;
  virtualScroll?: boolean;
  minTermLength?: number;
}


const DefaultSelectBoxTypeaheadConfig: SelectBoxTypeaheadConfig = {
  bindByValue: true,
  clearable: false,
  multiple: false,
  searchByQuery: false,
  virtualScroll: false,
  minTermLength: 4,
};

@Component({
  selector: 'emp-ng-select-typeahead',
  templateUrl: './select-box-typeahead.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxTypeaheadComponent),
      multi: true
    }
  ]
})

export class SelectBoxTypeaheadComponent implements ControlValueAccessor, OnInit, OnChanges {

  @ContentChild('tLabelTemplate', { read: TemplateRef }) tLabelTemplate: TemplateRef<any>;

  @ContentChild('tOptionTemplate', { read: TemplateRef }) tOptionTemplate: TemplateRef<any>;

  @Input() searcherAPI: SearcherAPIS = null;

  @Input() isRequired = false;

  @Input() placeholder = 'Buscar...';

  @Input() showError = false;

  @Input() initialValue: any = null;

  @Input() bindLabel = 'name';

  @Input() bindValue = 'uid';

  @Input() initQuery: DataTableQuery = {};

  @Input()
  get config() {
    return this.selectBoxTypeaheadConfig;
  }
  set config(value: SelectBoxTypeaheadConfig) {
    this.selectBoxTypeaheadConfig = Object.assign({}, DefaultSelectBoxTypeaheadConfig, value);
  }

  @Output() changes = new EventEmitter<any>();

  @Output() clear = new EventEmitter<boolean>();

  @Output() search = new EventEmitter<any>();

  @Output() unfocus = new EventEmitter<any>();

  selectBoxTypeaheadConfig = DefaultSelectBoxTypeaheadConfig;

  formControl: FormControl;

  searcherList$: Observable<any[]>;

  searcherTerm$ = new Subject<string>();

  isLoading = false;

  onChange: any = () => { };

  onTouched: any = () => { };


  constructor(private searcherData: SearcherDataService,
              private cdr: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialValue) {
      this.subscribeSearcherList();
    }
  }


  ngOnInit() {
    this.initFormControl();
    this.subscribeSearcherList();
  }


  writeValue(value: any) {
    this.formControl.setValue(value ? value : null, { emitEvent: false });
    this.subscribeSearcherList();
  }


  registerOnChange(fn: any) {
    this.onChange = fn;
  }


  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }


  onChangedEvent(event) {
    this.changes.emit(event);
  }


  onClear() {
    this.clear.emit(true);
  }

  onSearch(event) {
    this.search.emit(event);
  }

  onUnfocus(event) {
    this.unfocus.emit(event);
  }


  resetSearcherData() {
    this.subscribeSearcherList();
    this.formControl.reset(null);
  }


  resetValue() {
    this.formControl.reset(null);
  }


  private initFormControl() {
    this.formControl = new FormControl(null);

    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }


  private subscribeSearcherList() {
    let initialList$: Observable<any[]> = of(isEmpty(this.initialValue) ? [] : [this.initialValue]);

    this.searcherList$ = concat(
      initialList$,
      this.searcherTerm$.pipe(
        filter(keywords => keywords !== null && keywords.trim().length >= this.config.minTermLength),
        map(keywords => keywords.trim()),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.setIsLoading(true)),
        switchMap(keywords =>
          this.searchData(keywords)
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.setIsLoading(false))
            ))
      )
    );
  }


  private searchData(keywords: string): EmpObservable<Identifiable[]> {
    if (this.config.searchByQuery) {
      const query = Object.assign({}, this.initQuery, { keywords });
      return this.searcherData.searchDataByQuery(this.searcherAPI, query);
    } else {
      return this.searcherData.searchData(this.searcherAPI, keywords)
    }
  }


  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.cdr.detectChanges();
  }

}
