import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map, shareReplay, take } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Injectable({ providedIn: 'root' })
export class CoursesService {

    constructor(private http: HttpClient) {

    }

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>('/api/courses').pipe(map(res => res['payload']), shareReplay(), first());
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.http.put<any>(`/api/courses/${courseId}`, changes)
            .pipe(shareReplay());
    }

    loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: '10000',
                courseId: courseId.toString()
            }
        }).pipe(map(res => res['payload']), shareReplay());
    }

    searchLessons(search: string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: '100',
            }
        }).pipe(map(res => res['payload']), shareReplay());
    }

    loadCourseById(id): Observable<Course> {
        return this.http.get<Course>(`/api/courses/${id}`).pipe(shareReplay());
    }
}