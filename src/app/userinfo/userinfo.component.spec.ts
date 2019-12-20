import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { UserinfoComponent } from './userinfo.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskinfoService } from '../taskinfo.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Userinfo } from './userinfo.module'
import { Observable, of } from 'rxjs'; 

export class UserMockService {

    UserInfoList1: Array<Userinfo> = new Array<Userinfo>();

    GetUserInfoList() { 
        let UserInfoList: Array<Userinfo> = new Array<Userinfo>();
        for (var i = 1; i <= 10; i++) {
            let objuser = new Userinfo();
            objuser.User_ID = i;
            objuser.First_Name = "First Name - " + i;
            objuser.Last_Name = "Last Name - " + i;
            objuser.Employee_ID = "Emp - " + i;
            UserInfoList.push(objuser);
        }
        this.UserInfoList1 = UserInfoList;
        return of(this.UserInfoList1);
    }

    GetUserInfo() { return new Userinfo(); }

    AddUpdateUser(model: Userinfo) {
        let UserInfoList = this.UserInfoList1;       
        if (model.User_ID > 0) {
            let objinfo = UserInfoList.find(x => x.User_ID == model.User_ID)
            objinfo.First_Name = model.First_Name;
            objinfo.Last_Name = model.Last_Name;
            objinfo.Employee_ID = model.Employee_ID;
        }
        else {
            UserInfoList.push(model);
        }
        this.UserInfoList1 = UserInfoList; 
        return of(this.UserInfoList1);
    }

    DeleteUser(id: number) {
        let UserInfoList = this.UserInfoList1;    
        let index = UserInfoList.findIndex(x => x.User_ID == id)
        UserInfoList.splice(index, 1);
        this.UserInfoList1 = UserInfoList;
        return of(this.UserInfoList1);
    }
}

describe('UserinfoComponent', () => {
  let component: UserinfoComponent;
  let fixture: ComponentFixture<UserinfoComponent>;
  let userMockService = new UserMockService();
  
  beforeEach(async(() => {
      TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserinfoComponent],
      providers: [{ provide: TaskinfoService, useValue: userMockService }]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  //it('should get users', inject([HttpTestingController, TaskinfoService],
  //    (httpMock: HttpTestingController, apiService: TaskinfoService) => {
  //        expect(TaskinfoService).toBeTruthy();
  //    }
  //)
  //);

  it('User Create component', () => {
    expect(component).toBeTruthy();
  });

  it('User Load Test', () => {
      component.LoadUser();
      expect(component.UserInfoList.length).toBe(10);
  });

  it('User Add Test', () => {
      component.UserInfo = new Userinfo();
      component.UserInfo.User_ID = 0;
      component.UserInfo.First_Name = "First Name - 11";
      component.UserInfo.Last_Name = "Last Name - 11";
      component.UserInfo.Employee_ID = "Emp - 11";
      component.AddUpdateUser();
      expect(component.MessageInfo).toBe("User information added sucessfully");
  });
  it('User Update Test', () => {
      component.UserInfo = new Userinfo();
      component.UserInfo.User_ID = 5;
      component.UserInfo.First_Name = "Updated First Name - 5";
      component.UserInfo.Last_Name = "Updated Last Name - 5"; 
      component.UserInfo.Employee_ID = "Updated Emp - 5"; 
      component.AddUpdateUser(); 
      expect(component.MessageInfo).toBe("User information Updated sucessfully");
  });
  it('User Delete Test', () => {
      component.DeleteUser(5);  
      expect(component.MessageInfo).toBe("User information deleted sucessfully");
  });
  it('User Reset Test', () => {
      component.ResetUser();
      expect(component.UserInfo.User_ID).toBe(undefined);  
  });

  it('User Search Test', () => {
      component.SearchValue = "First Name - 1";
      component.SearchUser();    
      expect(component.UserInfoList.filter(x => x.First_Name.startsWith("First Name - 1"))).not.toBe(null);
  });
  it('User Sort First Name Test', () => {
      component.SortBy = "FirstName";
      component.SortUser("");      
      expect(component.UserInfoList[0].First_Name).toBe("First Name - 1");
  });

  it('User Sort Last Name Test', () => {
      component.SortBy = "LastName";
      component.SortUser("");     
      expect(component.UserInfoList[0].Last_Name).toBe("Last Name - 1");
  });

  it('User Sort Employee ID Test', () => {
      component.SortBy = "EMPID";
      component.SortUser("");     
      expect(component.UserInfoList[0].Employee_ID).toBe("Emp - 1");
  });

});
