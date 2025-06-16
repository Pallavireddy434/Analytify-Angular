import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { tickStep } from 'd3';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoaderService } from '../../../shared/services/loader.service';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TestPipe } from '../../../test.pipe';
import { TemplateDashboardService } from '../../../services/template-dashboard.service';
const EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-database',
  standalone: true,
  imports: [SharedModule,NgSelectModule,CdkDropListGroup, CdkDropList, CdkDrag,NgbModule,FormsModule,NgbModule,CommonModule,InsightsButtonComponent,ScrollingModule,TestPipe],
  templateUrl: './database.component.html',
  styleUrl: './database.component.scss',
  animations:[
    trigger('toggle', [
      state('open', style({
        width: '610px', // Adjust as needed
        // flex: '1 1 610px',
        opacity: 1,
      })),
      state('closed', style({
        width: '0px',
        opacity: 0,
        display: 'none'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ]),
    ])
  ]
})

export class DatabaseComponent {

  @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  databaseName:any;
  tableName:any;
  tableJoiningList : any[] = [];
  joiningConditions : any[] = [];
  tableCustomJoinError : boolean = false;
  selectedClmnT1:any;
  selectedClmnT2:any;
  getSelectedT1:any;
  getSelectedT2:any;
  selectedSchema1:any;
  selectedSchema2:any;
  selectedCndn:any;
  selectedJoin:any;
  selectedAliasT1:any;
  selectedAliasT2:any;
  tableRelationUi = true;
  custmT1Data = [] as any;
  custmT2Data = [] as any;
  connectionList =[] as any;
  tableList = [] as any;
  schematableList = [] as any;
  filteredSchematableList = [] as any;
  hostName:any;
  dragedTableName: any;
  databaseconnectionsList=true;
  draggedtables = [] as any;
  dropdownOptions: any[] = [];
  remainingDropdownOptions: any[] = [];
  selectedOption: string | null = null;
  getTableColumns = [] as any;
  getTableRows = [] as any;
  relationOfTables = [] as any;
  displayJoiningCndnsList =[] as any;
  joinTypes = [] as any;
  databaseId:any;  
  fileId:any;
  sqlQuery ='';
  cutmquryTable = [] as any;
  TabledataJoining = [] as any;
  qryTime:any;
  qryRows:any;
  totalRows:any;
  showingRows:any;
  custmQryRows:any;
  custmQryTime:any;
  cutmquryTableError:any;
  showingRowsCustomQuery:any;
  totalRowsCustomQuery:any;
  remainingTables = [] as any;
  qurtySetId:any;
  custumQuerySetid:any;
  enableJoinBtn = true;
  customSql = false;
  tableJoiningUI = true;
  isOpen = false;
  searchTables : any;
  columnsInFilters = [] as any;
  searchFiltereredData = [] as any;
  tableColumnFilter!:boolean;
  columnRowFilter!:any;
  datasourceFilterId:any;
  rows: any;
  titleMarkDirty: boolean = false;
  datasourceFilterIdArray:any[] =[];
  datasourceFilterIdArrayCustomQuery:any[]=[];
  // selectedRows = [] as any;
  selectedRows: Set<number> = new Set();  

  datasourceQuerysetId :string | null =null;
  filteredList = [] as any;
  editFilterList = [] as any;
  searchEditFilterList = [] as any;
  columnWithTablesData = [] as any;
  isAllSelected: boolean = false;
  saveQueryName = '';
  updateQuery=false;
  dataType:any;
  colName:any;
  fromDatabasId = false;
  fromFileId = false;
  rowLimit:any;
  gotoSheetButtonDisable = true;
  fromSavedQuery = false;
  columnSearch! : string;
  columnDataSearch! : string;
  editFilterId!: number;
  fromSheetEditDb = false;
  fromQuickbooks = false;
  queryBuilt:any;

