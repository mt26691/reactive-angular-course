import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
    private coursesStore: CoursesStore,
  ) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }

  reloadCourses() {

    const courses$ = this.coursesService.loadAllCourses().pipe(map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }));

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted<Course[]>(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(map(courses => courses.filter(t => t.category === 'BEGINNER')));
    this.advancedCourses$ = loadCourses$.pipe(map(courses => courses.filter(t => t.category === 'ADVANCED')));
  }

}