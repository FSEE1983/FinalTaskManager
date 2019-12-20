import { Userinfo } from '../userinfo/userinfo.module';
 
export class Projectinfo {
    Project_ID: number;
    Project1: string;
    Start_Date: Date;
    End_Date: Date;
    Priority: number;
    User_ID: number;
    UserInfo: Userinfo;
    NoOfTask: number;
    CompletedTask: number;
}
