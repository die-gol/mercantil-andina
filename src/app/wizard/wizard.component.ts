import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl, AsyncValidatorFn, ValidatorFn, FormControl} from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { IUser } from './models/user.model';
import { CommonService } from './wizard.service';
import {map, switchMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import { MatStepper } from '@angular/material/stepper';

/*
export class ValidateUserNotTaken {
  static userExistsValidator(user: CommonService) {
    
    return (control: AbstractControl) => {
      return user.existUser(control.value).pipe(
        map(res => res ? null : {exist:true})
    );
    };
    
  }
}
*/

@Component({
  selector: 'app-wizard', 
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = false;
  isLinear = false;
  public provinciasArray = [];
  public municipiosArray = [];
  public last20Years: string[] = new Array<string>();
  public brandsArray = [];
  public idMarca = null;
  public year = null;
  public modelsArray = [];
  public idModelo = null;
  public versionsArray = [];
  public coverageArray = [];
  public userExist: any;
  score: string = 'puntaje';
  public entity: IUser = Object();
  public coverageSelected: any;
  stepperOrientation: Observable<StepperOrientation>;
  minDate: Date;
  maxDate: Date;

  @ViewChild('stepper') stepper: { next: () => void; };

  constructor(private _formBuilder: FormBuilder, 
              private service: CommonService, 
              private toastr: ToastrService,
              breakpointObserver: BreakpointObserver) 
              {
                this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
                .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

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
    this.getLast20Years();
    this.getBrands();
    this.getCoberturas();
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
      //user: ['', [Validators.required,ValidateUserNotTaken.userExistsValidator(this.service)]],
      user: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
       ]],
      selectedPID: [''],
      selectedMID: [''],
      address: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      brand: ['', Validators.required],
      year: ['', Validators.required],
      model: ['', Validators.required],
      version: ['']
    });

    this.thirdFormGroup = this._formBuilder.group({
      
    });

  }

  get f(){
    return this.firstFormGroup?.controls;
  }

  get s(){
    return this.secondFormGroup?.controls;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  getProvincias(){
    this.service.getProvincias().subscribe(res => {
      this.provinciasArray = res.provincias;
    });
    
  }

  changeProvincia(ev: any){
    if(ev){
      this.service.getMunicipio(ev).subscribe(res => {
        this.municipiosArray = res.municipios;
      });
    }
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

  next(event: StepperSelectionEvent) {
    console.log(event.selectedIndex);
    if (event.selectedIndex == 1) {
      this.setEntityStep1();
    }
    if (event.selectedIndex == 2) {
      this.setEntityStep2();
    }
   
  }

  setEntityStep1(){
    this.entity.dni = this.f.dni.value;
    this.entity.nombre = this.f.name.value;
    this.entity.apellido = this.f.lastName.value;
    this.entity.telefono = this.f.phone.value;
    this.entity.celular = this.f.mobile.value;
    this.entity.nacimiento = this.f.date.value;
    this.entity.usuario = this.f.user.value;
    this.entity.contraseña = this.f.password.value;
    this.entity.location = Object();
    this.entity.location.provincia = this.f.selectedPID.value;
    this.entity.location.ciudad = this.f.selectedMID.value;
    this.entity.location.domicilio = this.f.address.value;
    console.log(this.entity);
  }

  setEntityStep2(){
    this.entity.vehiculo = Object();
    this.entity.vehiculo.ano = this.s.year.value;
    this.entity.vehiculo.marca = this.s.brand.value;
    this.entity.vehiculo.modelo = this.s.model.value;
    this.entity.vehiculo.version = this.s.version.value;
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

  getCoberturas(){
    this.service.getCoberturas().subscribe(res => {
      this.coverageArray = res;
    });
  }

  onNextFirstForm() {
    if (this.firstFormGroup.valid) {
        this.stepper.next();
    }
  }

  onNextSecondForm() {
    if (this.secondFormGroup.valid) {
        this.stepper.next();
    }
  }

  onNextThirdForm() {
    if (this.coverageSelected && this.coverageSelected?.length > 0) 
        this.stepper.next();
    else
      this.toastr.error('Debe seleccionar una cobertura');  
  }

  onGroupsChange(options: MatListOption[]) {
    // map these MatListOptions to their values
    this.coverageSelected = options.map(o => o.value);
    this.setEntityStep3(this.coverageSelected[0]);
  } 

  enviar(){
    if(this.firstFormGroup.valid && this.secondFormGroup.valid && this.coverageSelected && this.coverageSelected?.length > 0)
      this.toastr.success('Enviado correctamente');
    else  
    this.toastr.error('Debe completar los campos obligatorios');
  }
  
}