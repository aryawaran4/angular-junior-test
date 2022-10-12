import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MentorType } from './shared/mentor.type';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angular-junior';

  displayedColumns: string[] = ['name', 'userType', 'entity', 'status', 'action'];
  dataSource: any
  mentor: MentorType[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {    
    this.getData()
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getData(){
    this.service.getData().subscribe((result: any) => {      
      this.mentor = result
      this.dataSource = new MatTableDataSource<MentorType>(this.mentor)
      this.dataSource.paginator = this.paginator;
    })
  }

  openForm(type:string, id?: string){
    this.dialog.open(FormComponent, {
      data: {type : type , id : id}
    }).afterClosed()
     .subscribe((status: 'success' | 'error') => {
       if (status === 'success'){
          this.getData()
       }
     });
  }

  deleteMentor(name:string, id: string){
    this.dialog.open(ConfirmDialogComponent, {
      data: { 
        urlData: 'http://localhost:3000/data/',
        uuid : id,
        title: 'Delete Mentor',
        message: 'Mentor',
        name: name
       }
    }).afterClosed().subscribe((status: 'success' | 'error') => {
      if (status === 'success') {
        this.snackbar.open('Mentor deleted', 'Tutup', {duration: 5000})
        this.getData()
        this.router.navigate(['/']);
      }
    });
  }

}
