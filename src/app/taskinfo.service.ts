import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Task } from '../app/task.model';
import { Parenttask } from '../app/parenttask.model';
import { Userinfo } from '../app/userinfo/userinfo.module';
import { Projectinfo } from '../app/project-info/projectinfo.module'

@Injectable({
  providedIn: 'root'
})
export class TaskinfoService {
    private BaseURL = "http://localhost/TaskMangerService/api/"; // "http://localhost:49504/api/";

    constructor(private httpService: HttpClient) { }


    GetParentTasksList() {
        let Url = this.BaseURL + "ParentTask/";
        return this.httpService.get(Url);
    }

    GetTasksList() {
        let Url = this.BaseURL + "Task/";       
        return this.httpService.get(Url);     
    }
    GetTasksDetails(id: number) {
        let Url = this.BaseURL + "Task/" + "?id=" + id;
        return this.httpService.get(Url);
    }
   EndTask(id: number) {       
        let Url = this.BaseURL + "Task/" + "?id=" + id;        
        return this.httpService.delete<Task>(Url);
    }
   AddUpdateParentTask(model: Parenttask) {
       let Url = this.BaseURL + "ParentTask";
       const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
       if (model.Parent_ID > 0) {
           Url = Url + "?id=" + model.Parent_ID;
           return this.httpService.put<Parenttask>(Url, JSON.stringify(model), httpOptions);
       }
       else {
           return this.httpService.post<Parenttask>(Url, JSON.stringify(model), httpOptions);
       }
   } 
    AddUpdateTask(model: Task) {
        let Url = this.BaseURL + "Task";       
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        if (model.Task_ID > 0) {
            Url = Url + "?id=" + model.Task_ID;   
            return this.httpService.put<Task>(Url, JSON.stringify(model), httpOptions);    
        }
        else {
            return this.httpService.post<Task>(Url, JSON.stringify(model), httpOptions);    
        }             
   } 
    GetUserInfoList() {
        let Url = this.BaseURL + "Users/";       
        return this.httpService.get(Url);
    }
    GetUserInfo(id: number) {
        let Url = this.BaseURL + "Users/" + "?id=" + id;
        return this.httpService.get(Url);
    }
    DeleteUser(id: number) { 
        let Url = this.BaseURL + "Users/" + "?id=" + id;
        return this.httpService.delete<Userinfo>(Url);
    }
    AddUpdateUser(model: Userinfo) {
        let Url = this.BaseURL + "Users";
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        if (model.User_ID > 0) {
            Url = Url + "?id=" + model.User_ID;
            return this.httpService.put<Userinfo>(Url, JSON.stringify(model), httpOptions);
        }
        else {
            return this.httpService.post<Userinfo>(Url, JSON.stringify(model), httpOptions);
        }
    } 
    GetProjectInfoList() {
        let Url = this.BaseURL + "Project/";
        return this.httpService.get(Url);
    }
    GetProjectInfo(id: number) {
        let Url = this.BaseURL + "Project/" + "?id=" + id;
        return this.httpService.get(Url);
    }
    DeleteProject(id: number) {
        console.log(id + "delete");
        let Url = this.BaseURL + "Project/" + "?id=" + id;
        return this.httpService.delete<Projectinfo>(Url);
    }
    AddUpdateProject(model: Projectinfo) {
        let Url = this.BaseURL + "Project";
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        if (model.Project_ID > 0) {
            Url = Url + "?id=" + model.Project_ID;
            return this.httpService.put<Projectinfo>(Url, JSON.stringify(model), httpOptions);
        }
        else {
            return this.httpService.post<Projectinfo>(Url, JSON.stringify(model), httpOptions);
        }
    } 
}
