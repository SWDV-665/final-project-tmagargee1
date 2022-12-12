import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models/category';

@Injectable()
export class CategoriesServiceProvider {
    public dataChanged$: Observable<boolean>;
    private dataChangeSubject: Subject<boolean>;

    //private baseURL = 'https://schedule-with-colors-server.azurewebsites.net/api/categories';
    //private baseURL = 'http://localhost:8080/api/categories';
    private baseURL = 'https://brainy-foal-shift.cyclic.app/api/categories'

    constructor(public http: HttpClient) {
        this.dataChangeSubject = new Subject<boolean>();
        this.dataChanged$ = this.dataChangeSubject.asObservable();
    }

    public getCategories() {
        return this.http.get<Category[]>(this.baseURL).pipe(
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

    public deleteCategory(id: string) {
        return this.http.delete(`${this.baseURL}/${id}`).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    public addCategory(item) {
        console.log(JSON.stringify(item));
        return this.http.post(`${this.baseURL}`, item).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    public editCategory(item) {
        return this.http.put(`${this.baseURL}/${item._id}`, item).subscribe(res => {
            this.dataChangeSubject.next(true)
        })
    }

    // public getCategories2() : Observable<Category[]>{
    //     var mongoose = require('mongoose');
    //     mongoose.connect("mongodb+srv://tm:1234@schedule-with-colors.frqd9lu.mongodb.net/test");
    //     var Category2 = mongoose.model('Category', {
    //         name: String,
    //         color: String,
    //         defaultTime: Date,
    //     });

    //     return Category2.find(function (err, categories) {
    //         return categories as Category[]
    //     });
    // }

}
