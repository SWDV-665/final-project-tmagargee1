import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AssignmentDto} from '../models/assignment';

@Injectable()
export class AssignmentServiceProvider {

    items: any = [];
    public dataChanged$: Observable<boolean>;
    private dataChangeSubject: Subject<boolean>;

    //private baseURL = 'http://localhost:8080/api/assignments';
    private baseURL = 'https://brainy-foal-shift.cyclic.app/api/assignments'

    constructor(public http: HttpClient) {
        this.dataChangeSubject = new Subject<boolean>();
        this.dataChanged$ = this.dataChangeSubject.asObservable();
    }

    public getAssignments() {
        return this.http.get<AssignmentDto[]>(this.baseURL).pipe(
            catchError(this.handleError)
        )
    }

    private handleError(error: Response | any) {
        let message: string;
        if (error instanceof Response) {
            message = `${error.status} - ${error.statusText || ''} ${error || ''}`
        } else {
            message = error.message ? error.message : error.toString();
        }
        return Observable.throw(message);
    }

    public removeItem(id: string) {
        return this.http.delete(`${this.baseURL}/${id}`).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    public deleteCompleted() {
        return this.http.delete(`${this.baseURL}`).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    public addItem(item: AssignmentDto) {
        return this.http.post(`${this.baseURL}`, item).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    public editItem(item: AssignmentDto) {
        return this.http.put(`${this.baseURL}/${item._id}`, item).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

}
