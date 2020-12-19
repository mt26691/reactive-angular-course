import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, first, map, shareReplay, take, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({ providedIn: 'root' })
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient, private loading: LoadingService, private message: MessagesService) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses').pipe(
            map(res => res['payload']),
            catchError(err => {

                this.message.showErrors('Could not load courses');
                console.log('error', err);
                return throwError(err);
            }),
            tap(courses => this.subject.next(courses)));

        this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(map(courses => courses.filter(t => t.category === category).sort(sortCoursesBySeqNo)));
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {

        const courses = this.subject.getValue();

        const index = courses.findIndex(t => t.id === courseId);

        const newCourse: Course = { ...courses[index], ...changes };

        const newCourses: Course[] = courses.splice(0);
        newCourses[index] = newCourse;
        this.subject.next(newCourses);

        return this.http.put<any>(`/api/courses/${courseId}`, changes)
            .pipe(catchError(err => {
                const message = "Could not save course";
                console.log(message, err);
                this.message.showErrors(message);
                return throwError(err);
            }), shareReplay());
    }
}