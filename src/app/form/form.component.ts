import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles:[`
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-wrapper{
        margin:0;
        padding:0;
    }
  `]
})
export class FormComponent implements OnInit {

  mentor!: any
  dialogType!: string
  buttonState = false
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  form!: FormGroup

  constructor(
    private dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type : string
      id : string
    },
    private snackbar: MatSnackBar,
    private service: SharedService,
    private fb: FormBuilder,
  ) { 
    this.dialogType = this.data.type
  }

  ngOnInit(): void {
    if(this.data.type === 'edit'){
      this.getDataById()
    }
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      civility: [null, Validators.required],
      company: [null, Validators.required],
      user_type: [null, Validators.required],
      user_status:[null, Validators.required],
    })
  }

  getDataById() {
    this.service.getData().subscribe((result) => {      
      this.mentor = result.find(obj => {return obj.id === this.data.id})
      this.form.patchValue({
        email: this.mentor.email,
        civility: this.mentor.civility,
        first_name: this.mentor.first_name,
        last_name: this.mentor.last_name,
        company: this.mentor.company.name,
        user_type: this.mentor.company.user_type,
        user_status: this.mentor.company.user_status,
      })
      console.log(this.mentor);
    })
  }

  emailCheck(){
    this.service.getData().subscribe((result) => {      
      let sameObj = result.find(obj => {
        return obj.email === this.form.value.email
      })
      console.log(sameObj);
      
      if(sameObj?.email === this.form.value.email || this.form.value.email === null){
        this.buttonState = false
        console.log(sameObj?.email);
        this.snackbar.open('Email not available', 'Tutup', {duration: 5000})
      }else{
        this.buttonState = true
        console.log(sameObj?.email);
        this.snackbar.open('Email available', 'Tutup', {duration: 5000})
      }
    })
  }

  submit() {
    var formValue = this.form.value
    var company = {
      name : formValue.company,
      user_type : formValue.user_type
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.snackbar.open('Form not complete! please check again', 'Tutup', {duration: 5000})
    }else if (this.data.type === 'add') {      
      this.service.add(
        {
          email : formValue.email,
          civility: formValue.civility,
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          company : company,
          user_status : formValue.user_status
        }
      ).subscribe((result) => {
        if (result) {
          this.snackbar.open('Data Added', 'Tutup', {duration: 5000})
          this.dialogRef.close('success') 
        }
      })      
    } 
    else if(this.data.type === 'edit'){
      this.service.update(this.data.id, {
        email : formValue.email,
        civility: formValue.civility,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        company : company,
        user_status : formValue.user_status
      }).subscribe((result) => {
        if (result) {
          this.snackbar.open('Data Updated', 'Tutup', {duration: 5000, panelClass: "edit"})
          this.dialogRef.close('success') 
        }
      })
    }
  }

}
