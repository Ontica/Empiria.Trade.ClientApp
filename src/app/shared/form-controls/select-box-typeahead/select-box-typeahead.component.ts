/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, delay, distinctUntilChanged, filter, map, of,
         switchMap, tap } from 'rxjs';

import { Identifiable, isEmpty } from '@app/core';

import { SearcherAPIS, SearcherDataService } from '@app/data-services/_searcher.data.service';


export interface SelectBoxTypeaheadConfig {
  bindByValue?: boolean;
  clearable?: boolean;
  virtualScroll?: boolean;
  minTermLength?: number;
}


const DefaultSelectBoxTypeaheadConfig: SelectBoxTypeaheadConfig = {
  bindByValue: true,
  clearable: false,
  virtualScroll: false,
  minTermLength: 4,
};

@Component({
  selector: 'emp-ng-select-typeahead ',
  templateUrl: './select-box-typeahead.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxTypeaheadComponent),
      multi: true
    }
  ]
})

export class SelectBoxTypeaheadComponent implements ControlValueAccessor, OnInit {

  @Input() searcherAPI: SearcherAPIS = null;

  @Input() isRequired = false;

  @Input() placeholder = 'Buscar...';

  @Input() showError = false;

  @Input() initialValue: Identifiable = null;

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

  searcherList$: Observable<Identifiable[]>;

  searcherTerm$ = new Subject<string>();

  isLoading = false;

  onChange: any = () => { };

  onTouched: any = () => { };


  constructor(private searcherData: SearcherDataService,
              private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.initFormControl();
    this.subscribeSearcherList();
  }


  writeValue(value: any) {
    if (value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
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


  private initFormControl() {
    this.formControl = new FormControl('');

    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }


  private subscribeSearcherList() {
    this.searcherList$ = concat(
      of(isEmpty(this.initialValue) ? [] : [this.initialValue]),
      this.searcherTerm$.pipe(
        filter(keyword => keyword !== null && keyword.trim().length >= this.config.minTermLength),
        map(keyword => keyword.trim()),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.setIsLoading(true)),
        switchMap(keyword =>
          this.searcherData.searchData(this.searcherAPI, keyword)
            .pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.setIsLoading(false))
            ))
      )
    );
  }


  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.cdr.detectChanges();
  }

}
