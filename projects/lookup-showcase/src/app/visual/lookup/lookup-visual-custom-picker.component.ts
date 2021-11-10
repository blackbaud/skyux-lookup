import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyModalInstance } from '@skyux/modals';

import { SkyLookupShowMoreCustomPickerContext } from 'projects/lookup/src/public-api';

@Component({
  selector: 'lookup-visual-custom-picker',
  templateUrl: './lookup-visual-custom-picker.component.html',
})
export class LookupVisualCustomPickerComponent implements OnInit {
  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public context: SkyLookupShowMoreCustomPickerContext,
    public modalInstance: SkyModalInstance
  ) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      selectLast: new FormControl(false),
    });
  }
}
