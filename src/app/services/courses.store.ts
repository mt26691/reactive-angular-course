import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map, shareReplay, take } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({ providedIn: 'root' })
export class CoursesStore {

    courses$: Observable<Course[]>;

    constructor(private http: HttpClient) {

    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(map(courses => courses.filter(t => t.category === category).sort(sortCoursesBySeqNo)));
    }
    
    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>('/api/courses').pipe(map(res => res['payload']), shareReplay(), first());
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.http.put<any>(`/api/courses/${courseId}`, changes)
            .pipe(shareReplay());
    }
}