  searchTermT1:string = '';
  searchTermT2:string = '';
  filteredTablesT1: any[] = [];
  filteredTablesT2: any[] = [];
  filterParamPass:any;
  itemCounters: any={};
  sheetCustmSqlDisable = true;
  saveQueryCheck = false;
  isExclude = false;
  crossDbId= '';
  crossDbFilteredTablesT1: any[] = [];
  originalCrossDbTablesT1: any;
  crossDbConnections: any[] = [];
  isCrossDb = false;
  dragTablestoSemanticLayer = false;
  deleteTablesFromSemanticLayer = false;
  canSearchTablesInSemanticLayer = false;
  constructor( private workbechService:WorkbenchService,private router:Router,private route:ActivatedRoute,private modalService: NgbModal,private toasterService:ToastrService,private loaderService:LoaderService,private templateService:ViewTemplateDrivenService,private templateDashboardService: TemplateDashboardService){
    const currentUrl = this.router.url;
    this.dragTablestoSemanticLayer = this.templateService.dragTablesToSemanticLayer();
    this.deleteTablesFromSemanticLayer = this.templateService.canDeleteTablesFromSemanticLayer();
    this.canSearchTablesInSemanticLayer = this.templateService.canSearchTablesInSemanticLayer();
    if(currentUrl.includes('/analytify/database-connection/tables/')){
      const id1 = route.snapshot.paramMap.get('id1');
      const id2 = route.snapshot.paramMap.get('id2');
      if (id1 && id2) {
        this.fromDatabasId = true; 
        this.databaseId = +atob(id1);
        this.qurtySetId = +atob(id2);
        localStorage.setItem('QuerySetId', JSON.stringify(this.qurtySetId));
      } else if (id1) {
        this.fromDatabasId = true;
        this.databaseId = +atob(id1);
      }
      // this.fromDatabasId=true
      // this.databaseId = +atob(route.snapshot.params['id']);
    }
    else if(currentUrl.includes('/analytify/database-connection/savedQuery/')){
      if (route.snapshot.params['id1']) {
        this.databaseId = +atob(route.snapshot.params['id1']);
        this.fromDatabasId = true;
        this.saveQueryCheck = true;
      }
    
      if (route.snapshot.params['id2']) {
        this.custumQuerySetid = +atob(route.snapshot.params['id2']);
        localStorage.setItem('QuerySetId', JSON.stringify(this.custumQuerySetid));
        this.getSavedQueryData();
      }
    
      this.customSql = true;
      this.tableJoiningUI = false;
      this.updateQuery = true;
      this.fromSavedQuery = true;
      // this.getSchemaTablesFromConnectedDb();
     }
     else if(currentUrl.includes('/analytify/database-connection/customSql/')){
      this.custumQuerySetid = localStorage.getItem('customQuerySetId') || 0;
      this.fromDatabasId=true
      this.databaseId = +atob(route.snapshot.params['id']);
      this.customSql=true;
      this.tableJoiningUI=false;
     }
     else if(currentUrl.includes('/analytify/database-connection/sheets/')){
     if (route.snapshot.params['id1'] && route.snapshot.params['id2'] ) {
      this.databaseId = +atob(route.snapshot.params['id1']);
      this.qurtySetId = +atob(route.snapshot.params['id2']);
      localStorage.setItem('QuerySetId', JSON.stringify(this.qurtySetId));
      this.fromDatabasId = true;
      this.fromSheetEditDb = true;
      this.sheetCustmSqlDisable = false;
      this.saveQueryCheck = true;
      this.datasourceQuerysetId = atob(route.snapshot.params['id3'])
      if(this.datasourceQuerysetId==='null'){
        console.log('filterqrysetid',this.datasourceQuerysetId)
        this.datasourceQuerysetId = null
      }
      else{
          parseInt(this.datasourceQuerysetId)
          console.log(this.datasourceQuerysetId)
        }
      }
    }
     if(currentUrl.includes('/analytify/database-connection/tables/quickbooks/')){
      this.fromDatabasId=true;
      this.fromQuickbooks= true;
      this.databaseId = +atob(route.snapshot.params['id']);
      Swal.fire({
        position: "center",
        // icon: "question",
        iconHtml: '<img src="./assets/images/copilot.gif">',
        title: "Create smart dashboard from your data with just one click?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Skip',
        customClass: {
          icon: 'no-icon-bg',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.templateDashboardService.buildSampleQuickbooksDashboard(this.container, this.databaseId);
        }
      });
    }
    if(currentUrl.includes('/analytify/database-connection/tables/googlesheets/')){
      this.fromDatabasId=true;
      this.databaseId = +atob(route.snapshot.params['id']);
    }
    if(currentUrl.includes('/analytify/database-connection/tables/salesforce/')){
      this.fromDatabasId=true;
      this.fromQuickbooks= true;
      this.databaseId = +atob(route.snapshot.params['id']);
      Swal.fire({
        position: "center",
        // icon: "question",
        iconHtml: '<img src="./assets/images/copilot.gif">',
        title: "Create smart dashboard from your data with just one click?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        customClass: {
          icon: 'no-icon-bg',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.templateDashboardService.buildSampleSalesforceDashboard(this.container, this.databaseId);
        }
      });
    }
    if(currentUrl.includes('/analytify/database-connection/hubspot/')){
      this.fromDatabasId = true;
      this.databaseId = +atob(route.snapshot.params['id']);
    }
}
  ngOnInit(){
    this.loaderService.hide();
    if(this.customSql){
      this.getSavedQueryData();
      this.getSchemaTablesFromConnectedDb();
    }else{
    if(!this.updateQuery && !this.fromSheetEditDb){
      if(this.fromDatabasId){
    // this.getTablesFromConnectedDb();
    this.getSchemaTablesFromConnectedDb();
      }
    this.getTablesfromPrevious()
  }
  if(this.fromSheetEditDb){
    this.getTablesfromPrevious();
 if(this.fromDatabasId){
      this.getSchemaTablesFromConnectedDb();
    }
  }
}
  }
  backToTableJoining(){
    this.gotoSheetButtonDisable = true;
    const encodedId = btoa(this.databaseId.toString());
    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
  }
  custmSqlUI(){
    this.gotoSheetButtonDisable = true;
    const encodedId = btoa(this.databaseId.toString());
    this.router.navigate(['/analytify/database-connection/customSql/'+encodedId]);
  }
  toggleCard() {
    this.isOpen = !this.isOpen;
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
  getSavedQueryData(){
    const obj ={
      database_id:this.databaseId,
      queryset_id: this.custumQuerySetid
    }
    this.workbechService.getSavedQueryData(obj).subscribe({
      next:(data:any)=>{
        console.log(data);
      this.sqlQuery=data.custom_query
      this.saveQueryName=data.query_name
      this.cutmquryTable = data
        this.custmQryTime = data.query_exection_time;
        this.custmQryRows = data.no_of_rows;
        this.showingRowsCustomQuery=data.no_of_rows
        this.totalRowsCustomQuery=data.total_rows;
        this.datasourceQuerysetId = data.datasorce_queryset_id;
        if(this.datasourceQuerysetId){
          this.getfilteredCustomSqlData();
        }
        // if(this.fromSavedQuery){
        //   if(data.file_id === null)
        //   this.getSchemaTablesFromConnectedDb();
        // }else if(data.database_id === null){
        //   this.getTablesFromFileId();
        // }
      },
      error:(error:any)=>{
        console.log(error)
      }
    })
  }
  getTablesfromPrevious() {
    const querysetId = localStorage.getItem('QuerySetId') || 0;
    this.qurtySetId = querysetId
    if (querysetId !== 0) {
      const IdToPass = this.databaseId
      // const querySetIdToPass = this.from
      this.workbechService.getTablesfromPrevious(IdToPass, querysetId).subscribe({
        next: (data) => {
          console.log(data);
          this.relationOfTables = data.dragged_data.relation_tables
          console.log('tablerelation', this.relationOfTables)
          this.draggedtables = data.dragged_data.json_data.dragged_array;
          this.itemCounters = data.dragged_data.json_data.dragged_array_indexing;
          this.joinTypes = data.dragged_data.join_type;
          this.saveQueryName= data.dragged_data.queryset_name;
          this.checkQerynameChange = data.dragged_data.queryset_name;
          this.datasourceQuerysetId = data.dragged_data.dastasource_queryset_id;
          this.datasourceFilterIdArray = data.dragged_data.filter_list;
          if (this.draggedtables.length > 0) {
            this.joiningTables();
            this.dropdownOptions = this.buildDropdownOptions(this.draggedtables);
            //for custom join dropdown
            this.filterColumnsT1();
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  customSearch(term: string, item: any): boolean {
    return item.searchKey.toLowerCase().includes(term.toLowerCase());
  }

  buildDropdownOptions(tables:any) {
    let dropdownOptions:any[] = [];
  
    tables.forEach((tableName: any) => {
      const columns = tableName.columns; 
  
      const tableOptions = columns.map((column: any) => ({
        group: tableName.alias,  
        value: column.column, 
        column_dtype: column.datatype,
        
        searchKey: `${tableName.alias} ${column.column}` 
      }));
      dropdownOptions = [...dropdownOptions, ...tableOptions];
    });
    console.log(dropdownOptions);
  return dropdownOptions;
  }
  //need to remove after file id chage
  // getTablesFromFileId() {
  //   this.workbechService.getTablesFromFileId(this.fileId)
  //     .subscribe({
  //       next: (data) => {
  //         this.schematableList = data?.data?.schemas;
  //         // console.log('filteredscemas',this.filteredSchematableList)
  //         this.databaseName = data.filename;
  //         //  this.hostName = data.database.hostname;
  //         console.log(data)

  //       },
  //       error: (error) => {
  //         console.log(error);
  //       }
  //     })

  // }
getSchemaTablesFromConnectedDb(){
  const obj ={
    search:this.searchTables,
    querySetId:this.qurtySetId || this.custumQuerySetid,
    hierarchy_ids:[this.databaseId]
  }
  if(obj.search == '' || obj.search == null){
    delete obj.search;
  }
  if(obj.querySetId === '0' || obj.querySetId === 0){
    delete obj.querySetId
  }
  const IdToPass = this.databaseId
  this.schematableList =[];
  this.workbechService.getSchemaTablesFromConnectedDb(IdToPass,obj).subscribe({next: (data) => {
    this.crossDbConnections = data;
    this.isCrossDb = data[0]?.is_cross_db;
    if(data[0].cross_db_id){
      this.crossDbId = data[0].cross_db_id;
      console.log(this.crossDbId.length)
        console.log(this.crossDbId)
      this.crossDbFilteredTablesT1 = data[0].data?.schemas[0].tables
      this.filteredTablesT2 = data[1].data?.schemas[0].tables
      this.originalCrossDbTablesT1 = data[0].data?.schemas[0].tables;

    }
    data.forEach((dataTest: any) => {                                   
      if(dataTest?.data?.schemas && dataTest?.data?.schemas.length > 0){
        this.schematableList.push(dataTest?.data?.schemas[0]);
      }
    });
  //  this.schematableList= data?.data?.schemas;
  //  this.filteredSchematableList = this.schematableList?.data?.schemas
   console.log('filteredscemas',this.filteredSchematableList)
   this.databaseName = data[0]?.display_name;
        // this.hostName = data.database.hostname;
        // this.saveQueryName = data.queryset_name;
    console.log(data)

},
error:(error)=>{
 console.log(error);
}
})
}
//filter tables from schemas
filterTables(){
  if (Array.isArray(this.schematableList)) {
    const filteredSchemas = this.schematableList.map((schemaObj: { schema: any; tables: any[] }) => {
      return {
        schema: schemaObj.schema,
        tables: schemaObj.tables.filter(tableObj => tableObj.table.includes(this.searchTables))
      };
    }).filter((schemaObj: { tables: string | any[]; }) => schemaObj.tables.length > 0); // Filter out schemas with no matching tables
  
    if (filteredSchemas.length > 0) {
      console.log('Filtered data:', filteredSchemas);
      this.schematableList = filteredSchemas
    } else {
      console.log('No matching tables found');
    }
  } else {
    console.log('Something went wrong');
  }
}

private combineArrays(arraysOfObjects: { data: any[] }[]): any[]{
  let result: any[] = [];
for (const obj of arraysOfObjects) {
  if (Array.isArray(obj.data)) {
    result = result.concat(obj.data);
  }
}
return result;
}
drop(event: CdkDragDrop<string[]>) {4
  if (event.previousContainer === event.container) {
    // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    console.log('Internal swap is restricted.');
    return;
  } else {
    console.log('Transfering item to new container')
    let item: any = event.previousContainer.data[event.previousIndex];
    // console.log('item' + JSON.stringify(item));
    let copy: any = JSON.parse(JSON.stringify(item));
    // console.log('copy' + JSON.stringify(copy));
    let element: any = {};
    for (let attr in copy) {
      // console.log('attr' + attr);
      if (attr == 'title') {
        element[attr] = copy[attr];
      } else {
        element[attr] = copy[attr];
      }
    }
   const finalizeDrop = () => {
     this.pushToDraggedTables(element);
     console.log('darggedtable', this.draggedtables);
     if (parseInt(this.qurtySetId) !== 0) {
       this.joiningTables();
     } else if (parseInt(this.qurtySetId) === 0) {
       this.joiningTablesWithoutQuerySetId();
     }
   };

   if (!element.columns || element.columns.length === 0) {
     const dumpObj = { hierarchy_id: this.databaseId, tables: [element.table] };
     this.workbechService.dataDumping(dumpObj).subscribe({
       next: () => {
         this.refreshSchemaForTable(element, finalizeDrop);
       },
       error: () => finalizeDrop()
     });
   } else {
     finalizeDrop();
   }
  }
}

refreshSchemaForTable(table: any, callback: () => void) {
  const obj: any = {
    search: this.searchTables,
    querySetId: this.qurtySetId || this.custumQuerySetid,
    hierarchy_ids: [this.databaseId]
  };
  if (obj.search == '' || obj.search == null) {
    delete obj.search;
  }
  if (obj.querySetId === '0' || obj.querySetId === 0) {
    delete obj.querySetId;
  }
  const idToPass = this.databaseId;
  this.workbechService.getSchemaTablesFromConnectedDb(idToPass, obj).subscribe({
    next: (data) => {
      this.schematableList = [];
      this.crossDbConnections = data;
      this.isCrossDb = data[0]?.is_cross_db;
      if (data[0].cross_db_id) {
        this.crossDbId = data[0].cross_db_id;
        this.crossDbFilteredTablesT1 = data[0].data?.schemas[0].tables;
        this.filteredTablesT2 = data[1].data?.schemas[0].tables;
        this.originalCrossDbTablesT1 = data[0].data?.schemas[0].tables;
      }
      data.forEach((dataTest: any) => {
        if (dataTest?.data?.schemas && dataTest?.data?.schemas.length > 0) {
          this.schematableList.push(dataTest?.data?.schemas[0]);
        }
      });
      this.databaseName = data[0]?.display_name;
      for (const schemaObj of this.schematableList) {
        if (schemaObj.schema === table.schema) {
          const tbl = schemaObj.tables.find((t: any) => t.table === table.table);
          if (tbl) {
            table.columns = tbl.columns;
            break;
          }
        }
      }
      callback();
    },
    error: () => callback()
  });
}

pushToDraggedTables(newTable:any): void {

  const existingTableNames = this.draggedtables.map((table: { table: any; }) => table.table);
  const baseTableName = newTable.table
  const occurrences = existingTableNames.filter((name: string) => name.startsWith(baseTableName)).length;
  let tableName = newTable.table;
  if (!this.itemCounters[tableName] || !existingTableNames.includes(tableName)) {
    this.itemCounters[tableName] = 0;
  }

  let suffix = ++this.itemCounters[tableName];
    while (existingTableNames.includes(tableName)) {
      tableName = `${newTable.table}_${suffix}`;
    }
    newTable['alias']=tableName;
    this.draggedtables.push(newTable);
    this.dropdownOptions = this.buildDropdownOptions(this.draggedtables);
    this.filterColumnsT1();

}

getTablerowclms(table:any,schema:any){
  const obj ={
    database_id:this.databaseId,
    tables:[[schema,table]]
  }
  this.workbechService.getTableData(obj).subscribe({
    next:(data:any)=>{
      console.log(data);
      this.getTableColumns = data.column_data;
      this.getTableRows = data.row_data;
      this.tableName = data?.column_data[0]?.table
    },
    error:(error:any)=>{
      console.log(error)
    }
  })
}

onDeleteItem(index: number, tableName : string) {
  // if(index <= 0){
  //   this.relationOfTables =[];
  //   this.joinTypes = [];
  //   this.draggedtables = [];
  //   this.saveQueryName =  '';
  //   this.gotoSheetButtonDisable = true;
  // } else {
   this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
   this.isOpen = false;
   if(index > 0){
    this.relationOfTables.splice(index-1, 1);
    this.joinTypes.splice(index-1, 1);
  } else if(index == 0){
    this.relationOfTables.splice(index, 1);
    this.joinTypes.splice(index, 1);
  }
   this.deleteJoiningCondition(tableName)
  this.filterColumnsT1();
  // }
  this.joiningTablesFromDelete();
}

deleteJoiningCondition(tableName: string): void {
  let data = _.cloneDeep(this.relationOfTables);
   for (let i = 0; i < this.relationOfTables.length; i++) {
     let conditionGroup = data[i];
     let conditionIndex;
     let isArrayOfEmptyObjects = true;
     let conditiondata = _.cloneDeep(conditionGroup);
 for (const obj of conditionGroup) {
   if (!obj || Object.keys(obj).length > 0) {
     isArrayOfEmptyObjects = false;
    //  break;
   }
 
     if(!isArrayOfEmptyObjects){
       conditionIndex = conditiondata.findIndex((condition: any) => 
         condition?.table1.replace(/^"+|"+$/g, '') == tableName.replace(/^"+|"+$/g, '') || condition?.table2.replace(/^"+|"+$/g, '') == tableName.replace(/^"+|"+$/g, '')
     );
   } else {
     conditionIndex = 0;
   }
     if (conditionIndex !== -1) {
      conditiondata.splice(conditionIndex, 1);
     }
    }
    data[i] = conditiondata;
     // if(conditionGroup && conditionGroup.length <= 0){
     //   this.joinTypes.splice(i,1);
     // }
   }
   this.relationOfTables = data;
 }
buildCustomRelation(){
  const parts = this.selectedClmnT1.split('(');
  this.selectedClmnT1 = parts[0].trim()
  const parst = this.selectedClmnT2.split('(');
  this.selectedClmnT2 = parst[0].trim()
  const obj ={
    database_id:this.databaseId,
    tables : [[this.draggedtables[0].schema,this.draggedtables[0].table],[this.draggedtables[1].schema,this.draggedtables[1].table]],
    condition:[[this.draggedtables[0].schema+'.'+this.draggedtables[0].table+'.'+this.selectedClmnT1 +'=' +this.draggedtables[1].schema+'.'+this.draggedtables[1].table+'.'+this.selectedClmnT2]]
  }
  this.workbechService.tableRelation(obj)
    .subscribe(
      {
        next:(data:any) =>{
          console.log(data)
          this.relationOfTables = data[2]?.relation?.condition
          console.log('relation',this.relationOfTables)
        },
        error:(error:any)=>{
        console.log(error)
      }
      })
}
clrQuery(){
  this.sqlQuery = ''
  this.cutmquryTable=[];
  this.custmQryTime='';
  this.custmQryRows='';
  this.datasourceQuerysetId = null;
  this.datasourceFilterIdArrayCustomQuery = [];
  // this.gotoSheetButtonDisable = true;
  this.clearFiltersOnClearQuery();

}
clearFiltersOnClearQuery(){
  if(this.custumQuerySetid !== 0 || this.custumQuerySetid !== null || this.custumQuerySetid !== '0' ){
  this.workbechService.clearFiltersOnClearQuery(this.custumQuerySetid)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
      },
      error:(error:any)=>{
      console.error(error);
    }
    })
  }
}
checkQerynameChange:any;
executeQuery(){
  const obj ={
    database_id: this.databaseId,
    custom_query: this.sqlQuery,
    row_limit:this.rowLimit,
    queryset_id:this.custumQuerySetid,
    // query_name:this.saveQueryName,
  }as any
  if(this.saveQueryName === '' || this.saveQueryName === null || this.saveQueryName === undefined){
    delete obj.query_name
  }if(this.custumQuerySetid === 0 || this.custumQuerySetid === '0'){
    delete obj.queryset_id
  }
  this.workbechService.executeQuery(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        // this.relationOfTables = data[2]?.relation?.condition
        // console.log('relation',this.relationOfTables)
        this.cutmquryTable = data
        this.custmQryTime = data.query_exection_time;
        this.custmQryRows = data.no_of_rows;
        if(this.saveQueryName === '' || this.saveQueryName === null || this.saveQueryName === undefined){
          this.saveQueryName = data.query_name;
          this.checkQerynameChange = data.query_name;
          this.titleMarkDirty = true;
        }
        // this.qurtySetId = data.query_set_id;
        this.custumQuerySetid = data.query_set_id
        localStorage.setItem('customQuerySetId', JSON.stringify(this.custumQuerySetid));
        this.showingRowsCustomQuery=data.no_of_rows
        this.totalRowsCustomQuery=data.total_rows
        console.log('custumQuery Data',this.cutmquryTable)
        this.gotoSheetButtonDisable = false;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
      this.cutmquryTableError = error;
      this.gotoSheetButtonDisable = true;
    }
    })
}
downloadExcelFromCustomSql() {
  const obj ={
    database_id: this.databaseId,
    custom_query: this.sqlQuery,
    row_limit:this.totalRowsCustomQuery,
    queryset_id:this.custumQuerySetid,
    query_name:this.saveQueryName,
  }as any
  if(this.saveQueryName === '' || this.saveQueryName === null || this.saveQueryName === undefined){
    delete obj.query_name
  }
  this.workbechService.executeQuery(obj)
  .subscribe(
    {
      next:(data:any) =>{
            //Convert JSON data to worksheet
            // let cominedData =[data.column_data, data.row_data]
            let combinedData: any[] = data.row_data.map((row: any) => {
              let combined: { [key: string]: any } = {};
              data.column_data.forEach((column: string | number, index: string | number) => {
                combined[column] = row[index];
              });
              return combined;
            });
            // console.log(combinedData,'combined-data')
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);

          // Create a workbook and append the worksheet
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Write the workbook and download it
          const excelBuffer: any = XLSX.write(wb, {
              bookType: 'xlsx',
              type: 'array',
          });
           this.saveAsExcelFile(excelBuffer, 'ExportedData');
      },
      error:(error:any)=>{
      console.error('Error fetching data for download:', error);
    }
    })
}
filterColumnsT1() {
  if (this.searchTermT1.trim() === '') {
    this.filteredTablesT1 = this.draggedtables;
    return;
  }
  this.filteredTablesT1 = this.draggedtables.map((table: { columns: any[]; }) => {
    const filteredColumns = table.columns.filter(column =>
      column.column.toLowerCase().includes(this.searchTermT1.toLowerCase())
    );

    return filteredColumns.length > 0 ? { 
      ...table, 
      columns: filteredColumns 
    } : null;
  }).filter((table: null) => table !== null);

}

updateRemainingTables(item:any) {
  // this.remainingTables = this.draggedtables.filter((table: { alias: string; }) => table.alias !== this.selectedAliasT1);
  // this.remainingDropdownOptions = this.buildDropdownOptions(this.remainingTables);
  // this.filteredTablesT2 = this.remainingTables;
  // this.selectedAliasT2 = this.remainingTables.length > 0 ? this.remainingTables[0].alias : '';
}
filterColumnsT2(relation: any) {
  // If search term is empty, return all tables excluding the selected one
  if (relation.searchTermT2.trim() === '') {
    relation.table2Data = relation.originalData;
    return;
  }

  // Filter logic
  relation.table2Data = relation.originalData.map((table: { columns: any[]; alias: any; }) => {
    const filteredColumns = table.columns.filter(column =>
      column.column.toLowerCase().includes(relation.searchTermT2.toLowerCase())
    );

    return filteredColumns.length > 0 && table.alias !== this.selectedClmnT1 ? { 
      ...table, 
      columns: filteredColumns 
    } : null;
  }).filter((table:null) => table !== null);
}

joiningTablesWithoutQuerySetId(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
  // console.log(schemaTablePairs)
  const obj ={
    query_set_id:null,
    hierarchy_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:[],
    joining_conditions:[],
    dragged_array: {dragged_array:this.draggedtables,dragged_array_indexing:this.itemCounters},
  } as any
  this.workbechService.joiningTablesTest(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        localStorage.setItem('QuerySetId', JSON.stringify(this.qurtySetId));
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        this.getJoiningTableData();
        this.buildCustomJoin();
        this.tableCustomJoinError = false;
      },
      error:(error:any)=>{
      console.log(error);
      this.tableCustomJoinError = true;
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  
}
joiningTables(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
   console.log(schemaTablePairs)
   this.relationOfTables.push([])
   this.relationOfTables = this.relationOfTables.slice(0,this.joinTypes.length + 1);
  const obj ={
    query_set_id:this.qurtySetId,
    hierarchy_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:this.joinTypes,
    joining_conditions:this.relationOfTables,
    dragged_array: {dragged_array:this.draggedtables,dragged_array_indexing:this.itemCounters},
  }
  this.workbechService.joiningTablesTest(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        if(!(this.datasourceQuerysetId === null || this.datasourceQuerysetId === undefined)){
          this.getDsQuerysetId()
        }
        else{
          this.getJoiningTableData();
        }
        this.buildCustomJoin();
        // this.getJoiningTableData();
        this.gotoSheetButtonDisable = false;
        this.tableCustomJoinError = false;
      },
      error:(error:any)=>{
      console.log(error);
      this.tableCustomJoinError = true;
      if(error.error?.joining_condition && error.error?.joining_condition.length) {
        this.relationOfTables = error.error?.joining_condition;
        this.joinTypes.push("inner");
        // this.relationOfTables[this.relationOfTables.length - 1] = [{}];
        this.buildCustomJoin();
      }
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      });
      this.TabledataJoining = [];
      this.qryTime = '';
      this.qryRows ='';
      this.totalRows = '';
      this.showingRows = '';
      this.gotoSheetButtonDisable= true
    }
    })
}

