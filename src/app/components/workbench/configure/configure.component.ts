import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/sharedmodule';
// import { data } from '../../charts/echarts/echarts';
import Swal from 'sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { UsersDashboardComponent } from '../users-dashboard/users-dashboard.component';
import { RolesDashboardComponent } from '../roles-dashboard/roles-dashboard.component';
import { EmbedSdkComponent } from '../embed-sdk/embed-sdk.component';
@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule,NgSelectModule,NgbModule,UsersDashboardComponent,RolesDashboardComponent,EmbedSdkComponent],
  templateUrl: './configure.component.html',
  styleUrl: './configure.component.scss',
})
export class ConfigureComponent implements OnInit {
  apiKey: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  activeTab = 'configure';
  dashboardId:any;
  activateEmailTab=false;
  dashboardName:any;
  selectableDashbaord = false;
  userId:any;
  enabledEmail=false;
  constructor(
    private workbechService: WorkbenchService,
    private http: HttpClient,
    private router: Router,route:ActivatedRoute,
    private toasterService:ToastrService
  ) {
    if(this.router.url.includes('/analytify/configure-page/email')){
      if (route.snapshot.params['id'])
       this.activeTab = 'email',
       this.dashboardId = +atob(route.snapshot.params['id']);
       this.activateEmailTab=true;
       this.getdashboardDetails(this.dashboardId);
       this.selectableDashbaord=false
    }
    if(this.router.url.includes('/analytify/configure-page/configure')){
       this.selectableDashbaord=true;
    }

  }
emailToggles = {
  update: false,
  sync: false,
  autosync: false
};
dashboards :any=[];

ngOnInit(): void {
    // if(this.activateEmailTab){
    //   this.getdashboardDetails()
    // }
}

selectedDashboard: any = null;
  submitApiKey() {
    const obj = {
      key: this.apiKey,
    };
    this.workbechService.openApiKey(obj).subscribe({
      next: (data: any) => {
        if (data) {
          localStorage.setItem('API_KEY', obj.key);
          Swal.fire({
            icon: 'success',
            title: 'API Key Verification Success',
            text: 'Verified',
            width: '400px',
          }).then(() => {
            // Redirect to the previous page after success
            const previousUrl = localStorage.getItem('previousUrl');
            if (previousUrl) {
              this.router.navigateByUrl(previousUrl);
              localStorage.removeItem('previousUrl'); // Clear the stored URL
            } else {
              this.router.navigate(['analytify/home']); // Redirect to a default route if no previous URL
            }
          });
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'warning',
          text: error.error.message,
          width: '300px',
        });
        console.log(error);
      },
    });
  }
  preventSpaces(event: KeyboardEvent) {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
    }
  }
  getDashbaordList(){
    if(this.selectableDashbaord){
     this.workbechService.getuserDashboardsList().subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.dashboards=data
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'warning',
          text: error.error.message,
          width: '300px',
        });
        console.log(error);
      },
    });
  }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  getdashboardDetails(id:any){
 this.workbechService.getMailAletsDashboardData(id).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.dashboardName = data.data?.dashboard_name;
          this.updateTogglesFromApi(data.data?.mail_action);
          this.userId =data.data?.id;
          this.enabledEmail=data.data?.is_enabled;
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'warning',
          text: error.error.message,
          width: '300px',
        });
        console.log(error);
      },
    });
  }
  checkSaveorUpdate(){
    if(this.enabledEmail){
      this.updateEmailAlert();
    }else{
      this.emailAlertSave();
    }
  }
  updateTogglesFromApi(mailActionString: string) {
     let actions: string[] = [];

  try {
    // Check if it's a non-empty string and looks like an array
    if (mailActionString && mailActionString.trim().startsWith('[')) {
      // Parse safely (convert single quotes to double if needed)
      actions = JSON.parse(mailActionString.replace(/'/g, '"'));
    }
  } catch (error) {
    console.warn('Invalid mailAction string:', mailActionString, error);
    // Fallback: actions remains an empty array
  }

  // Set toggle values based on what's included in actions
  this.emailToggles = {
    update: actions.includes('update'),
    sync: actions.includes('manual'),
    autosync: actions.includes('auto-sync')
  };
  }
  onDashboardSelect(dashboard:any){
    this.dashboardId=dashboard?.dashboard_id;
    console.log(dashboard?.dashboard_id)
    this.getdashboardDetails(dashboard?.dashboard_id)
  }
  readonly toggleKeyMap = {
    update: 'update',
    sync: 'manual',
    autosync: 'auto-sync'
  };
  getSelectedMailActions(): string[] {
  return Object.entries(this.emailToggles)
    .filter(([_, isEnabled]) => isEnabled)
    .map(([key, _]) => this.toggleKeyMap[key as keyof typeof this.toggleKeyMap]);
}
  updateEmailAlert(){
    const obj={
    mail_action: this.getSelectedMailActions(),
    dashboard_id: this.dashboardId,
    id:this.userId,
    is_enabled:this.enabledEmail
    }
     this.workbechService.updateEmailAlerts(obj).subscribe({
      next: (data: any) => {
        if (data) {
           if(data.status ==='success'){
          this.toasterService.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
          this.getdashboardDetails(this.dashboardId);
          }
          console.log(data);
          this.dashboardName = data.data?.dashboard_name;
          this.updateTogglesFromApi(data.data?.mail_action);
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'warning',
          text: error.error.message,
          width: '300px',
        });
        console.log(error);
      },
    });
  }
  emailAlertSave(){
     const obj={
    mail_action: this.getSelectedMailActions(),
    dashboard_id: this.dashboardId,
     is_enabled:'True',
    }
     this.workbechService.saveEmailAlerts(obj).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          if(data.status ==='success'){
          this.toasterService.success('Saved Successfully','success',{ positionClass: 'toast-top-right'});
          this.getdashboardDetails(this.dashboardId);
          }
          this.dashboardName = data.data?.dashboard_name;
          this.updateTogglesFromApi(data.data?.mail_action);
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'warning',
          text: error.error.message,
          width: '300px',
        });
        console.log(error);
      },
    });
  }
}
