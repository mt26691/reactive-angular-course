import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError, filter, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements AfterViewInit {

    @Input()
    courses: Course[] = [];

    @Output()
    public coursesChanges = new EventEmitter();

    constructor(private dialog: MatDialog) {

    }

    ngAfterViewInit() {

    }

    editCourse(course: Course) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "400px";

        dialogConfig.data = course;

        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed()
            .pipe(filter(val => !!val),
                tap(val => this.coursesChanges.emit(val))
            ).subscribe();

    }
}
