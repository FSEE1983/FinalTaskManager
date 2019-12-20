import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Task } from '../task.model';
import { Parenttask } from '../parenttask.model';
import { TaskinfoService } from '../taskinfo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Projectinfo } from '../project-info/projectinfo.module';



@Component({
    selector: 'app-add-edit-task',
    templateUrl: './add-edit-task.component.html',
    styleUrls: ['./add-edit-task.component.css', './bootstrap.min.css']
})

export class AddEditTaskComponent implements OnInit {

    taskinfo: Task = new Task();
    TaskID: any;

    IsParentTask: false;

    @ViewChild('ProjectModel') ProjectModel;
    ProjectSearchID: number;
    ProjectInfoList: Projectinfo[];

    @ViewChild('ParentTaskModel') ParentTaskModel;
    ParentTaskSearchID: number;
    ParentTaskList: Parenttask[];

    MessageInfo = "";
    MessageType = "";
    SortBy = "";
    SearchValue = "";

    constructor(private ServiceInfo: TaskinfoService, private _Activatedroute: ActivatedRoute, private router: Router) { }

    ngOnInit() {
       
        this.TaskID = this._Activatedroute.snapshot.params['id'];
        if (this.TaskID == 0) {
            this.taskinfo = new Task();
            this.taskinfo.Start_Date = new Date();
            var EndDate = new Date();
            EndDate.setDate(EndDate.getDate() + 1);
            this.taskinfo.End_Date = EndDate;
            this.taskinfo.Priority = 20;
        }
        else {
            //get task information for Edit
            this.ServiceInfo.GetTasksDetails(this.TaskID).subscribe((data: any) => {
                this.taskinfo = data;
            });
        }
    }

    OnSaveTask() {
        if (this.taskinfo.Project_ID == undefined || this.taskinfo.Project_ID <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please Select Project";
        }
        else if (this.taskinfo.TaskName == undefined || this.taskinfo.TaskName.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Task Name";
        }         
        else {
            if (this.IsParentTask) {
                let objParentTask = new Parenttask();
                objParentTask.Parent_ID = this.taskinfo.Task_ID;
                objParentTask.Parent_Task = this.taskinfo.TaskName;
                objParentTask.Project_ID = this.taskinfo.Project_ID;
                this.ServiceInfo.AddUpdateParentTask(objParentTask).subscribe((data: any) => {
                    this.router.navigate([`./ViewTask`]);
                });
            }
            else {
                console.log(this.taskinfo.Start_Date > this.taskinfo.End_Date);
                if (this.taskinfo.Start_Date > this.taskinfo.End_Date) {
                    this.MessageType = "Error";
                    this.MessageInfo = "End date should not be earlier than start date";
                }
                else {

                    this.ServiceInfo.AddUpdateTask(this.taskinfo).subscribe((data: any) => {
                        this.router.navigate([`./ViewTask`]);
                    });
                }

            }
        }
       
    }

    OnIsParentTask() {
        if (!this.IsParentTask) {
            this.taskinfo.Priority = 0;
            this.taskinfo.Start_Date = null;
            this.taskinfo.End_Date = null;
            this.taskinfo.Parent_ID = null;
            this.taskinfo.ParentTask = new Parenttask();
        }

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
            this.taskinfo.ProjectInfo = this.ProjectInfoList.find(x => x.Project_ID == this.ProjectSearchID);
            this.taskinfo.Project_ID = this.ProjectSearchID;
            this.OnProjectSearchClose();
        }
    }

    OnProjectSearchClose() {
        this.ProjectModel.nativeElement.className = 'modal hide';
    }

    OnParentTaskSearchOpen() {
        this.ParentTaskSearchID = undefined;
        if (this.ParentTaskList == undefined) {
            this.ServiceInfo.GetParentTasksList().subscribe((data: any) => {
                this.ParentTaskList = data;
            });
        }
        this.ParentTaskModel.nativeElement.className = 'modal show';
    }

    OnParentTaskSearchSave() {
        console.log(this.ParentTaskSearchID);
        if (this.ParentTaskSearchID != undefined) {
            this.taskinfo.ParentTask = this.ParentTaskList.find(x => x.Parent_ID == this.ParentTaskSearchID);
            console.log(this.taskinfo.ParentTask);
            this.taskinfo.Parent_ID = this.ParentTaskSearchID;
            this.OnParentTaskSearchClose();
        }
    }

    OnParentTaskSearchClose() {
        this.ParentTaskModel.nativeElement.className = 'modal hide';
    }
}