buildCustomJoin(){
  this.tableJoiningList =[];
  this.joinTypes.forEach((element : any,index : number) => {
    let object;
    let remainingTables = [this.draggedtables[index + 1]];
    if(this.relationOfTables[index] && this.relationOfTables[index].length){
    object = {
       join : element,
       table1 : this.relationOfTables[index][0].table1,
       table2 : this.relationOfTables[index][0].table2,
       conditions : this.relationOfTables[index],
       table2Data : remainingTables,
       originalData : remainingTables,
       searchTermT2 : ''
    }
  } else {
    object = { join : element,conditions: [{}], table2Data : remainingTables,
      originalData : remainingTables,
      searchTermT2 : ''};
  }
    this.tableJoiningList.push(object);
  });

}

joiningTablesFromDelete(){
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any; alias:any }) => [item.schema, item.table, item.alias]);
   console.log(schemaTablePairs)
   this.relationOfTables = this.relationOfTables.slice(0,this.joinTypes.length);
  const obj ={
    query_set_id:this.qurtySetId,
    hierarchy_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:this.joinTypes,
    joining_conditions:this.relationOfTables,
    dragged_array: {dragged_array:this.draggedtables,dragged_array_indexing:this.itemCounters},
  }
  this.workbechService.joiningTablesTest(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id
        if(this.qurtySetId === 0){
          localStorage.setItem('QuerySetId','0');
          this.datasourceQuerysetId = null;
          this.saveQueryName = '';
        }
        this.joinTypes = data?.table_columns_and_rows?.join_types        
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        // this.getJoiningTableData();
        if(!(this.datasourceQuerysetId === null || this.datasourceQuerysetId === undefined)){
          this.getDsQuerysetId()
        }
        else{
          this.getJoiningTableData();
        }
        this.buildCustomJoin();
        this.tableCustomJoinError = false;
      },
      error:(error:any)=>{
      console.log(error);
      this.tableCustomJoinError = true;
      if(error.error?.joining_condition && error.error?.joining_condition.length) {
        // this.joinTypes.push("inner");
        // this.relationOfTables[this.relationOfTables.length - 1] = [{}];
        this.relationOfTables = error.error?.joining_condition;
        this.buildCustomJoin();
      }
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
customTableJoin(){
  // if( this.selectedJoin === undefined || this.selectedJoin === null || this.selectedCndn === undefined || this.selectedCndn === null){
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'oops!',
  //     text: 'Please Select Join Condition/Operator',
  //     width: '400px',
  //   })
  // }else{
  const schemaTablePairs = this.draggedtables.map((item: { schema: any; table: any;alias:any }) => [item.schema, item.table, item.alias]);
  console.log(schemaTablePairs)
  const t1Index = this.draggedtables.findIndex((x: { alias: any; }) => x.alias === this.selectedAliasT1)
  const t2Index = this.draggedtables.findIndex((x: { alias: any; }) => x.alias === this.selectedAliasT2)

  console.log('indexoftable1',t1Index);
   console.log('indexoftable2',t2Index);
  const customJoinCndn = '"'+this.selectedAliasT1+'"."'+this.selectedClmnT1+'" '+this.selectedCndn+' "'+this.selectedAliasT2+'"."'+this.selectedClmnT2+'"'
   const MaxInex = Math.max(t1Index,t2Index);
  console.log('custcon',customJoinCndn, 'maxind',MaxInex)
  // if (!this.relationOfTables[MaxInex - 1]) {
  //   this.relationOfTables[MaxInex - 1] = [];
  // }
  // this.relationOfTables[MaxInex - 1].push(customJoinCndn)
  // console.log('customrelation',this.relationOfTables)
  let joiningConditions : any[]= [];
 this.tableJoiningList.forEach(tableData=>{
   joiningConditions.push(tableData.conditions);
 })
  this.joinTypes[MaxInex - 1] = this.selectedJoin
  console.log(this.joinTypes)
  if(schemaTablePairs.length >= 2){
  const obj ={
    query_set_id:this.qurtySetId,
    hierarchy_id:this.databaseId,
    joining_tables: schemaTablePairs,
    join_type:this.joinTypes,
    joining_conditions:joiningConditions,
    dragged_array: {dragged_array:this.draggedtables,dragged_array_indexing:this.itemCounters},
  }
  this.workbechService.joiningTablesTest(obj)
  .subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.relationOfTables = data.table_columns_and_rows?.joining_condition;
        this.displayJoiningCndnsList = data.table_columns_and_rows?.joining_condition_list;
        this.qurtySetId = data?.table_columns_and_rows?.query_set_id;       
        console.log('joining',data)
        console.log('relation',this.relationOfTables);
        if(!(this.datasourceQuerysetId === null || this.datasourceQuerysetId === undefined)){
          this.getDsQuerysetId()
        }
        else{
          this.getJoiningTableData();
        }
        this.buildCustomJoin();
        // this.getJoiningTableData();
        this.clearJoinCondns();
        this.tableCustomJoinError = false;
      },
      error:(error:any)=>{
      console.log(error);
      this.tableCustomJoinError = true;
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
      // this.relationOfTables.pop();
    }
    })
  // }
}
}

