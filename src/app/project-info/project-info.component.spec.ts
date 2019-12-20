import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoComponent } from './project-info.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskinfoService } from '../taskinfo.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Projectinfo } from './projectinfo.module';
import { Userinfo } from '../userinfo/userinfo.module';
import { Task } from '../task.model';

export class ProjectMockService {

    ProjectInfoList: Array<Projectinfo> = new Array<Projectinfo>();

    GetProjectInfoList() {
        let ProjectInfoList: Array<Projectinfo> = new Array<Projectinfo>();
        for (var i = 1; i <= 10; i++) {
            let obj = new Projectinfo();
            obj.Project_ID = i;
            obj.Project1 = "Project - " + i;
            obj.Start_Date = new Date();
            obj.End_Date = new Date();
            obj.Priority = i + 1;
            obj.UserInfo = new Userinfo();
            obj.UserInfo.User_ID = i;
            obj.UserInfo.First_Name = "First Name - " + i;
            obj.UserInfo.Last_Name = "Last Name - " + i;
            obj.UserInfo.Employee_ID = "Emp - " + i;

            obj.User_ID = i;

            ProjectInfoList.push(obj);
        }
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }

    GetTasksList() {
        let TaskList: Array<Task> = new Array<Task>();
        for (var i = 1; i <= 10; i++) {
            let obj = new Task();
            obj.Task_ID = i;
            obj.Project_ID = i;
            TaskList.push(obj);

            obj = new Task();
            obj.Task_ID = i + 2;
            obj.Project_ID = i;
            obj.IsTaskEnded = 1;
            TaskList.push(obj);

            obj = new Task();
            obj.Task_ID = i + 3;
            obj.Project_ID = i;
            obj.IsTaskEnded = 1;
            TaskList.push(obj);
        }
        return of(TaskList);

    }

    AddUpdateProject(model: Projectinfo) {
        let ProjectInfoList = this.ProjectInfoList;
        if (model.Project_ID > 0) {
            let obj = ProjectInfoList.find(x => x.Project_ID == model.Project_ID)
            obj.Project1 = "Project - updated";
            obj.CompletedTask = 25;
            obj.Start_Date = new Date();
            obj.End_Date = new Date();
            obj.Priority = 4;
            obj.NoOfTask = 6;
        }
        else {
            ProjectInfoList.push(model);
        }
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }

    DeleteProject(id: number) {
        let ProjectInfoList = this.ProjectInfoList;
        let index = ProjectInfoList.findIndex(x => x.Project_ID == id)
        ProjectInfoList.splice(index, 1);
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }
}

describe('ProjectInfoComponent', () => {
    let component: ProjectInfoComponent;
    let fixture: ComponentFixture<ProjectInfoComponent>;
    let MockService = new ProjectMockService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [{ provide: TaskinfoService, useValue: MockService }],
            declarations: [ProjectInfoComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Project Create component', () => {
        expect(component).toBeTruthy();
    });

    it('Project Load Test', () => {
        component.LoadProjectInfo();
        expect(component.ProjectInfoList.length).toBe(10);
    });

    it('Project Add Test', () => {
        let obj = new Projectinfo();
        obj.Project_ID = 0;
        obj.Project1 = "Project - 11";
        obj.CompletedTask = 5;
        obj.Start_Date = new Date();
        obj.End_Date = new Date();
        obj.Priority = 6;
        obj.NoOfTask = 7;
        obj.UserInfo = new Userinfo();
        obj.UserInfo.User_ID = 6;
        obj.UserInfo.First_Name = "First Name - 6";
        obj.UserInfo.Last_Name = "Last Name - 6";
        obj.UserInfo.Employee_ID = "Emp - 6";
        obj.User_ID = 6;
        component.ProjectInfo = obj;
        component.OnAddUpdate();
        expect(component.MessageInfo).toContain("added");
    });

    it('Project Update Test', () => {
        let obj = new Projectinfo();
        obj.Project_ID = 5;
        obj.Project1 = "Project - 5";
        obj.CompletedTask = 5;
        obj.Start_Date = new Date();
        obj.End_Date = new Date();
        obj.Priority = 6;
        obj.NoOfTask = 7;
        obj.UserInfo = new Userinfo();
        obj.UserInfo.User_ID = 6;
        obj.UserInfo.First_Name = "First Name - 6";
        obj.UserInfo.Last_Name = "Last Name - 6";
        obj.UserInfo.Employee_ID = "Emp - 6";
        obj.User_ID = 6;
        component.ProjectInfo = obj;
        component.OnAddUpdate();
        expect(component.MessageInfo).toContain("Updated");
    });

    it('Project Delete Test', () => {
        component.OnDelete(5);
        expect(component.MessageInfo).toContain("deleted");
    });

    it('Project Reset Test', () => {
        component.OnResetInfo();
        expect(component.ProjectInfo.User_ID).toBe(undefined);
    });

    it('Project Search Test', () => {
        component.SearchValue = "Project - 1";
        component.OnSearchInfo();
        expect(component.ProjectInfoList[0].Project1).toBe("Project - 1");
    });


});
