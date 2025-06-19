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

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule,NgSelectModule,NgbModule],
  templateUrl: './configure.component.html',
  styleUrl: './configure.component.scss',
})
export class ConfigureComponent implements OnInit {
  apiKey: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  activeTab = 'configure';
  dashboardId:any;
  sheetId:any;
  activateEmailTab=false;
  dashboardName:any;
  sheetName:any;
  selectableDashbaord = false;
  userId:any;
  enabledEmail=false;
  constructor(
    private workbechService: WorkbenchService,
    private http: HttpClient,
    private router: Router,route:ActivatedRoute,
    private toasterService:ToastrService
  ) {
    if(this.router.url.includes('/analytify/configure-page/email/dashboard')){
      if (route.snapshot.params['id'])
       this.activeTab = 'email',
       this.dashboardId = +atob(route.snapshot.params['id']);
       this.activateEmailTab=true;
       this.getdashboardDetails(this.dashboardId);
       this.selectableDashbaord=false;
       this.disableSheet = true;
       this.disableDatasource = true;
      this.activeEmailModule = 'dashboard';

    }else if (this.router.url.includes('/analytify/configure-page/email/sheet')) {
    this.activeTab = 'email',
    this.activeEmailModule = 'sheet';
    this.disableDashboard = true;
    this.disableSheet = false;
    this.activateEmailTab=true;
    this.disableDatasource = true;
    if (route.snapshot.params['id']) {
      this.sheetId = +atob(route.snapshot.params['id']);
      this.getsheetDetails(this.sheetId);
      this.selectableDashbaord = false;
    }
  } else {
    // Default: all enabled
    this.disableDashboard = false;
    this.disableSheet = false;
    this.disableDatasource = false;
    this.selectableDashbaord = true;
  }
    // if(this.router.url.includes('/analytify/configure-page/configure')){
    //    this.selectableDashbaord=true;
    // }

  }
  disableDashboard = false;
disableSheet = false;
disableDatasource = false;
emailToggles = {
  update: false,
  sync: false,
  autosync: false
};
sheetToggles = {
  sheet_update: false,
  sheet_refresh: false,
};
dashboards :any=[];
sheets :any=[];

activeEmailModule = 'dashboard';

ngOnInit(): void {
    // if(this.activateEmailTab){
    //   this.getdashboardDetails()
    // }
}

selectedDashboard: any = null;
selectedSheet: any = null;
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
  getSheetsList(){
    this.workbechService.getUserSheetList().subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.sheets = data;
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
  getsheetDetails(id:any){
    this.workbechService.getMailAlertsSheetsData(id).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.sheetName = data.data?.sheet_name;
           this.updateSheetTogglesFromApi(data.data?.mail_action);
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
  checkSaveorUpdateSheet(){
    if(this.enabledEmail){
      this.updateSheetEmailAlert();
    }else{
      this.saveSheetEmailAlert();
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
  updateSheetTogglesFromApi(mailActionString: string) {
  let actions: string[] = [];
  try {
    if (mailActionString && mailActionString.trim().startsWith('[')) {
      actions = JSON.parse(mailActionString.replace(/'/g, '"'));
    }
  } catch (error) {
    console.warn('Invalid mailAction string:', mailActionString, error);
  }
  this.sheetToggles = {
    sheet_update: actions.includes('sheet_update'),
    sheet_refresh: actions.includes('sheet_refresh'),
  };
}
  onDashboardSelect(dashboard:any){
    this.dashboardId=dashboard?.dashboard_id;
    console.log(dashboard?.dashboard_id)
    this.getdashboardDetails(dashboard?.dashboard_id)
  }
  onSheetSelect(sheet:any){
    this.sheetId=sheet?.sheet_id;
    this.getsheetDetails(sheet?.sheet_id);
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
          if(data){
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
  saveSheetEmailAlert() {
  const payload = {
    mail_action: this.getSelectedSheetMailActions(),
    sheet_id: this.sheetId,
    is_enabled: true
  };

  this.workbechService.saveEmailAlerts(payload)
    .subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);
          if(res){
          this.toasterService.success('Saved Successfully','success',{ positionClass: 'toast-top-right'});
          this.getdashboardDetails(this.dashboardId);
          }
          this.dashboardName = res.data?.dashboard_name;
          this.updateTogglesFromApi(res.data?.mail_action);
        } // Optionally refresh sheet alert data here
      },
      error: (err) => {
        this.toasterService.error('Failed to save sheet email alert');
      }
    });
}

updateSheetEmailAlert() {
  const payload = {
    id: this.userId,
    dashboard_id: null,
    sheet_id: this.sheetId,
    datasource_id: null,
    mail_action: this.getSelectedSheetMailActions(),
    is_enabled: true,
    alert_level: 'sheet'
  };

  this.workbechService.updateEmailAlerts(payload)
    .subscribe({
      next: (res: any) => {
        this.toasterService.success('Sheet email alert updated!');
        // Optionally refresh sheet alert data here
      },
      error: (err) => {
        this.toasterService.error('Failed to update sheet email alert');
      }
    });
}

// Helper to get selected actions as array
getSelectedSheetMailActions(): string[] {
  const actions = [];
  if (this.sheetToggles.sheet_update) actions.push('sheet_update');
  if (this.sheetToggles.sheet_refresh) actions.push('sheet_refresh');
  return actions;
}
}