// populateDropdown() {
//   const dropdownMenu = document.getElementById('dropdownMenu');
//   const selectedTableDiv = document.getElementById('selectedTable');

//   if(dropdownMenu){
//     dropdownMenu.innerHTML = '';
//   this.draggedtables.forEach((tableData: { schema: any; table: any; columns: any[]; }) => {
//     // Add table name as header
//     const tableHeader = document.createElement('li');
//     tableHeader.className = 'dropdown-header';
//     tableHeader.textContent = `${tableData.schema}.${tableData.table}`;
//     dropdownMenu.appendChild(tableHeader);

//     // Add columns
//     tableData.columns.forEach(column => {
//       console.log("Column:", column.columns); //
//       const columnItem = document.createElement('li');
//       columnItem.textContent = `${column.columns} (${column.datatypes})`;
//       columnItem.onclick = function() {
//         // Handle column selection
//         selectedTableDiv!.innerHTML = `${tableData.schema}<br>${tableData.table}`;
//         const dropdownButton = document.getElementById('dropdownMenuButton');
//         dropdownButton!.textContent = `${column.columns}`;
//         console.log("Selected column:", column.columns, "Table:", tableData.table, "Schema:", tableData.schema);
//       };
//       dropdownMenu.appendChild(columnItem);
//     });

