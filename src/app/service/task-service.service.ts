import { Injectable } from '@angular/core';
import {Task} from "../model/Task";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private http: HttpClient) { }

  // backend URL
  getApiBaseUrl() {return environment.api.url; }

  // method to save a new task modal to the backend using http request
  saveTask(newTask : Task): Observable<Task> {
    return this.http.post<Task>(this.getApiBaseUrl() + '/save', newTask);
  }

  deleteTaskById(taskId: number): Observable<any> {
    const url = `${this.getApiBaseUrl()}/tasks/${taskId}/delete`;
    return this.http.post(url, null);
  }

  // get All task
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.getApiBaseUrl() + '/tasks');
  }

}
