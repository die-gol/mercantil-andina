import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, Pipe, PipeTransform, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl, AsyncValidatorFn, ValidatorFn, FormControl, ValidationErrors} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { IUser } from './../wizard/models/user.model';
import { CommonService } from './../wizard/wizard.service';
import {map, switchMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import { MatStepper } from '@angular/material/stepper';

export class ValidateUserNotTaken {
  static userExistsValidator(user: CommonService) {
    
    return (control: AbstractControl) => {
      return user.existUser(control.value).pipe(
        map(res => res ? {exist:true} : null)
    );
    };
    
  }
}

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  firstFormGroup: FormGroup;
  public provinciasArray = [];
  public municipiosArray = [];
  public userExist: any;
  score: string = 'puntaje';
  public entity: IUser = Object();
  minDate: Date;
  maxDate: Date;

  @Input() stepper: any;

  constructor(private _formBuilder: FormBuilder, 
              private service: CommonService, 
              private toastr: ToastrService) 
              {

                const currentYear = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
                const hoy = formatDate(new Date(), 'yyyy/MM/dd', 'en');
                const str = hoy;
                const day = Number(str.substring(8,10));
                
                this.minDate = new Date(currentYear - 99, month, day);
                this.maxDate = new Date(currentYear - 18, month, day);
              }

  ngOnInit() {
    this.startForms();
    this.getProvincias();
  }

  startForms(){
    this.firstFormGroup = this._formBuilder.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: [''],
      phone: [''],
      date: ['', Validators.required],
      user: ['', Validators.required, ValidateUserNotTaken.userExistsValidator(this.service)],
      //user: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
       ]],
      selectedPID: [''],
      selectedMID: [''],
      address: ['', Validators.required],
    });

  }

  get f(){
    return this.firstFormGroup?.controls;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  lettersOnly(evt:any) {
    evt = (evt) ? evt : event;
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
       ((evt.which) ? evt.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
       (charCode < 97 || charCode > 122)) {
       return false;
    }
    return true;
  }

  onNextFirstForm() {
    if (this.firstFormGroup.valid) {
        this.stepper.next();
    }
  }

  getProvincias(){
    this.service.getProvincias().subscribe(res => {
      this.provinciasArray = res.provincias;

      this.provinciasArray = this.provinciasArray.sort((obj1:any, obj2:any) => {
        if (obj1.nombre > obj2.nombre)
            return 1;

        if (obj1.nombre < obj2.nombre)
            return -1;
    
        return 0;
      });


    });
    
  }

  changeProvincia(ev: any){
    if(ev){
      this.service.getMunicipio(ev).subscribe(res => {
        this.municipiosArray = res.municipios;

        this.municipiosArray = this.municipiosArray.sort((obj1:any, obj2:any) => {
          if (obj1.nombre > obj2.nombre)
              return 1;
  
          if (obj1.nombre < obj2.nombre)
              return -1;
      
          return 0;
        });
      });
    }
  }
  

 
}