//     // Add divider
//     const divider = document.createElement('li');
//     divider.className = 'divider';
//     dropdownMenu.appendChild(divider);
//   });
// }else{
//   console.log('erriieor')
// }
// this.enableJoinButton();
// }
// s

enableJoinButton(){

if( this.selectedJoin && this.selectedCndn)
  {
    this.enableJoinBtn = false;
  }else {
    this.enableJoinBtn = true;
  }
  
}
clearJoinCondns(){
 
  this.selectedJoin ='Condition';
  this.selectedCndn ='Operator';
  this.selectedClmnT1=null
  this.selectedClmnT2=null;
  this.enableJoinButton();
}

getJoiningTableData(){
  const obj ={
    hierarchy_id:this.databaseId,
    query_id:this.qurtySetId,
    datasource_queryset_id:this.datasourceQuerysetId,
    row_limit:this.rowLimit
  } as any
if(obj.row_limit === null || obj.row_limit === undefined){
 delete obj.row_limit;
}
  this.workbechService.getTableJoiningData(obj).subscribe(
    {
      next:(data:any) =>{
        console.log('qury_data/tablejoined_data',data)
        this.TabledataJoining = data;
        this.qryTime = data.query_exection_time;
        this.qryRows = data.no_of_rows;
        this.totalRows = data.total_rows;
        this.showingRows = data.no_of_rows;
        this.gotoSheetButtonDisable = false;
        if(this.saveQueryName ==='' || this.saveQueryName === null || this.saveQueryName === undefined){
        this.saveQueryName = data.queryset_name;
        this.checkQerynameChange = data.queryset_name;
        this.titleMarkDirty = true;
        }
        this.queryBuilt = data.custom_query;
        if(this.TabledataJoining?.column_data?.length === 0){
          this.gotoSheetButtonDisable = true;
        }
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })

    }
    })
}

