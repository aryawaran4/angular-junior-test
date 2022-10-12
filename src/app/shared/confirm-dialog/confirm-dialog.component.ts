import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      urlData: string
      uuid: string,
      title: string,
      message: string,
      name:string
    },
    private snackbar: MatSnackBar,
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>){}    

  ngOnInit(): void {

  }

  deleteData(){
    return this.http.delete<undefined>(this.data.urlData + this.data.uuid).subscribe(
      {
        next: res =>{
          this.dialogRef.close('success')
        },
        error: (e) => 
        this.snackbar.open('Operation failed', 'Tutup', {duration: 5000})
      }
    )
  }

  close() {
    this.dialogRef.close('error')
  }

}
