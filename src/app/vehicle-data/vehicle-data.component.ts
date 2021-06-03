import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
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
  selector: 'app-vehicle-data',
  templateUrl: './vehicle-data.component.html',
  styleUrls: ['./vehicle-data.component.scss']
})
export class VehicleDataComponent implements OnInit {

  secondFormGroup: FormGroup;
  public last20Years: string[] = new Array<string>();
  public brandsArray = [];
  public idMarca = null;
  public year = null;
  public modelsArray = [];
  public idModelo = null;
  public versionsArray = [];
  public entity: IUser = Object();

  @Input() stepper: any;

  constructor(private _formBuilder: FormBuilder, 
    private service: CommonService, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.startForms();
    this.getLast20Years();
    this.getBrands();
  
  }

  startForms(){
    this.secondFormGroup = this._formBuilder.group({
      brand: ['', Validators.required],
      year: ['', Validators.required],
      model: ['', Validators.required],
      version: ['']
    });
  }

  get s(){
    return this.secondFormGroup?.controls;
  }

  getLast20Years(){
    this.last20Years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007",
      "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017",
      "2018", "2019", "2020", "2021"];
  }

  getBrands(){
    this.service.getBrands().subscribe(res => {
      this.brandsArray = res;
    });
    
  }

  changeYear(ev: any){
    this.year = ev;
    if(ev && this.idMarca){
      this.getModelos();
    }
  }  

  changeMarca(ev: any){
    this.idMarca = ev;
    if(ev && this.year){
      this.getModelos();
    }
  }

  getModelos(){
    this.service.getModelos(this.idMarca, this.year).subscribe(res => {
      this.modelsArray = res;
    });
  }

  changeModel(ev: any){
    this.idModelo = ev;
    if(ev && this.year && this.idMarca){
      this.getVersions();
    }
  }

  getVersions(){
    this.service.getVersiones(this.idMarca, this.year, this.idModelo).subscribe(res => {
      this.versionsArray = res;
    });
  }

  onNextSecondForm() {
    if (this.secondFormGroup.valid) {
        this.stepper.next();
    }
  }

}
