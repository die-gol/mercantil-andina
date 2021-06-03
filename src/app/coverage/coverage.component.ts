import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl, AsyncValidatorFn, ValidatorFn, FormControl} from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { IUser } from './../wizard/models/user.model';
import { CommonService } from './../wizard/wizard.service';
import {map, switchMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.scss']
})
export class CoverageComponent implements OnInit {

  thirdFormGroup: FormGroup;
  public coverageArray = [];
  score: string = 'puntaje';
  public entity: IUser = Object();
  public coverageSelected: any;

  @Input() stepper: any;
  @Output() editedEmitter = new EventEmitter<number>();

  constructor(private _formBuilder: FormBuilder, 
    private service: CommonService, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.startForms();
    this.getCoberturas();
  }

  startForms(){
    this.thirdFormGroup = this._formBuilder.group({
    });
  }
  
  getCoberturas(){
    this.service.getCoberturas().subscribe(res => {
      this.coverageArray = res;
    });
  }

  onNextThirdForm() {
    if (this.coverageSelected && this.coverageSelected?.length > 0 && this.coverageSelected?.length < 2) 
        this.stepper.next();
    else if (this.coverageSelected?.length > 1)
      this.toastr.error('Debe seleccionar solo una cobertura');  
    else 
      this.toastr.error('Debe seleccionar una cobertura');  
  }

  onGroupsChange(options: MatListOption[]) {
    // map these MatListOptions to their values
    this.coverageSelected = options.map(o => o.value);
    //this.setEntityStep3(this.coverageSelected[0]);
    this.editedEmitter.emit(this.coverageSelected);
  } 

}
