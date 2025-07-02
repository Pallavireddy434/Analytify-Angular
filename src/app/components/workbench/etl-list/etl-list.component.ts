import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etl-list',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule],
  templateUrl: './etl-list.component.html',
  styleUrl: './etl-list.component.scss'
})
export class EtlListComponent {
  gridView = true;
  page: any = 1;
  pageSize: any = 10;
  totalItems: any;
  search: string = '';
  dataFlowList: any[] = [];
  listType: string = 'Saved Data Flow';
  jobFlowList: any[] = [];
  monitorsList: any[] = [];

  constructor(private toasterService: ToastrService, private workbechService: WorkbenchService, private loaderService: LoaderService, private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loaderService.hide();
    this.getEtlList();
  }

  getDataFlowList(){
    this.workbechService.getEtlDataFlowList(this.page, this.pageSize, this.search, 'dataflow').subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowList = data.data;
        this.totalItems = data?.total_records;
        this.pageSize = data?.page_size;
        this.page = data?.page_number;
        if(this.dataFlowList.length === 0){
          this.pageSize = 10;
          this.page = 1;
          this.totalItems = 0;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }

  getJobFlowList() {
    // this.jobFlowList = [
    //   {job_flow_name: 'test_23', created_at: '2025-05-15T06:42:53.218831Z', updated_at: '2025-05-20T06:42:53.218831Z'}
    // ];
    // this.pageSize = 10;
    // this.page = 1;
    // this.totalItems = 1;

     this.workbechService.getEtlDataFlowList(this.page, this.pageSize, this.search, 'jobflow').subscribe({
      next: (data: any) => {
        console.log(data);
        this.jobFlowList = data.data;
        this.totalItems = data?.total_records;
        this.pageSize = data?.page_size;
        this.page = data?.page_number;
        if(this.dataFlowList.length === 0){
          this.pageSize = 10;
          this.page = 1;
          this.totalItems = 0;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }

  getMonitorList() {
    this.monitorsList = [
      {name: 'test_12', schedule: '2025-05-30T06:42:53.218831Z', latest_run: '2025-05-28T06:42:53.218831Z', next_run: '2025-05-29T06:42:53.218831Z'}
    ];
    this.pageSize = 10;
    this.page = 1;
    this.totalItems = 1;
  }

  deleteFlow(flow:any){
    Swal.fire({
      position: "center",
      icon: "question",
      title: `Delete ${flow.data_flow_name} ${this.listType === 'Saved Data Flow' ? 'DataFlow': 'JobFlow'} ?`,
      text: "This action cannot be undone. Are you sure you want to proceed?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.workbechService.deleteDataFlow(flow.id).subscribe({
          next: (response) => {
            console.log(response);
            if(this.listType === 'Saved Data Flow'){
              this.getDataFlowList();
            } else if(this.listType === 'Saved Job Flow'){
              this.getJobFlowList();
            }
            this.toasterService.success(response.message, 'success', { positionClass: 'toast-top-right' });
          },
          error: (error) => {
            console.log(error);
            this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          }
        })
      }
    })
  }

  goToDataFlow(){
    this.router.navigate(['/analytify/etlList/dataFlow']);
  }

  editDataFlow(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/etlList/dataFlow/'+encodedId]);
  }

  goToJobFlow(){
    this.router.navigate(['/analytify/etlList/jobFlow']);
  }

  editJobFlow(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/etlList/jobFlow/'+encodedId]);
  }

  goToMonitor(){
    this.router.navigate(['/analytify/etlList/monitor']);
  }

  onPageSizeChange() {
    // Reset to page 1 if you're on the last page and items may not fit
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.page > totalPages) {
      this.page = 1;
    }
    this.getDataFlowList();
  }
  getEtlList(){
    if(this.listType === 'Saved Data Flow'){
      this.getDataFlowList();
    } else if(this.listType === 'Saved Job Flow'){
      this.getJobFlowList();
    } else if(this.listType === 'Monitor List'){
      this.getMonitorList();
    }
  }
}
