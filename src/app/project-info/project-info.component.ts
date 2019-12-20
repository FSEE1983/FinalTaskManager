import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskinfoService } from '../taskinfo.service';
import { Router } from '@angular/router';
import { Projectinfo } from '../project-info/projectinfo.module';
import { Userinfo } from '../userinfo/userinfo.module';
import { Task } from '../task.model';

@Component({
    selector: 'app-project-info',
    templateUrl: './project-info.component.html',
    styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {

    ProjectInfoListFromService: Projectinfo[];

    ProjectInfoList: Projectinfo[];

    ProjectInfo: Projectinfo;

    UserInfoList: Userinfo[];


    ActionText = "Add";
    MessageInfo = "";
    MessageType = "";
    SortBy = "";
    SearchValue = "";
    SetDate = false;

    @ViewChild('ManagerModel') ManagerModel;
    SelectedUserId: number;

    constructor(private ServiceInfo: TaskinfoService, private router: Router) { }

    ngOnInit() {
        this.ProjectInfo = new Projectinfo();
        this.LoadProjectInfo();
    }

    LoadProjectInfo() {
        this.ServiceInfo.GetProjectInfoList().subscribe((ProjectList: any) => {
            this.ProjectInfoListFromService = ProjectList;

            this.ServiceInfo.GetTasksList().subscribe((Taskdata: any) => {
                let TaskList = Taskdata as Task[];
                this.ProjectInfoListFromService.forEach(proj => {
                    proj.NoOfTask = TaskList.filter(x => x.Project_ID == proj.Project_ID).length;
                    proj.CompletedTask = TaskList.filter(x => x.Project_ID == proj.Project_ID && x.IsTaskEnded == 1).length;
                });
                this.ProjectInfoList = this.ProjectInfoListFromService;
            });
        });
    }

    OnManagerSearchOpen() {
        this.SelectedUserId = undefined;
        console.log(this.UserInfoList);
        if (this.UserInfoList == undefined) {
            this.ServiceInfo.GetUserInfoList().subscribe((data: any) => {
                this.UserInfoList = data;
            });
        }
        this.ManagerModel.nativeElement.className = 'modal show';
    }
    OnManagerSearchSave() {
        if (this.SelectedUserId != undefined) {
            this.ProjectInfo.UserInfo = this.UserInfoList.find(x => x.User_ID == this.SelectedUserId);
            this.ProjectInfo.User_ID = this.SelectedUserId;
            this.OnManagerSearchClose();
        }
    }
    OnManagerSearchClose() {
        this.ManagerModel.nativeElement.className = 'modal hide';
    }
    OnAddUpdate() {
        if (this.ProjectInfo.Project1 == undefined || this.ProjectInfo.Project1.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter project";
        }
        else if (this.ProjectInfo.Start_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Start Date";
        }
        else if (this.ProjectInfo.End_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter End Date";
        }
        else if (this.ProjectInfo.User_ID == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter user ID";
        }
        else {

            this.ServiceInfo.AddUpdateProject(this.ProjectInfo).subscribe((data: any) => {
                this.MessageType = "Sucesses";
                if (this.ProjectInfo.Project_ID > 0) {
                    this.MessageInfo = "Project Information Updated sucessfully";
                }
                else {
                    this.MessageInfo = "Project Information added sucessfully";
                }
                this.ProjectInfo = new Projectinfo();
                this.SetDate = false;
                this.SearchValue = "";
                this.SortBy = "";
                this.LoadProjectInfo();
            });
        }
    }
    OnResetInfo() {
        this.ActionText = "Add";
        this.MessageType = "";
        this.MessageInfo = "";
        this.ProjectInfo = new Projectinfo();
        this.SearchValue = "";
        this.SortBy = "";
        this.ProjectInfoList = this.ProjectInfoListFromService;
        this.SetDate = false;
    }

    OnEdit(id: number) {
        this.ActionText = "Update";
        this.ProjectInfo = this.ProjectInfoList.find(x => x.Project_ID == id);
        this.SetDate = this.ProjectInfo.Start_Date != undefined || this.ProjectInfo.End_Date != undefined;
    }

    OnDelete(id: number) {
        this.ServiceInfo.DeleteProject(id).subscribe((data: any) => {
            this.MessageInfo = "Project Information deleted sucessfully";
            this.LoadProjectInfo();
        });

    }
    OnSort(SortBy: string) {
        this.MessageInfo = "";
        this.MessageType = "";
        this.SortBy = SortBy;
        this.SetDate = false;
        this.SortInfo();
    }
    OnSetDate() {
        if (!this.SetDate) {
            this.ProjectInfo.Start_Date = new Date();
            var EndDate = new Date();
            EndDate.setDate(EndDate.getDate() + 1);
            this.ProjectInfo.End_Date = EndDate;
        }
        else {
            this.ProjectInfo.Start_Date = null;
            this.ProjectInfo.End_Date = null;
        }
    }
    OnSearchInfo() {
        this.MessageInfo = "";
        this.MessageType = "";
        this.SetDate = false;
        this.ProjectInfoList = this.ProjectInfoListFromService;
        if (this.SearchValue != undefined && this.SearchValue.length > 0) {
            this.ProjectInfoList = this.ProjectInfoList.filter(x => x.Project1.startsWith(this.SearchValue));
        }
        this.SortInfo();
    }
    SortInfo() {
        switch (this.SortBy) {

            case "StartDate": {
                this.ProjectInfoList.sort((a, b) => {
                    if (a.Start_Date > b.Start_Date) {
                        return 1;
                    }
                    else if (a.Start_Date < b.Start_Date) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
            } break;
            case "EndDate": {
                this.ProjectInfoList.sort((a, b) => {
                    if (a.End_Date > b.End_Date) {
                        return 1;
                    }
                    else if (a.End_Date < b.End_Date) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
            } break;
            case "Priority": {
                this.ProjectInfoList.sort((a, b) => {
                    if (a.Priority > b.Priority) {
                        return 1;
                    }
                    else if (a.Priority < b.Priority) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
            } break;
            case "Completed": {
                this.ProjectInfoList.sort((a, b) => {
                    if (a.CompletedTask > b.CompletedTask) {
                        return 1;
                    }
                    else if (a.CompletedTask < b.CompletedTask) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
            } break;
        }


    }

}
