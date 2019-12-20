import { Parenttask } from '../app/parenttask.model';
import { Projectinfo } from '../app/project-info/projectinfo.module';

export class Task {
    Task_ID: number;   
    TaskName: string;
    Start_Date: Date;
    End_Date: Date;
    Priority: number;    
    Parent_ID: number;
    IsTaskEnded: number;
    ParentTask: Parenttask;
    Project_ID: number;
    ProjectInfo: Projectinfo;
}