downloadExcel() {
  const obj ={
    hierarchy_id:this.databaseId,
    query_id:this.qurtySetId,
    datasource_queryset_id:this.datasourceQuerysetId,
    row_limit:this.totalRows
  } as any
if(obj.row_limit === null || obj.row_limit === undefined){
 delete obj.row_limit;
} 
  this.workbechService.getTableJoiningData(obj).subscribe(
    {
      next:(data:any) =>{
            //Convert JSON data to worksheet
            // let cominedData =[data.column_data, data.row_data]
            let combinedData: any[] = data.row_data.map((row: any) => {
              let combined: { [key: string]: any } = {};
              data.column_data.forEach((column: string | number, index: string | number) => {
                combined[column] = row[index];
              });
              return combined;
            });
            // console.log(combinedData,'combined-data')
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);

          // Create a workbook and append the worksheet
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Write the workbook and download it
          const excelBuffer: any = XLSX.write(wb, {
              bookType: 'xlsx',
              type: 'array',
          });
           this.saveAsExcelFile(excelBuffer, 'ExportedData');
      },
      error:(error:any)=>{
      console.error('Error fetching data for download:', error);
    }
    })
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}

deleteJoiningRelation(conditionIndex:number,list : any,index: number){
  list.conditions.splice(conditionIndex, 1);
  this.relationOfTables[index] = list.conditions;
  // this.joiningTables();
}

