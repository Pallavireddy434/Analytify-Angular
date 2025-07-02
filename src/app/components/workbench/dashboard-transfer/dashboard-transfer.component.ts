import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import { TemplateDashboardService } from '../../../services/template-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../shared/sharedmodule';
import { forkJoin } from 'rxjs';

/**
 * Component for importing and exporting dashboards.
 */
@Component({
  selector: 'app-dashboard-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule,SharedModule],
  templateUrl: './dashboard-transfer.component.html',
  styleUrls: ['./dashboard-transfer.component.scss']
})
export class DashboardTransferComponent {
  exportDashboardId! : number;
  importKey = '';
  hierarchyId! : number;
  loadingExport = false;
  exportResultKey = '';
  @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(
    private workbenchService: WorkbenchService,
    private templateDashboardService: TemplateDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(){
    forkJoin({
      responseA:  this.workbenchService.getdatabaseConnectionsList({need_pagination : false, need_cross_datasources: false}),
      responseB: this.workbenchService.getuserDashboardsList()
    }).subscribe({
      next: ({ responseA, responseB }) => {
        this.connectionsList = responseA;
        this.dashboardList = responseB;
        // this.loading = false;
      },
      error: (err) => {
        console.error('Error loading APIs', err);
        // this.loading = false;
      }
    });
    // this.getDashboardsList();
    // this.getdatabaseConnectionsList();
  }

  getdatabaseConnectionsList(){
    this.workbenchService.getdatabaseConnectionsList({need_pagination : false}).subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.connectionsList = responce;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
  connectionsList : any[] = [];
  dashboardList : any[] = [];
  getDashboardsList() {
    this.workbenchService.getuserDashboardsList().subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.dashboardList = responce;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  /** Trigger export of a dashboard using its ID and export key. */
  doExport(): void {
    if (!this.exportDashboardId) {
      this.toastr.error('Please enter dashboard ID.');
      return;
    }
    this.loadingExport = true;
    let payload = {dashboard_id :this.exportDashboardId};
    this.workbenchService.exportDashboard(payload).subscribe({
      next: (res: any) => {this.toastr.success('Export successful')
      this.exportResultKey = res.shared_dashboard_token;
    },
      error: err => {this.loadingExport = false;this.toastr.error(err.error?.message || 'Export failed')},
      complete: () => (this.loadingExport = false)
    });
  }

  /** Trigger import of a dashboard using import key and hierarchy ID. */
  doImport(): void {
    if (!this.importKey || !this.hierarchyId) {
      this.toastr.error('Please enter import key and pick connected datasource');
      return;
    }

    let payload = {  "hierarchy_id":this.hierarchyId,
    "dashboard_import_id":this.importKey
}
    this.workbenchService.importDashboard(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Import successful');
        this.templateDashboardService.buildDashboardTransfer(this.container,res);
      },
      error: err => this.toastr.error(err.error?.message || 'Import failed'),
    
    });
  }

  copyKey() {
    navigator.clipboard.writeText(this.exportResultKey);
    this.toastr.info('Copied to clipboard');
  }
}
