import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl, AsyncValidatorFn, ValidatorFn, FormControl} from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { IUser } from './../wizard/models/user.model';
import { CommonService } from './../wizard/wizard.service';
import {map, switchMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { VehicleDataComponent } from '../vehicle-data/vehicle-data.component';
import { CoverageComponent } from '../coverage/coverage.component';

@Component({
  selector: 'app-wi', 
  templateUrl: './wi.component.html',
  styleUrls: ['./wi.component.scss']
})
export class WiComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  public coverageArray = [];
  public entity: IUser = Object();
  public coverageSelected: any;
  stepperOrientation: Observable<StepperOrientation>;
  isLinear = false;

  @ViewChild('stepper') stepper: { next: () => void; };
  @ViewChild('stepper') step: MatStepper;
  @ViewChild(PersonalInfoComponent) personalInfo: any;
  @ViewChild(VehicleDataComponent) vehicleData: any;
  @ViewChild(CoverageComponent) coverage: any;

  constructor(private _formBuilder: FormBuilder, 
              private service: CommonService, 
              private toastr: ToastrService,
              breakpointObserver: BreakpointObserver) 
              {
                this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
                .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

              }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.firstFormGroup = this.personalInfo.firstFormGroup;
    this.secondFormGroup = this.vehicleData.secondFormGroup;
    this.coverageSelected = this.coverage.coverageSelected;
  }

  next(event: StepperSelectionEvent) {
    console.log(event.selectedIndex);
    if (event.selectedIndex == 1) {
      this.setEntityStep1();
    }
    if (event.selectedIndex == 2) {
      this.setEntityStep2();
    }
    if (event.selectedIndex == 3) {
      console.log(this.coverageSelected);
      this.setEntityStep3(this.coverageSelected[0]);
    }
   
  }

  updateValue(val: any) {
    this.coverageSelected = val;
  }

  setEntityStep1(){
    this.entity.dni = this.firstFormGroup.controls.dni.value;
    this.entity.nombre = this.firstFormGroup.controls.name.value;
    this.entity.apellido = this.firstFormGroup.controls.lastName.value;
    this.entity.telefono = this.firstFormGroup.controls.phone.value;
    this.entity.celular = this.firstFormGroup.controls.mobile.value;
    this.entity.nacimiento = this.firstFormGroup.controls.date.value;
    this.entity.usuario = this.firstFormGroup.controls.user.value;
    this.entity.contraseña = this.firstFormGroup.controls.password.value;
    this.entity.location = Object();
    this.entity.location.provincia = this.firstFormGroup.controls.selectedPID.value;
    this.entity.location.ciudad = this.firstFormGroup.controls.selectedMID.value;
    this.entity.location.domicilio = this.firstFormGroup.controls.address.value;
    console.log(this.entity);
  }

  
  setEntityStep2(){
    this.entity.vehiculo = Object();
    this.entity.vehiculo.ano = this.secondFormGroup.controls.year.value;
    this.entity.vehiculo.marca = this.secondFormGroup.controls.brand.value;
    this.entity.vehiculo.modelo = this.secondFormGroup.controls.model.value;
    this.entity.vehiculo.version = this.secondFormGroup.controls.version.value;
    console.log(this.entity);
  }
  

  setEntityStep3(coverageObject: any){
    this.entity.cobertura = Object();
    this.entity.cobertura.numero = coverageObject.numero;
    this.entity.cobertura.codigoProducto = coverageObject.codigoProducto;
    this.entity.cobertura.producto = coverageObject.producto;
    this.entity.cobertura.titulo = coverageObject.titulo;
    this.entity.cobertura.texto = coverageObject.texto;
    this.entity.cobertura.descripcion = coverageObject.descripcion;
    this.entity.cobertura.costo = coverageObject.costo;
    this.entity.cobertura.puntaje = coverageObject.puntaje;
    this.entity.cobertura.granizo = coverageObject.granizo;
    this.entity.cobertura.franquicia = coverageObject.franquicia;

    console.log(this.entity);
  }
  
  goStep1(index: number) {
    this.step.selectedIndex = index;
}
  
  enviar(){
    if(this.firstFormGroup.valid && this.secondFormGroup.valid && this.coverageSelected && this.coverageSelected?.length > 0)
      this.toastr.success('Enviado correctamente');
    else  
    this.toastr.error('Debe completar los campos obligatorios');
  }
  
}