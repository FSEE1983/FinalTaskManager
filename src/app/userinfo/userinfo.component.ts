import { Component, OnInit } from '@angular/core';
import { TaskinfoService } from '../taskinfo.service';
import { Router } from '@angular/router';
import { Userinfo } from '../userinfo/userinfo.module'

@Component({
    selector: 'app-userinfo',
    templateUrl: './userinfo.component.html',
    styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

    UserInfoListFromService: Userinfo[];
    UserInfoList: Userinfo[];

    UserInfo: Userinfo;


    ActionText = "Add";

    MessageInfo = "";
    MessageType = "";
    SortBy = "";
    SearchValue = "";

    constructor(private ServiceInfo: TaskinfoService, private router: Router) { }

    ngOnInit() {
        this.UserInfo = new Userinfo();
        this.LoadUser();
    }

    LoadUser() {
        this.ServiceInfo.GetUserInfoList().subscribe((data: any) => {
            this.UserInfoListFromService = data;
            this.UserInfoList = data;
        });
    }
    AddUpdateUser() {
        if (this.UserInfo.First_Name == undefined || this.UserInfo.First_Name.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter First Name";
        }
        else if (this.UserInfo.Last_Name == undefined || this.UserInfo.Last_Name.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Last Name";
        }
        else if (this.UserInfo.Employee_ID == undefined || this.UserInfo.Employee_ID.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Employee Id";
        }
        else {

            this.ServiceInfo.AddUpdateUser(this.UserInfo).subscribe((data: any) => {
                this.MessageType = "Sucesses";
                if (this.UserInfo.User_ID > 0) {
                    this.MessageInfo = "User information Updated sucessfully";
                }
                else {
                    this.MessageInfo = "User information added sucessfully";
                }
                this.UserInfo = new Userinfo();
                this.SearchValue = "";
                this.SortBy = "";
                this.LoadUser();
            });
        }
    }
    ResetUser() {
        this.ActionText = "Add";
        this.MessageType = "";
        this.MessageInfo = "";
        this.UserInfo = new Userinfo();
        this.SearchValue = "";
        this.SortBy = "";
        this.UserInfoList = this.UserInfoListFromService;
    }

    EditUser(id: number) {
        this.ActionText = "Update";
        this.UserInfo = this.UserInfoList.find(x => x.User_ID == id);
    }

    DeleteUser(id: number) {
        this.ServiceInfo.DeleteUser(id).subscribe((data: any) => {
            this.LoadUser();
            this.MessageInfo = "User information deleted sucessfully";
        });

    }
    SortUser(SortBy: string) {
        this.MessageInfo = "";
        this.MessageType = "";
        this.SortBy = SortBy;
        this.SortUserInfo();
    }
    SearchUser() {
        this.MessageInfo = "";
        this.MessageType = "";
        this.UserInfoList = this.UserInfoListFromService;
        if (this.SearchValue != undefined && this.SearchValue.length > 0) {
            this.UserInfoList = this.UserInfoList.filter(x => x.First_Name.startsWith(this.SearchValue)
                || x.Last_Name.startsWith(this.SearchValue)
                || x.Employee_ID.startsWith(this.SearchValue));
        }
        this.SortUserInfo();
    }
    SortUserInfo() {
        if (this.SortBy == "FirstName") {
            this.UserInfoList.sort((a, b) => {
                if (a.First_Name > b.First_Name) {
                    return 1;
                }
                else if (a.First_Name < b.First_Name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
        else if (this.SortBy == "LastName") {
            this.UserInfoList.sort((a, b) => {
                if (a.Last_Name > b.Last_Name) {
                    return 1;
                }
                else if (a.Last_Name < b.Last_Name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
        else if (this.SortBy == "EMPID") {
            this.UserInfoList.sort((a, b) => {
                if (a.Employee_ID > b.Employee_ID) {
                    return 1;
                }
                else if (a.Employee_ID < b.Employee_ID) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
    }
}
