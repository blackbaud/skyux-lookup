import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyAutofillDirective
} from '@skyux/forms';

import {
  fromEvent as observableFromEvent,
  Observable,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyAutocompleteInputTextChange
} from './types/autocomplete-input-text-change';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_AUTOCOMPLETE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true
};

const SKY_AUTOCOMPLETE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: 'input[skyAutocomplete], textarea[skyAutocomplete]',
  providers: [
    SKY_AUTOCOMPLETE_VALUE_ACCESSOR,
    SKY_AUTOCOMPLETE_VALIDATOR
  ]
})
export class SkyAutocompleteInputDirective implements AfterViewInit, OnInit, OnDestroy, ControlValueAccessor, Validator {

  /**
   * Indicates whether to disable the autocomplete field.
   * @default "false"
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      value
    );
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public get blur(): Observable<void> {
    return this._blur.asObservable();
  }

  public get displayWith(): string {
    return this._displayWith;
  }

  public set displayWith(value: string) {
    this._displayWith = value;
    this.inputTextValue = this.getValueByKey();
  }

  public get inputTextValue(): string {
    return this.elementRef.nativeElement.value;
  }

  public set inputTextValue(value: string) {
    this.elementRef.nativeElement.value = value || '';
  }

  public get textChanges(): Observable<SkyAutocompleteInputTextChange> {
    return this._textChanges.asObservable();
  }

  public get value(): any {
    return this._value;
  }

  public set value(value: any) {
    const isNewValue = value !== this._value;

    /* istanbul ignore else */
    if (isNewValue) {
      this._value = value;
      this.inputTextValue = this.getValueByKey();
      this.onChange(this._value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }
    }
  }

  private control: AbstractControl;

  private isFirstChange: boolean = true;

  private ngUnsubscribe = new Subject<void>();

  private _blur = new Subject<void>();

  private _disabled = false;

  private _displayWith: string;

  private _textChanges = new Subject<SkyAutocompleteInputTextChange>();

  private _value: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    this.setAttributes(element);

    observableFromEvent(element, 'keyup')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        /** Sanity check */
        if (!this.disabled) {
          this._textChanges.next({
            value: this.elementRef.nativeElement.value
          });
        }
      });

    observableFromEvent(element, 'blur')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        /** Sanity check */
        if (!this.disabled) {
          this.restoreInputTextValueToPreviousState();
          this.onTouched();
        }
      });

    observableFromEvent(element, 'change')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        /** Sanity check */
        if (!this.disabled) {
          this.isFirstChange = false;
        }
      });
  }

  public ngAfterViewInit(): void {
    const autofillDirective = new SkyAutofillDirective(this.elementRef, this.renderer);
    autofillDirective.skyAutofill = 'off';
    autofillDirective.ngOnInit();
  }

  public ngOnDestroy(): void {
    this._blur.complete();
    this._textChanges.complete();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this._blur =
      this._textChanges =
      this.ngUnsubscribe = undefined;
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }
    return;
  }

  // See: https://www.w3.org/TR/wai-aria-practices/#kbd_focus_activedescendant
  public setActiveDescendant(descendantId: string | null): void {
    if (descendantId) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'aria-activedescendant',
        descendantId
      );
    } else {
      this.renderer.removeAttribute(
        this.elementRef.nativeElement,
        'aria-activedescendant'
      );
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange(value: any): void { }
  /* istanbul ignore next */
  public onTouched(): void { }
  /* istanbul ignore next */
  public onValidatorChange = () => { };

  private setAttributes(element: any): void {
    this.renderer.setAttribute(element, 'autocapitalize', 'off');
    this.renderer.setAttribute(element, 'autocorrect', 'off');
    this.renderer.setAttribute(element, 'spellcheck', 'false');
    this.renderer.addClass(element, 'sky-form-control');
  }

  private restoreInputTextValueToPreviousState(): void {
    const modelValue = this.getValueByKey();

    // If the search field contains text, make sure that the value
    // matches the selected descriptor key.
    if (this.inputTextValue !== modelValue) {
      this.inputTextValue = modelValue;
    }

    this._blur.next();
  }

  private getValueByKey(): string {
    return this.value ? this.value[this.displayWith] : undefined;
  }
}
