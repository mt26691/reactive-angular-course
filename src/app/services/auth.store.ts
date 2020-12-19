import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, first, map, shareReplay, take, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { User } from "../model/user";

const AUTH_DATA = 'AUTH_DATA';

@Injectable({ providedIn: 'root' })
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);
    user$: Observable<User> = this.subject.asObservable();
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(t => !t));

        const user = localStorage.getItem(AUTH_DATA);

        if (user) {
            this.subject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>('/api/login', { email, password }).pipe(
            tap(user => {
                this.subject.next(user);
                localStorage.setItem(AUTH_DATA, JSON.stringify(user));
            }),
            shareReplay()
        );
    }

    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }
}