import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskinfoService } from '../taskinfo.service';
import { Router } from '@angular/router';
import { Task } from '../task.model';
import { Projectinfo } from '../project-info/projectinfo.module';

@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

    constructor(private ServiceInfo: TaskinfoService, private router: Router) { }

    taskinfo: Task[];
    TaskinfoFromService: Task[];


    @ViewChild('ProjectModel') ProjectModel;
    ProjectSearchID: number;
    ProjectInfoList: Projectinfo[];
    ProjectInfo: Projectinfo;

    ngOnInit() {
        this.LoadTask();

    }
    LoadTask() {
        this.ServiceInfo.GetTasksList().subscribe((data: any) => {
            this.TaskinfoFromService = data;
            this.taskinfo = data;
        });
    }

    EditTask(id: number) {
        this.router.navigate([`./AddEditTask/${id}`]);
    }

    EndTask(id: number) {
        this.ServiceInfo.EndTask(id).subscribe((data: any) => { this.LoadTask(); });

    }

    OnProjectSearchRemove() {
        this.ProjectSearchID = undefined;
        this.ProjectInfo = new Projectinfo();
        this.taskinfo = this.TaskinfoFromService;
    }

    OnProjectSearchOpen() {
        this.ProjectSearchID = undefined;
        if (this.ProjectInfoList == undefined) {
            this.ServiceInfo.GetProjectInfoList().subscribe((data: any) => {
                this.ProjectInfoList = data;
            });
        }
        this.ProjectModel.nativeElement.className = 'modal show';
    }

    OnProjectSearchSave() {
        if (this.ProjectSearchID != undefined) {
            this.ProjectInfo = this.ProjectInfoList.find(x => x.Project_ID == this.ProjectSearchID);
            this.ProjectInfo.Project_ID = this.ProjectSearchID;
            this.OnProjectSearchClose();
            this.taskinfo = this.TaskinfoFromService;
            console.log(this.taskinfo);
            this.taskinfo = this.taskinfo.filter(x => x.Project_ID == this.ProjectSearchID);
            console.log(this.taskinfo);
        }
    }

    OnProjectSearchClose() {
        this.ProjectModel.nativeElement.className = 'modal hide';
    }

    OnSort(SortBy: string) {
        switch (SortBy) {
            case "StartDate": {
                this.taskinfo.sort((a, b) => {
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
                this.taskinfo.sort((a, b) => {
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
                this.taskinfo.sort((a, b) => {
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
                this.taskinfo.sort((a, b) => {
                    if (a.IsTaskEnded > b.IsTaskEnded) {
                        return -1;
                    }
                    else if (a.IsTaskEnded < b.IsTaskEnded) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
            } break;
        }
    }
}