openSuperScaled(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
  this.tableColumnFilter = true;
  this.columnRowFilter = false;
}
openSuperScaledGetColunmns(modal: any){
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
  this.tableColumnFilter = true;
  this.columnRowFilter = false;
  this.callColumnWithTable();

}
openRowsData(modal: any) {
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
}
callColumnWithTable(){
  let querySetIdToPass = (this.filterParamPass === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
  const obj ={
    hierarchy_id:this.databaseId,
    query_set_id :querySetIdToPass,
    type_of_filter:'datasource',
    search : this.columnSearch
  }
  this.workbechService.callColumnWithTable(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
       this.columnWithTablesData= data
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
seachColumnDataFilter() {

  if (this.columnDataSearch) {
    // Perform local filtering based on the search input
    this.searchFiltereredData = this.columnsInFilters.filter((column: { label: string; }) => 
        // column.label && column.label.toLowerCase().includes(this.columnDataSearch.toLowerCase())
    String(column.label).toLowerCase().includes(this.columnDataSearch.toLowerCase())

    );
} else {
    // If the search input is empty, reset to show all data
    this.searchFiltereredData = this.columnsInFilters;
}


}
// seachColumnDataFilter(){
//   const obj ={
//     database_id:this.databaseId,
//     query_set_id:this.qurtySetId,
//     datasource_queryset_id:this.datasourceQuerysetId,
//     type_of_filter:'datasource',
//     col_name:this.colName,
//     data_type:this.dataType,
//     search : this.columnDataSearch
//   }as any;
//   if(this.fromFileId){
//     delete obj.database_id
//     obj.file_id = this.fileId
//   }
//   this.workbechService.selectedColumnGetRows(obj).subscribe(
//     {
//       next:(data:any) =>{
//         console.log(data)
//         this.columnsInFilters= data.col_data.map((item: any) => ({ label: item, selected: false }))
//         this.tableColumnFilter =false;
//         this.columnRowFilter = true;
//         console.log('colmnfilterrows',this.columnsInFilters)
//       },
//       error:(error:any)=>{
//       console.log(error);
//       Swal.fire({
//         icon: 'error',
//         title: 'oops!',
//         text: error.error.message,
//         width: '400px',
//       })
//     }
//     })
// }
selectedColumnGetRows(col:any,datatype:any){
  let querySetIdToPass = (this.filterParamPass === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
  const obj ={
    hierarchy_id:this.databaseId,
    query_set_id:querySetIdToPass,
    datasource_queryset_id:this.datasourceQuerysetId,
    type_of_filter:'datasource',
    col_name:col,
    data_type:datatype,
  }
  this.colName = col;
  this.dataType = datatype;
  this.isExclude = false;
  this.workbechService.selectedColumnGetRows(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.columnsInFilters= data.col_data.map((item: any) => ({ label: item, selected: false }))
        // this.datasourceFilterId=data.filter_id;
        // this.datasourceFilterIdArray.push(data.filter_id);
        this.tableColumnFilter =false;
        this.columnRowFilter = true;
        console.log('colmnfilterrows',this.columnsInFilters)
        setTimeout(() => {
        this.searchFiltereredData = this.columnsInFilters
        },500);
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
updateSelectedRows() {
  // this.selectedRows = this.columnsInFilters
  //   .filter((row: { selected: any; }) => row.selected)
  //   .map((row: { label: any; }) => row.label);
  this.selectedRows = new Set(
    this.searchFiltereredData
      .filter((row: { selected: any; }) => row.selected) // Now filtering based on actual selection
      .map((row: { label: any; }) => row.label)
  );
  console.log('selected rows', this.selectedRows);
  this.isAllSelected = this.columnsInFilters.every((row: { selected: any; }) => row.selected);
}

toggleAllRows(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  // this.columnsInFilters.forEach((row: { selected: boolean; }) => row.selected = isChecked);
  if (isChecked) {
    // If "Select All" is checked, store all row labels in selectedRows
    this.selectedRows = new Set(this.columnsInFilters.map((row: { label: any; }) => row.label));
  } else {
    // If deselected, clear the selectedRows Set
    this.selectedRows.clear();
  }
  this.columnsInFilters.forEach((row: { selected: boolean; }) => (row.selected = isChecked));
  console.log('All Selected:', isChecked, 'Selected Rows:', Array.from(this.selectedRows));
  // this.updateSelectedRows();
}
isAnyRowSelected(): boolean {
  // return this.columnsInFilters.some((row: { selected: any; }) => row.selected);
  return this.selectedRows.size > 0;

}
trackByFn(index: number, item: any) {
  return item.id;
}
isSelected(rowId: number): boolean {
  return this.selectedRows.has(rowId);
}
getSelectedRows() {
  this.columnDataSearch = "";
  this.columnSearch = "";
  this.selectedRows = this.columnsInFilters
  .filter((row: { selected: any; }) => row.selected)
  .map((row: { label: any; }) => row.label);
  console.log('selected rows',this.selectedRows);
  let querySetIdToPass = (this.filterParamPass === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
  const obj = {
    filter_id:null,
    hierarchy_id:this.databaseId,
    queryset_id:querySetIdToPass,
    type_of_filter:'datasource',
    datasource_querysetid:null,
    select_values:this.selectedRows,
    range_values:null,
    col_name:this.colName,
    data_type:this.dataType,
    is_exclude:this.isExclude
  }
  this.workbechService.getSelectedRowsFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceFilterId = data.filter_id;
        if(this.filterParamPass === 'fromcustomsql'){
          this.datasourceFilterIdArrayCustomQuery.push(data.filter_id)
        }else{
         this.datasourceFilterIdArray.push(data.filter_id);
        }
        this.getDsQuerysetId();
        this.modalService.dismissAll('close')
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
getDsQuerysetId(){
  let querySetIdToPass = (this.filterParamPass === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
  const obj ={
    datasource_queryset_id:this.datasourceQuerysetId,
    queryset_id:querySetIdToPass,
    filter_id:(this.filterParamPass === 'fromcustomsql') ? this.datasourceFilterIdArrayCustomQuery : this.datasourceFilterIdArray,
    hierarchy_id:this.databaseId
  }
  this.workbechService.getDsQuerysetId(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceQuerysetId = data.data.datasource_queryset_id;
        if(this.tableJoiningUI){
        this.getJoiningTableData();
        }
        if(this.customSql){
          this.getfilteredCustomSqlData();
        }
        // this.getFilteredList();
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}
getFilteredList(fromParam:any){

  let querySetIdToPass = (fromParam === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
  this.filterParamPass = fromParam
  const obj ={
    query_set_id:querySetIdToPass,
    hierarchy_id:this.databaseId,
    type_of_filter:'datasource'
  }
  this.workbechService.getFilteredList(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.filteredList = data.filters_data;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
}

seachColumnDataFilterEdit() {
  if (this.columnDataSearch) {
    // Perform local filtering based on the search input
    this.searchEditFilterList = this.editFilterList.filter((column: { label: string; }) => 
        // column.label && column.label.toLowerCase().includes(this.columnDataSearch.toLowerCase())
    String(column.label).toLowerCase().includes(this.columnDataSearch.toLowerCase())
    );
} else {
    // If the search input is empty, reset to show all data
    this.searchEditFilterList = this.editFilterList;
}
}
editFilter(id:any){
  this.editFilterId = id;
  const obj ={
    type_filter:'datasource',
    hierarchy_id:this.databaseId,
    filter_id:id,
    search : this.columnDataSearch
  }
  this.workbechService.editFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.editFilterList = data.result;
        this.colName=data.column_name,
        this.dataType = data.data_type
        this.searchEditFilterList = this.editFilterList;
        this.isExclude = data.is_exclude;
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
deleteFilter(id:any){
  this.modalService.dismissAll('close')
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result)=>{
    if(result.isConfirmed){
  this.workbechService.deleteFilter(id).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        if(data){
          this.toasterService.success('Filter Removed Successfully','success',{ positionClass: 'toast-top-right'});
        }
        console.log('filter ids',this.datasourceFilterIdArray)
        if(this.filterParamPass ==='fromcustomsql'){
          this.datasourceFilterIdArrayCustomQuery = this.datasourceFilterIdArrayCustomQuery.filter(item => item !== id);
          if(this.datasourceFilterIdArrayCustomQuery.length === 0){
            this.datasourceFilterId = null;
          }
        }else{
          this.datasourceFilterIdArray = this.datasourceFilterIdArray.filter(item => item !== id);
          if(this.datasourceFilterIdArray.length === 0){
            this.datasourceFilterId = null;
          }
        }
        
        this.getDsQuerysetId()
        this.getFilteredList(this.filterParamPass);
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  }})


}

updateEditSelectedRows() {
  this.selectedRows = this.editFilterList
    .filter((row: { selected: any; }) => row.selected)
    .map((row: { label: any; }) => row.label);
  console.log('selected rows', this.selectedRows);

  this.isAllSelected = this.editFilterList.every((row: { selected: any; }) => row.selected);
}

toggleEditAllRows(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.editFilterList.forEach((row: { selected: boolean; }) => row.selected = isChecked);
  this.updateEditSelectedRows();
}
isAnyEditRowSelected(): boolean {
  return this.editFilterList.some((row: { selected: any; }) => row.selected);
}
getSelectedRowsFromEdit() {
  this.columnDataSearch = "";
  this.columnSearch = "";
  this.selectedRows = this.editFilterList
  .filter((row: { selected: any; }) => row.selected)
  .map((row: { label: any; }) => row.label);
  console.log('selected rows',this.selectedRows);
  let querySetIdToPass = (this.filterParamPass === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;

  const obj = {
    filter_id: this.editFilterId,
    hierarchy_id:this.databaseId,
    queryset_id:querySetIdToPass,
    type_of_filter:'datasource',
    datasource_querysetid:null,
    select_values:this.selectedRows,
    range_values:null,
    col_name:this.colName,
    data_type:this.dataType,
    is_exclude:this.isExclude
  }
  this.workbechService.getSelectedRowsFilter(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        this.datasourceFilterId = data.filter_id;
        if(this.filterParamPass === 'fromcustomsql'){
          this.datasourceFilterIdArrayCustomQuery.push(data.filter_id)
        }else{
         this.datasourceFilterIdArray.push(data.filter_id);
        }
        this.getDsQuerysetId();
         this.modalService.dismissAll('close')
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })

}
getfilteredCustomSqlData(){
    const obj ={
      hierarchy_id:this.databaseId,
      query_id:this.custumQuerySetid,
      datasource_queryset_id:this.datasourceQuerysetId
    }
    this.workbechService.getTableJoiningData(obj).subscribe(
      {
        next:(data:any) =>{
          console.log('qury_data/tablejoined_data',data)
          this.cutmquryTable = data;
          this.custmQryTime = data.query_exection_time;
          this.custmQryRows = data.no_of_rows;
          // this.saveQueryName = data.queryset_name;
          this.showingRowsCustomQuery=data.no_of_rows
          this.totalRowsCustomQuery=data.total_rows
        },
        error:(error:any)=>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
      })
  
}
goToConnections(){
  // const hidToPass = btoa(this.databaseId.toString());
  const hidToPass = this.crossDbId ? btoa(this.crossDbId.toString()) : btoa(this.databaseId.toString());
  if(!this.customSql){
  if(this.qurtySetId){
    const qrysetIdToPass = btoa(this.qurtySetId.toString());
    this.router.navigate(['/analytify/datasources/crossdatabase/viewconnection/'+hidToPass+'/'+qrysetIdToPass])
  }
  else{
  this.router.navigate(['/analytify/datasources/crossdatabase/viewconnection/'+hidToPass])
  }
}else if(this.customSql){
  if(this.custumQuerySetid){
    const qrysetIdToPass = btoa(this.custumQuerySetid.toString());
    this.router.navigate(['/analytify/datasources/crossdatabase/customsql/viewconnection/'+hidToPass+'/'+qrysetIdToPass])
  }
  else{
  this.router.navigate(['/analytify/datasources/crossdatabase/customsql/viewconnection/'+hidToPass])
  }
}
}

markDirty(){
  this.titleMarkDirty = true;
}
checkNameChanged(){
  if(this.saveQueryCheck){
    if(this.checkQerynameChange !== this.saveQueryName){
    this.titleMarkDirty = true;
    }
  }
}
  goToSheet(fromParam: string) {
    this.goToSheetButtonClicked = true;
      let querySetIdToPass = (fromParam === 'fromcustomsql') ? this.custumQuerySetid : this.qurtySetId;
      let querySetIdToDelete = (fromParam === 'fromcustomsql') ? this.qurtySetId : this.custumQuerySetid
    if (this.saveQueryName === '' || this.saveQueryName == null || this.saveQueryName == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: 'Please enter title to save',
        width: '400px',
      })
    } else {
        const encodedDatabaseId = btoa(this.databaseId.toString());
        const encodedQuerySetId = btoa(querySetIdToPass.toString());
        this.checkNameChanged();
        if (this.datasourceQuerysetId === null || this.datasourceQuerysetId === undefined) {
          // Encode 'null' to represent a null value
          const encodedDsQuerySetId = btoa('null');
          if (this.titleMarkDirty) {
            let payload = { database_id: this.databaseId, query_set_id: querySetIdToPass, query_name: this.saveQueryName,delete_query_id:querySetIdToDelete}
            this.workbechService.updateQuerySetTitle(payload).subscribe({
              next: (data: any) => {
                this.router.navigate(['/analytify/sheets' + '/' + encodedDatabaseId + '/' + encodedQuerySetId + '/' + encodedDsQuerySetId])
              },
              error: (error: any) => {
                console.log(error);
                Swal.fire({
                  icon: 'error',
                  title: 'oops!',
                  text: error.error.message,
                  width: '400px',
                })
              }
            });
          } else {
            this.router.navigate(['/analytify/sheets' + '/' + encodedDatabaseId + '/' + encodedQuerySetId + '/' + encodedDsQuerySetId])
          }
        } else {
          // Convert to string and encode
          const encodedDsQuerySetId = btoa(this.datasourceQuerysetId.toString());
          if (this.titleMarkDirty) {
            let payload = { database_id: this.databaseId, query_set_id: querySetIdToPass, query_name: this.saveQueryName,delete_query_id:querySetIdToDelete}
            this.workbechService.updateQuerySetTitle(payload).subscribe({
              next: (data: any) => {
                this.router.navigate(['/analytify/sheets' + '/' + encodedDatabaseId + '/' + encodedQuerySetId + '/' + encodedDsQuerySetId])
              },
              error: (error: any) => {
                console.log(error);
                Swal.fire({
                  icon: 'error',
                  title: 'oops!',
                  text: error.error.message,
                  width: '400px',
                })
              }
            });
          } else {
            this.router.navigate(['/analytify/sheets' + '/' + encodedDatabaseId + '/' + encodedQuerySetId + '/' + encodedDsQuerySetId])
          }
        }
      }
    // }
  }

saveQuery(){
  if(this.saveQueryName === ''){
    Swal.fire({
      icon: 'error',
      title: 'oops!',
      text: 'Please enter name to save query',
      width: '400px',
    })
  }else{
    const queryIdToPass = this.customSql ? this.custumQuerySetid : this.qurtySetId;
  const obj ={
    database_id:this.databaseId,
    query_set_id:queryIdToPass,
    query_name:this.saveQueryName,
    custom_query:this.sqlQuery
  }
  this.workbechService.saveQueryName(obj).subscribe(
    {
      next:(data:any) =>{
        console.log(data)
        if(data){
          this.toasterService.success('Saved Successfully','success',{ positionClass: 'toast-top-right'});

        }
      },
      error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
    })
  }
}
updateCustmQuery(){
  if(this.saveQueryName === ''){
    Swal.fire({
      icon: 'error',
      title: 'oops!',
      text: 'Please enter name to save query',
      width: '400px',
    })
  }else{
  const obj ={
    database_id:this.databaseId,
    queryset_id:this.custumQuerySetid,
    query_name:this.saveQueryName,
    custom_query:this.sqlQuery
  }
  this.workbechService.updateCustmQuery(obj).subscribe({
    next:(data:any)=>{
      console.log(data);
    this.sqlQuery=data.custom_query
    this.saveQueryName=data.query_name
    this.cutmquryTable = data
      this.custmQryTime = data.query_exection_time;
      this.custmQryRows = data.no_of_rows;
      this.showingRowsCustomQuery=data.no_of_rows
      this.totalRowsCustomQuery=data.total_rows;
      this.gotoSheetButtonDisable = false;
    },
    error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  })
}
}
goToSheetButtonClicked = false;
// Method to show alert when unsaved changes exist
dataNotSaveAlert(): Promise<boolean> {
  if (this.goToSheetButtonClicked) {
    // If the "Go to Sheet" button is clicked, skip the alert
    return Promise.resolve(true);
  }
  this.loaderService.hide();
  return Swal.fire({
    position: "center",
    icon: "warning",
    title: "Your work has not been saved, Do you want to continue?",
    showConfirmButton: true,
    showCancelButton: true,
    showDenyButton: true,  
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    denyButtonText: 'Save & Proceed',
    customClass: {
      confirmButton: 'btn btn-primary',
      denyButton: 'btn btn-success'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // User clicked "Yes", allow navigation
      this.loaderService.show();
      return true;
    }  else if (result.isDenied) {
      this.saveQuery();
      return true;
    } else {
      // User clicked "No", prevent navigation
      this.loaderService.hide();
      return false;
    }
  });
}


// The `canDeactivate` method is used by the guard
canDeactivate(): boolean {
  // This is handled in the functional guard
  return !this.gotoSheetButtonDisable; 
}

viewQuery(modal:any){
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
    size: 'lg'
  });
}
copyQuery(){
  if (navigator.clipboard) {
    navigator.clipboard.writeText(this.queryBuilt).then(() => {
      console.log(this.queryBuilt);
      this.toasterService.success('Query Copied', 'success', { positionClass: 'toast-top-right' });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      this.fallbackCopyTextToClipboard(this.queryBuilt);
    });
  } else {
    // Fallback if navigator.clipboard is not available
    this.fallbackCopyTextToClipboard(this.queryBuilt);
  }
}

fallbackCopyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // Avoid scrolling to bottom
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      this.toasterService.success('Query Copied', 'success', { positionClass: 'toast-top-right' });
    } else {
      console.error('Fallback: Could not copy text');
    }
  } catch (err) {
    console.error('Fallback: Unable to copy', err);
  }
  document.body.removeChild(textArea);
}

addNewCondition(relation : any){
  relation.conditions.push({
   
  });
}



filterColumnsT1CrsDb() {
  if (this.searchTermT1.trim() === '') {
    // Restore the original data when search is cleared
    this.crossDbFilteredTablesT1 = [...this.originalCrossDbTablesT1];  
    return;
  }

  this.crossDbFilteredTablesT1 = this.originalCrossDbTablesT1
    .map((table: { columns: any[] }) => {
      const filteredColumns = table.columns.filter(column =>
        column.column.toLowerCase().includes(this.searchTermT1.toLowerCase())
      );

      return filteredColumns.length > 0 
        ? { ...table, columns: filteredColumns } 
        : null;
    })
    .filter((table:any): table is { columns: any[] } => table !== null);
}
buildRelation(){
  const relation = [{db1: this.selectedSchema1,
    table1: this.getSelectedT1,
    firstcolumn: this.selectedClmnT1,
    operator: "=",
    db2:this.selectedSchema2,
    table2: this.getSelectedT2,
    secondcolumn: this.selectedClmnT2}]
  const obj ={
   hierarchy_id:this.databaseId,
   joining_conditions:relation
  }
  this.workbechService.buildRelation(obj).subscribe({
    next:(data:any)=>{
      console.log(data);
    },
    error:(error:any)=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.message,
        width: '400px',
      })
    }
  }) 
}
clearRelationCondns(){
  this.selectedCndn ='Operator';
  this.selectedClmnT1=null
  this.selectedClmnT2=null;
}

openDeleteCrossDbModal(modal: any){
  this.modalService.open(modal, {
    centered: true,
    windowClass: 'animate__animated animate__zoomIn',
  });
}

deleteConnectedDb(db:any){
  const obj = {
    cross_db_id: db.cross_db_id,
    delete_db_id: db.hierarchy_id
  };
  this.workbechService.crossDbDeletion(obj).subscribe({
    next: (data: any) => {
      this.crossDbConnections = this.crossDbConnections.filter((item: any) => item.hierarchy_id !== db.hierarchy_id);
      this.isCrossDb = this.crossDbConnections.length > 1;
      if(this.crossDbConnections.length){
        this.databaseName = this.crossDbConnections[0].display_name;
      }
      if(this.crossDbConnections.length <= 1){
        this.modalService.dismissAll('close');
      }
      this.databaseId = data.id;
      this.getSchemaTablesFromConnectedDb();
      this.toasterService.success('Database Deleted Successfully','success',{ positionClass: 'toast-top-right'});
    },
    error: (data:any) => {
      this.toasterService.error('Unable to delete database.'+ data?.error?.message,'error',{ positionClass: 'toast-top-right'});
    }
  });
}
}
