import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { InsightEchartComponent } from '../components/workbench/insight-echart/insight-echart.component';
import { WorkbenchService } from '../components/workbench/workbench.service';
import { uuidv4 } from '@firebase/util';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { SheetsComponent } from '../components/workbench/sheets/sheets.component';
import { SheetsdashboardComponent } from '../components/workbench/sheetsdashboard/sheetsdashboard.component';

interface TableRow {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateDashboardService {
  customizeOptions = {GridColor
    : 
    "#089ffc",
    KPIDecimalPlaces
    : 
    2,
    KPIDisplayUnits
    : 
    "none",
    KPIPrefix
    : 
    "",
    KPISuffix
    : 
    "",
    backgroundColor
    : 
    "#fcfcfc",
    backgroundColorSwitch
    : 
    false,
    bandingColorSwitch
    : 
    false,
    bandingSwitch
    : 
    false,
    barColor
    : 
    "#4382f7",
    barColorSwitch
    : 
    false,
    bottomLegend
    : 
    "0%",
    chartColorSwitch
    : 
    false,
    color
    : 
    "#2392c1",
    dataLabels
    : 
    true,
    dataLabelsColor
    : 
    "#2392c1",
    dataLabelsFontFamily
    : 
    "sans-serif",
    dataLabelsFontPosition
    : 
    "top",
    dataLabelsFontSize
    : 
    "12px",
    decimalPlaces
    : 
    2,
    dimensionAlignment
    : 
    "center",
    dimensionColor
    : 
    "#2392c1",
    displayUnits
    : 
    "none",
    donutDecimalPlaces
    : 
    2,
    donutSize
    : 
    50,
    funnelColorSwitch
    : 
    false,
    gridLineColorSwitch
    : 
    false,
    headerFontAlignment
    : 
    "left",
    headerFontColor
    : 
    "#000000",
    headerFontDecoration
    : 
    "none",
    headerFontFamily
    : 
    "'Arial', sans-serif",
    headerFontSize
    : 
    "16px",
    headerFontStyle
    : 
    "normal",
    headerFontWeight
    : 
    700,
    isBold
    : 
    false,
    isDistributed
    : 
    false,
    isLocationField
    : 
    false,
    isTableDataBold
    : 
    false,
    isTableHeaderBold
    : 
    false,
    isXlabelBold
    : 
    false,
    isYlabelBold
    : 
    false,
    isZoom
    : 
    false,
    kpiColor
    : 
    "#000000",
    kpiColorSwitch
    : 
    false,
    kpiFontSize
    : 
    "3",
    label
    : 
    true,
    labelAlignment
    : 
    "left",
    leftLegend
    : 
    "center",
    legendOrient
    : 
    "horizontal",
    legendSwitch
    : 
    true,
    legendsAllignment
    : 
    "bottom",
    lineColor
    : 
    "#38ff98",
    lineColorSwitch
    : 
    false,
    locationDrillDownSwitch
    : 
    false,
    maxValueGuage
    : 
    100,
    measureAlignment
    : 
    "center",
    measureColor
    : 
    "#2392c1",
    minValueGuage
    : 
    0,
    prefix
    : 
    "",
    rightLegend
    : 
    null,
    selectedColorScheme
    : 
    ["#1d2e92", "#088ed2", "#007cb9", "#36c2ce", "#52c9f7"],
    sortColumn
    : 
    "select",
    sortType
    : 
    0,
    suffix
    : 
    "",
    tableDataFontAlignment
    : 
    "left",
    tableDataFontColor
    : 
    "#000000",
    tableDataFontDecoration
    : 
    "none",
    tableDataFontFamily
    : 
    "sans-serif",
    tableDataFontSize
    : 
    "12px",
    tableDataFontStyle
    : 
    "normal",
    tableDataFontWeight
    : 
    400,
    topLegend
    : 
    null,
    xGridColor
    : 
    "#2392c1",
    xGridLineColorSwitch
    : 
    false,
    xGridSwitch
    : 
    false,
    xLabelColor
    : 
    "#2392c1",
    xLabelColorSwitch
    : 
    false,
    xLabelFontFamily
    : 
    "sans-serif",
    xLabelFontSize
    : 
    12,
    xLabelSwitch
    : 
    true,
    xlabelFontWeight
    : 
    400,
    yGridColor
    : 
    "#2392c1",
    yGridLineColorSwitch
    : 
    false,
    yGridSwitch
    : 
    false,
    yLabelColor
    : 
    "#2392c1",
    yLabelColorSwitch
    : 
    false,
    yLabelFontFamily
    : 
    "sans-serif",
    yLabelFontSize
    : 
    12,
    yLabelSwitch
    : 
    true,
    ylabelFontWeight
    : 
    400,
    toggleTablePagination
    :true,
    toggleTableSearch
    : true,
  }
  echartInstance!: InsightEchartComponent;
  sheetsInstance!: SheetsComponent;
  dashboardInstance! : SheetsdashboardComponent;
  xConnectWiseArray = [0,5,10,15,0,10,0,10,0];
  yConnectWiseArray = [0,0,0,0,4,4,12,12,20];
  rowsConnectWiseArray = [4,4,4,4,8,8,8,8,8];
  colsConnectWiseArray = [5,5,5,5,10,10,10,10,10];
  xHALOPSAArray = [0,5,10,15,20,25,0,10,0,10,0];
  yHALOPSAArray = [0,0,0,0,0,0,4,4,12,12,20];

  yQuickbooksAArray = [0,0,0,0,0,0,4,4,12,12,20];
  xQuickbooksAArray = [0,4,8,12,16,20,0,12,0,12,0];
  rowsQuickbooksAArray = [4,4,4,4,4,4,8,8,8,8,8];
  colsQuickbooksArray = [4,4,4,4,4,4,12,12,12,12,12];

  ySalesforcesAArray = [0,0,0,0,0,4,4,12,12,20];
  xSalesforceArray = [0,4,8,12,16,0,10,0,10,0];
  rowsSalesforceAArray = [4,4,4,4,4,8,8,8,8,8];
  colsSalesforceArray = [4,4,4,4,4,10,10,10,10,10];
  rowsHALOPSAArray = [4,4,4,4,4,4,8,8,8,8,8];
  colsHALOPSAArray = [5,5,5,5,5,5,12,12,12,12,12];
  dashboardQuerySetIds: number[]=[];
  sheetsData: any;
  constructor(private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService) { }

  buildDashboardTransfer(container: ViewContainerRef,responesData : any){
    const componentRef =container.createComponent(SheetsComponent);
    this.sheetsInstance = componentRef.instance;
    const dashboardComponentRef =container.createComponent(SheetsdashboardComponent);
    this.dashboardInstance = dashboardComponentRef.instance;
    const obj ={
      query_set_id:responesData.datasource_query.queryset_id,
      hierarchy_id:responesData.datasource_query.hierarchy_id,
      joining_tables: responesData.datasource_query.joining_tables,
      join_type:responesData.datasource_query.join_type,
      joining_conditions:responesData.datasource_query.joining_conditions,
      dragged_array: {dragged_array:responesData.datasource_query.dragged_array,dragged_array_indexing:{}},
    } as any
    let responseData = _.cloneDeep(this.mergeSheetData(responesData));
    this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      responesData.sheets.forEach((sheet: any)=> {
        const {
          chart_id,
          sheet_col,
          sheet_row,
          sheet_data,
          sheet_query_data,
          ...rest
        } = sheet;
        const transformedColumns = sheet_query_data.columns_data.map(({ data, ...colRest }:any) => ({
          ...colRest,
          result_data: data
        }));
      
        let transformedRows = {};
        if (chart_id == 9) {
          transformedRows = sheet_query_data.rows_data.map((data: any) => ({
            col: data.column,
            result_data: data.data
          }));
        } else {
          transformedRows = sheet_query_data.rows_data.map(({ data, ...rowRest }: any) => ({
            ...rowRest,
            result_data: data
          }));
        }

        let pivotMeasureData = {};
        if (chart_id == 9) {
          pivotMeasureData = sheet_query_data.pivot_data.map((data: any) => ({
            col: data.column,
            result_data: data.data
          }));
        }

        const KPIRows = sheet_query_data.rows_data.map(({ data, ...rowRest }: any) => ({
          ...rowRest,
          result: data
        }));
        const dashboardKPIRows = sheet_query_data.rows_data.map((row: any) => ({
          col: row.column,
          result_data: row.data
        }));
        let transformData = this.transformDashboardTransferData(sheet.sheet_query_data, chart_id)
        let chartTransformaedData = this.transformTableAndChartData(transformData);
        let chartOptions = sheet.sheet_data.savedChartOptions;
        if(![1, 9, 25].includes(chart_id)){ 
          chartOptions = this.updateChartOptions(chartOptions,chart_id,sheet.sheet_data.isApexChart,chartTransformaedData.xAxisCategories,chartTransformaedData.multiSeriesChartData);
        }
        const transformed = {
          chart_id,
          ...rest,
          col_data: sheet_col,
          row_data: sheet_row,
          ...(chart_id === 9 && { pivot_measure: sheet.sheet_pivot }),
          sheet_data: {
          savedChartOptions : chartOptions,
            ...sheet_data,
            col: transformedColumns,
            row: transformedRows,
            ...(chart_id === 9 && { pivotMeasure_Data: pivotMeasureData })
          }
        };
        if(chart_id == 25 ){
          transformed.sheet_data.results.kpiNumber = sheet_query_data.rows_data[0]?.data[0];
          transformed.sheet_data.results.kpiData[0].result_data = transformed.sheet_data.row[0].result_data;
          sheet['rows'] = KPIRows;
          sheet['dashboardKPIRows'] = dashboardKPIRows;
        } else if(chart_id != 1 && chart_id != 9){
          sheet.sheet_data.savedChartOptions = chartOptions;
        }
        this.sheetsInstance.setSheetData(transformed,false,null , true);
        if(chart_id == 1){
          sheet.sheet_data.results = {"tableData":this.sheetsInstance.tableDataStore,
          "tableColumns":this.sheetsInstance.displayedColumns,
          "banding":this.sheetsInstance.banding,
          "color1":this.sheetsInstance.color1,
          "color2":this.sheetsInstance.color2,
          "items_per_page":this.sheetsInstance.itemsPerPage,
          "total_items":this.sheetsInstance.tableDataStore.length}
        } else if(chart_id == 9){
          this.sheetsInstance.pivotTableDatatransform(false);
          sheet.sheet_data = {
            ...sheet.sheet_data,
            pivotMeasure_Data: this.sheetsInstance.pivotMeasureData.map((data:any)=>{
              return {
                col: data.col,
                result_data: data.result_data
              }
            }),
            pivotTransformedData: this.sheetsInstance.transformedData,
            col: this.sheetsInstance.pivotColumnData,
            row: this.sheetsInstance.pivotRowData
          }
        }
      });
        let responseData = _.cloneDeep(this.mergeSheetData(responesData));
        this.updateDashboardData(responseData.dashboard, responseData.sheets).then(() => {
          this.dashboardInstance.dashboardId = responesData.dashboard.dashboard_id;
          this.dashboardInstance.assignDashboardParams(responseData.dashboard,true);
          // this.dashboardInstance.updateDashboard(false,false,true);
        }).catch(error => {
          console.error('Error updating dashboard data:', error);
        });
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }

  mergeSheetData(data: any) {
    const sheetMap = new Map<number, any>();

    // Map sheetId to sheetQuery_Data for faster lookup
    data.sheets.forEach((sheet:any) => {
      sheetMap.set(sheet.sheet_id, sheet.sheet_query_data);
    });

    // Function to merge sheetQuery_Data into dashboardData
    const mergeDashboardData = (dashboardData: any[]) => {
      return dashboardData.map(item => {
        const matchingData = sheetMap.get(item.sheetId);
        if (matchingData) {
          return {
            ...item,
            ...matchingData
          };
        }
        return item;
      });
    };

    // Merge for main dashboard
    data.dashboard.dashboard_data = mergeDashboardData(data.dashboard.dashboard_data);

    // Merge for each tab's dashboard
    if (data.dashboard.tab_data && data.dashboard.tab_data.length > 0) {
      data.dashboard.tab_data?.forEach((tab: any) => {
        tab.dashboard = mergeDashboardData(tab.dashboard);
      });
    }

    return data;
  }

  buildSampleConnectWiseDashboard(container: ViewContainerRef, databaseId : any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      
        this.buildDashboardResponseData(responce,"connectWise");
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
      this.buildDashboardResponseData(responce,"connectWise");
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }

  buildSampleQuickbooksDashboard(container: ViewContainerRef, databaseId : any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildQuickBooksDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      
        this.buildDashboardResponseData(responce,'quickbooks');
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
      this.buildDashboardResponseData(responce,'quickbooks');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }
  buildSampleImmybotDashboard(container: ViewContainerRef, databaseId: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleImmybotDashboard(databaseId).subscribe({
      next: (responce:any) => {
        const obj = {
          query_set_id: responce.datasource_query.queryset_id,
          hierarchy_id: responce.datasource_query.hierarchy_id,
          joining_tables: responce.datasource_query.joining_tables,
          join_type: responce.datasource_query.join_type,
          joining_conditions: responce.datasource_query.joining_conditions,
          dragged_array: { dragged_array: responce.datasource_query.dragged_array, dragged_array_indexing: {} },
        } as any;
        this.workbechService.joiningTablesTest(obj).subscribe({
          next: (res) => {
            this.buildDashboardResponseData(res, 'immybot');
          },
          error: (error) => {
            this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
            console.log(error);
          }
        });
        this.buildDashboardResponseData(responce, 'immybot');
      },
      error: (error:any) => {
        this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
        console.log(error);
      }
    });
  }
  buildSampleNinjaRMMDashboard(container: ViewContainerRef, databaseId: any) {
    const componentRef = container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleNinjaRMMDashboard(databaseId).subscribe({
      next: (responce: any) => {
        const obj = {
          query_set_id: responce.datasource_query.queryset_id,
          hierarchy_id: responce.datasource_query.hierarchy_id,
          joining_tables: responce.datasource_query.joining_tables,
          join_type: responce.datasource_query.join_type,
          joining_conditions: responce.datasource_query.joining_conditions,
          dragged_array: { dragged_array: responce.datasource_query.dragged_array, dragged_array_indexing: {} },
        } as any;
        this.workbechService.joiningTablesTest(obj).subscribe({
          next: (res) => {
            this.buildDashboardResponseData(res, 'ninjarmm');
          },
          error: (error) => {
            this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
            console.log(error);
          }
        });
        this.buildDashboardResponseData(responce, 'ninjarmm');
      },
      error: (error: any) => {
        this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
        console.log(error);
      }
    });
  }
  buildDashboardResponseData(responce: any,formType: string){
    let dashboardData: any[] = [];
    if(responce){
      this.sheetsData = responce.sheets.map(function(obj:any) {
        return {
          sheet_id: obj.sheet_id,
          chart_id: obj.chart_id,
          chart_type: obj.chart_type
        };
      });
      this.generateLayout(this.sheetsData);
      const updateRequests = responce.sheets.map((data:any,index:number) => {
        let tableDataStore = [];
        let transformData : any ;
         let tablePreviewColumn = _.cloneDeep(data.sheet_query_data.columns_data)
        let  tablePreviewRow = _.cloneDeep(data.sheet_query_data.rows_data)
        let dualAxisColumnData:any =[];
        let dualAxisRowData:any=[];
        let chartsColumnData:any=[];
        let chartsRowData:any = [];
        let totalCount: any;
          if (tablePreviewColumn && tablePreviewRow) {
            tablePreviewColumn.forEach((res: any) => {
              let obj1 = {
                name: res.column,
                values: res.data
              }
              dualAxisColumnData.push(obj1);
            });
            tablePreviewRow.forEach((res: any) => {
              let obj = {
                name: res.column,
                data: res.data
              }
              dualAxisRowData.push(obj);
            });
            tablePreviewRow.forEach((res: any) => {
              let obj = {
                name: res.col,
                value: res.data
              }
              // this.radarRowData.push(obj);
            });
            let rowCount: any;
            if (tablePreviewColumn[0]?.data?.length) {
              rowCount = tablePreviewColumn[0]?.data?.length;
            }
            transformData = this.transformData(tablePreviewColumn,tablePreviewRow);
            
            let rowCountStore: any;
            if (transformData?.columns_data.length) {
              rowCountStore = transformData?.columns_data[0]?.result_data?.length;
            } else {
              rowCountStore = transformData?.rows_data[0]?.result_data?.length;
            }
            totalCount = _.cloneDeep(rowCountStore);
            rowCountStore = rowCountStore > 10 ? 10:rowCountStore;
            for (let i = 0; i < rowCountStore; i++) {
              const row: TableRow = {};
              transformData?.columns_data.forEach((col: any) => {
                row[col.column] = col.result_data[i];
              });
              transformData?.rows_data.forEach((rowData: any) => {
                row[rowData.col] = rowData.result_data[i];
              });
              tableDataStore.push(row);
            }
  
            tablePreviewColumn.forEach((col: any) => {
              chartsColumnData = col.data;
            });
            tablePreviewRow.forEach((rowData: any) => {
              chartsRowData = rowData.data;
            });
          }
          let displayedColumns = tablePreviewColumn.map((col: any) => col.column).concat(tablePreviewRow.map((row: any) => row.column));
          this.dashboardQuerySetIds.push(data.queryset_id);
          return this.sheetUpdate(chartsColumnData, chartsRowData, dualAxisRowData, dualAxisColumnData,data.sheet_query_data.columns_data,data.sheet_query_data.rows_data,data,dashboardData,index,formType,transformData,tableDataStore,displayedColumns,totalCount);
        
      });
      
      let dashboardObj ={
        grid : "scroll",
        height: 800,
        width: 800,
        queryset_id: this.dashboardQuerySetIds,
        server_id:responce.dashboard.hierarchy_id,
        sheet_ids:responce.dashboard.sheet_ids,
        dashboard_name:responce.dashboard.dashboard_name,
        dashboard_tag_name:responce.dashboard.dashboard_tag_name,
        selected_sheet_ids:responce.dashboard.selected_sheet_ids,
        data : dashboardData,
        // tab_data : sheetTabsData,
        // tab_name: tabNames,
        // tab_sheets: sheetIds,
        // tab_id: tabIds,

      }
      forkJoin(updateRequests).pipe(
        switchMap(() => this.workbechService.updateDashboard(dashboardObj,responce.dashboard.dashboard_id))
      ).subscribe({
        next: (dashboardData) => {
          const encodedDashboardId = btoa(responce.dashboard.dashboard_id.toString());

          this.router.navigate(['/analytify/home/sheetsdashboard/'+encodedDashboardId])
          console.log('Dashboard Data:', dashboardData);
        },
        error: (err) => {
          console.error('Error during processing or dashboard fetch', err);
        }
      });
    }
  }

  transformData(columns_data: any[],rows_data:any[]) {
    const transformed = {
      columns_data: columns_data.map((item: any) => ({
        column: item.column,
        result_data: item.data
      })),
      rows_data: rows_data.map((item: any) => ({
        col: item.column,
        result_data: item.data
      }))
    };
  
    return transformed;
  }

  sheetUpdate(chartsColumnData: [], chartsRowData: [], dualAxisRowData: [], dualAxisColumnData: [],tableColumnData:[],tableRowData:[],data: any,dashboardData: any[],index : number, formType : string,tranformedData:any,tableDataStore: any[],displayedColumns : string[],totalCount:number) {
    let chartData;
    if(data.chart_id == 8){
      chartData = this.echartInstance.multiLineChart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 24) {
    chartData = this.echartInstance.pieChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 6) {
      chartData = this.echartInstance.barChart(chartsColumnData, chartsRowData);
    }  else if(data.chart_id == 3) {
      chartData = this.echartInstance.hgroupedChart(dualAxisColumnData, dualAxisRowData);
    } else if(data.chart_id == 10) {
      this.echartInstance.donutSize = this.customizeOptions.donutSize;
      chartData = this.echartInstance.donutChart(chartsColumnData, chartsRowData);
    } else if(data.chart_id == 7) {
      chartData = this.echartInstance.sidebySide(dualAxisColumnData, dualAxisRowData);
    }  else if(data.chart_id == 27) {
      chartData = this.echartInstance.funnelchart(dualAxisColumnData, dualAxisRowData);
    }  else if(data.chart_id == 29) {
      chartData = this.echartInstance.mapChart(dualAxisColumnData, dualAxisRowData,chartsRowData);
    }
    const sheetRows = data.row_data.map((item:any) => {
      return {
        column: item.orginal_column,
        data_type: item.data_type,
        type: item.type ?  item.type : ""
      };
    });
    const sheetColumns = data.col_data.map((item:any) => {
      return {
        column: item.orginal_column,
        data_type: item.data_type,
        type: item.type ?  item.type : ""
      };
    });
    const sheet_rows_data = data.row_data.map((item:any) => {
      return [
        item.orginal_column,
        "aggregate",
        item.type ? item.type : "",
        ""
      ];
    });
    const sheet_column_data = data.col_data.map((item:any) => {
      return [
        item.orginal_column,
        item.data_type,
        "",
        ""
      ];
    });

    const obj = {
      "chart_id": data.chart_id,
      "queryset_id": data.queryset_id,
      "server_id": data.hierarchy_id,
      "sheet_name": data.sheet_name,
      "sheet_tag_name": data.sheet_tag_name,
      "filter_id": data.sheet_filter_ids,
      "sheetfilter_querysets_id": data.sheet_filter_quereyset_ids,
      "filter_data": data.filters_data,
      "datasource_querysetid": data.datasource_queryset_id,
      "col": data.sheet_col,
      "row": data.sheet_row,
      "row_data":data.row_data.map((item: any) => item.column),
      "col_data":data.col_data.map((item: any) => item.column),
      "custom_query": data.custom_query,
      "data": {
        "customizeOptions": this.customizeOptions,
        "columns": sheetColumns,
        "columns_data": sheet_column_data,
        "col":tranformedData.columns_data,
        "row": tranformedData.rows_data,
        "rows":  sheetRows,
        "rows_data": sheet_rows_data,
        // "col": tablePreviewCol,
        // "row": tablePreviewRow,
        "results": {
          // "tableData": this.saveTableData,
          // "tableColumns": this.savedisplayedColumns,
          // "banding": this.banding,
          // "color1": bandColor1,
          // "color2": bandColor2,
          // "items_per_page": this.itemsPerPage,
          // "total_items": this.totalItems,

          "barYaxis": chartsRowData,
          "barXaxis": chartsColumnData,
          //  "barOptions":this.barOptions,

          "pieYaxis": chartsRowData,
          "pieXaxis": chartsColumnData,
          //   "pieOptions":this.pieOptions,

          "lineYaxis": chartsRowData,
          "lineXaxis": chartsColumnData,
          //   "lineOptions":this.lineOptions,

          "areaYaxis": chartsRowData,
          "areaXaxis": chartsColumnData,
          //   "areaOptions":this.areaOptions,

          "sidebysideBarYaxis": dualAxisRowData,
          "sidebysideBarXaxis": dualAxisColumnData,
          //     "sidebysideBarOptions":this.sidebysideBarOptions,

          "stokedBarYaxis": dualAxisRowData,
          "stokedBarXaxis": dualAxisColumnData,
          //     "stokedOptions":this.stokedOptions,

          "barLineYaxis": dualAxisRowData,
          "barLineXaxis": dualAxisColumnData,
          //     "barLineOptions":this.barLineOptions,

          "hStockedYaxis": dualAxisRowData,
          "hStockedXaxis": dualAxisColumnData,
          //     "hStockedOptions":this.hStockedOptions,

          "hgroupedYaxis": dualAxisRowData,
          "hgroupedXaxis": dualAxisColumnData,
          //     "hgroupedOptions":this.hgroupedOptions,

          "multiLineYaxis": dualAxisRowData,
          "multiLineXaxis": dualAxisColumnData,
          //     "multiLineOptions":this.multiLineOptions,

          "donutYaxis": chartsRowData,
          "donutXaxis": chartsColumnData,
          // "decimalplaces": this.donutDecimalPlaces,
          //     "donutOptions":this.donutOptions,

          "kpiData": tranformedData.rows_data,
          "kpiFontSize": 16,
          // "kpicolor": kpiColor,
          "kpiNumber": tranformedData.rows_data[0]?.result_data[0],
          "kpiPrefix": "",
          "kpiSuffix": "",
          kpiDecimalUnit: "none"
          // "kpiDecimalUnit": this.KPIDisplayUnits,
          // "kpiDecimalPlaces": this.KPIDecimalPlaces
        },
        "isApexChart": false,
        "isEChart": true,
        "savedChartOptions": chartData,
        

      }
    }
    let dashbaordObj = this.updateDashboardJSONData(chartData,data,index, {"kpiNumber": tranformedData.rows_data[0]?.result_data[0],"kpiFontSize": 16,"kpiPrefix": "","kpiSuffix": "",kpiDecimalUnit: "none",rows:tranformedData.rows_data},formType,tableDataStore,displayedColumns,totalCount);
    dashboardData.push(dashbaordObj);
   return this.workbechService.sheetUpdate(obj, data.sheet_id);

  }

  updateDashboardJSONData(chartData: any, data: any, index : number,kpiData : any,formType : string, tableDataStore : any[],displayedColumns : string[],totalCount: any){
    let tableData;
    let totalRecordCount = totalCount;
    const sheet_rows_data = data.row_data.map((item:any) => {
      return [
        item.orginal_column,
        "aggregate",
        item.type ? item.type : "",
        ""
      ];
    });
    const sheet_column_data = data.col_data.map((item:any) => {
      return [
        item.orginal_column,
        item.data_type,
        "",
        ""
      ];
    });
    if (data.chart_id == 1) {
      let columns = data.col_data.map((item: any) => item.column);
      let rows = data.row_data.map((item: any) => item.column);
      const obj = {
        hierarchy_id: data.hierarchy_id,
        // sheetqueryset_id: this.sheetfilter_querysets_id,
        queryset_id: data.queryset_id,
        page_no: 1,
        page_count: 10,
        rows: rows,
        columns: columns,
        custom_query: data.custom_query
      };
      tableData = {
        headers: displayedColumns,
        rows: tableDataStore,
        "banding": false,
        "tableItemsPerPage": 10,
        "tableTotalItems": totalRecordCount,
        "tablePage": 1
      };
      // this.workbechService.tablePaginationSearch(obj).subscribe(
      //   {
      //     next: (data: any) => {
      //        totalRecordCount = data.total_items;
      //     },
      //     error: (error) => {
      //       console.log(error);
      //     }
      //   }
      // )
    }
      let obj = {
        id : uuidv4(),
        x :  this.xHALOPSAArray[index] ,
        y: this.yHALOPSAArray[index],
        rows : this.rowsHALOPSAArray[index],
        cols:  this.colsHALOPSAArray[index],
        data: {
          sheetTagName
            :
            data.sheet_tag_name,
          title
            :
            data.sheet_name
        },
        sheetType: "chart",
        sheetId : data.sheet_id,
        chartType : data.chart_type,
        databaseId : data.hierarchy_id,
        qrySetId : data.queryset_id,
        chartId : data.chart_id,
        selectedSheet : true,
        kpiData: kpiData,
        column_Data: sheet_column_data,
        row_Data: sheet_rows_data,
        isEChart: true,
        echartOptions: chartData,
        customizeOptions : this.customizeOptions,
        tableData : tableData
     }
     return obj;
  }

  
  buildSampleHALOPSADashboard(container: ViewContainerRef , databaseId: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleHALOPSADashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {        
      this.buildDashboardResponseData(responce,'HALOPSA');      
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
    this.buildDashboardResponseData(responce,'HALOPSA');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }
  buildSampleSalesforceDashboard(container: ViewContainerRef , databaseId: any){
    const componentRef =container.createComponent(InsightEchartComponent);
    this.echartInstance = componentRef.instance;
    this.workbechService.buildSampleSalesforceDashbaord(databaseId).subscribe({next: (responce) => {
      const obj ={
        query_set_id:responce.datasource_query.queryset_id,
        hierarchy_id:responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type:responce.datasource_query.join_type,
        joining_conditions:responce.datasource_query.joining_conditions,
        dragged_array: {dragged_array:responce.datasource_query.dragged_array,dragged_array_indexing:{}},
      } as any
      this.workbechService.joiningTablesTest(obj).subscribe({next: (responce) => {
      this.buildDashboardResponseData(responce,'salesforce');      
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
    this.buildDashboardResponseData(responce,'salesforce');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          console.log(error);
        }
      }
    )
  }
buildSampleTallyDashboard(container: ViewContainerRef, databaseId: any) {
  const componentRef = container.createComponent(InsightEchartComponent);
  this.echartInstance = componentRef.instance;
  this.workbechService.buildSampleTallyDashboard(databaseId).subscribe({
    next: (responce: any) => {
      const obj = {
        query_set_id: responce.datasource_query.queryset_id,
        hierarchy_id: responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type: responce.datasource_query.join_type,
        joining_conditions: responce.datasource_query.joining_conditions,
        dragged_array: { dragged_array: responce.datasource_query.dragged_array, dragged_array_indexing: {} },
      } as any;
      this.workbechService.joiningTablesTest(obj).subscribe({
        next: (res) => {
          this.buildDashboardResponseData(res, 'tally');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
          console.log(error);
        }
      });
      this.buildDashboardResponseData(responce, 'tally');
    },
    error: (error: any) => {
      this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
      console.log(error);
    }
  });
}
buildSampleHubspotDashboard(container: ViewContainerRef, databaseId: any) {
  const componentRef = container.createComponent(InsightEchartComponent);
  this.echartInstance = componentRef.instance;
  this.workbechService.buildSampleHubspotDashboard(databaseId).subscribe({
    next: (responce: any) => {
      const obj = {
        query_set_id: responce.datasource_query.queryset_id,
        hierarchy_id: responce.datasource_query.hierarchy_id,
        joining_tables: responce.datasource_query.joining_tables,
        join_type: responce.datasource_query.join_type,
        joining_conditions: responce.datasource_query.joining_conditions,
        dragged_array: { dragged_array: responce.datasource_query.dragged_array, dragged_array_indexing: {} },
      } as any;
      this.workbechService.joiningTablesTest(obj).subscribe({
        next: (res) => {
          this.buildDashboardResponseData(res, 'hubspot');
        },
        error: (error) => {
          this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
          console.log(error);
        }
      });
      this.buildDashboardResponseData(responce, 'hubspot');
    },
    error: (error: any) => {
      this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
      console.log(error);
    }
  });
}
  private readonly KPI_MAX       = 8;
  private readonly KPI_PER_ROW   = 8;
  private readonly KPI_SIZE      = { cols: 5, rows: 4 };

  private readonly TABLE_MAX     = 1;
  private readonly TABLE_PER_ROW = 1;
  private readonly TABLE_SIZE    = { cols: 20, rows: 15 };

  private readonly MIDDLE_PER_ROW = 2;
  private readonly MIDDLE_SIZE    = { cols: 10, rows: 8 };

  /**
   * Generate four arrays (x/y/cols/rows) for your Gridster layout.
   * @param sheets  flat list of sheet metadata
   */
  public generateLayout(sheets: any[]) {
    const n = sheets.length;
    const xArray    = Array<number>(n).fill(0);
    const yArray    = Array<number>(n).fill(0);
    const colsArray = Array<number>(n).fill(0);
    const rowsArray = Array<number>(n).fill(0);

    // 1) Partition into three buckets, respecting limits.
    const kpis: number[]    = [];
    const tables: number[]  = [];
    const middle: number[]  = [];
    let kpiCount = 0, tableCount = 0;

    sheets.forEach((sh, idx) => {
      if (sh.chart_type === 'KPI' && kpiCount < this.KPI_MAX) {
        kpis.push(idx);
        kpiCount++;
      } else if (sh.chart_type === 'Table' && tableCount < this.TABLE_MAX) {
        tables.push(idx);
        tableCount++;
      } else {
        middle.push(idx);
      }
    });

    // 2) Helper to place a homogeneous group
    const placeGroup = (
      indices: number[],
      offsetY: number,
      perRow: number,
      size: { cols: number; rows: number }
    ): number => {
      indices.forEach((sheetIdx, order) => {
        const row = Math.floor(order / perRow);
        const col = order % perRow;
        xArray[sheetIdx]    = col * size.cols;
        yArray[sheetIdx]    = offsetY + row * size.rows;
        colsArray[sheetIdx] = size.cols;
        rowsArray[sheetIdx] = size.rows;
      });
      // total height consumed by this group
      const numRows = Math.ceil(indices.length / perRow);
      return numRows * size.rows;
    };

    // 3) Stitch them together vertically
    let cursorY = 0;
    // a) KPIs at the very top
    cursorY += placeGroup(kpis,   cursorY, this.KPI_PER_ROW,   this.KPI_SIZE);
    // b) “Other” charts in the middle
    cursorY += placeGroup(middle, cursorY, this.MIDDLE_PER_ROW, this.MIDDLE_SIZE);
    // c) Tables at the bottom
    placeGroup(tables, cursorY, this.TABLE_PER_ROW, this.TABLE_SIZE);

      this.xHALOPSAArray = xArray;
      this.yHALOPSAArray = yArray;
      this.colsHALOPSAArray = colsArray;
      this.rowsHALOPSAArray = rowsArray;  
    }

    transformDashboardTransferData(inputData: any, chartId:any): any {
      const transformedData = {
        col: [],
        row: [],
        ...(chartId === 9 && { pivotMeasure: [] })
      };

      // Transform columns_data to col
      if (inputData.columns_data) {
        transformedData.col = inputData.columns_data.map((item: any) => ({
          column: item.column,
          result_data: item.data
        }));
      }

      // Transform rows_data to row
      if (inputData.rows_data) {
        transformedData.row = inputData.rows_data.map((item: any) => ({
          col: item.column,
          result_data: item.data
        }));
      }

      // Transform pivot_measure to pivotMeasure
      if (chartId === 9 && inputData.pivot_data) {
        transformedData.pivotMeasure = inputData.pivot_data.map((item: any) => ({
          col: item.column,
          result_data: item.data
        }));
      }

      return transformedData;
    }

    updateDashboardData(dashboard: any, sheets: any[]):  Promise<void> { 
      return new Promise((resolve) => {
      sheets.forEach(sheet => {
        const sheetId = sheet.sheet_id;

        dashboard.dashboard_data.forEach((dashboardItem:any) => {
          if (dashboardItem.sheetId === sheetId) {
            if(dashboardItem.chartId == 25 || sheet.chart_id == 25){
              dashboardItem.kpiData.kpiNumber = sheet.sheet_data.results.kpiNumber
              dashboardItem.kpiData.rows = sheet.dashboardKPIRows;
            } else if(dashboardItem.chartId == 1 || sheet.chart_id == 1){
              let tableData = this.dashboardInstance.getTableData(sheet.sheet_data)
              dashboardItem.tableData.rows = tableData.rows.slice(0, tableData.tableItemsPerPage);
            } else if(dashboardItem.chartId == 9 || sheet.chart_id == 9){
              dashboardItem.pivotData.pivotColData = sheet?.sheet_data?.col;
              dashboardItem.pivotData.pivotMeasureData = sheet?.sheet_data?.pivotMeasure_Data;
              dashboardItem.pivotData.pivotRowData = sheet?.sheet_data?.row;
              dashboardItem.transformedData = sheet?.sheet_data?.pivotTransformedData;
              delete dashboardItem.pivot_data;
            } else {
            if (sheet.sheet_data.isEChart) {
              dashboardItem.echartOptions = sheet.sheet_data.savedChartOptions;
            } else {
              dashboardItem.chartOptions = sheet.sheet_data.savedChartOptions;
            }
          }
          }
        });
        if (dashboard.tab_data && dashboard.tab_data.length > 0) {
          dashboard.tab_data?.forEach((tabData: any) => {
            tabData.dashboard?.forEach((dashboardItem: any) => {
              if (dashboardItem.sheetId === sheetId) {
                if (dashboardItem.chartId == 25 || sheet.chart_id == 25) {
                  dashboardItem.kpiData.kpiNumber = sheet.sheet_data.results.kpiNumber
                  dashboardItem.kpiData.rows = sheet.dashboardKPIRows;
                } else if (dashboardItem.chartId == 1 || sheet.chart_id == 1) {
                  let tableData = this.dashboardInstance.getTableData(sheet.sheet_data)
                  dashboardItem.tableData.rows = tableData.rows.slice(0, tableData.tableItemsPerPage);
                } else if (dashboardItem.chartId == 9 || sheet.chart_id == 9) {
                  dashboardItem.pivotData.pivotColData = sheet?.sheet_data?.col;
                  dashboardItem.pivotData.pivotMeasureData = sheet?.sheet_data?.pivotMeasure_Data;
                  dashboardItem.pivotData.pivotRowData = sheet?.sheet_data?.row;
                  dashboardItem.transformedData = sheet?.sheet_data?.pivotTransformedData;
                  delete dashboardItem.pivot_data;
                } else {
                  if (sheet.sheet_data.isEChart) {
                    dashboardItem.echartOptions = sheet.sheet_data.savedChartOptions;
                  } else {
                    dashboardItem.chartOptions = sheet.sheet_data.savedChartOptions;
                  }
                }
              }
            });
          })
        }
        
      });
      resolve(); // Resolve the promise once updates are done
    });
    }

    transformTableAndChartData(data: any): {
      xAxisCategories: string[],
      multiSeriesChartData: { name: string; data: number[] }[],
      combinedTableData: any[],
      columnNames: string[]
    } {
      const colArray = data?.col || [];
      const rowArray = data?.row || [];
  
      const xAxisCategories: string[] = [];
      const multiSeriesChartData: { name: string; data: number[] }[] = [];
      const combinedTableData: any[] = [];
      const columnNames: string[] = [
        ...colArray.map((col: { column: any }) => col.column),
        ...rowArray.map((row: { col: any }) => row.col)
      ];
  
      const rowCount = Math.max(
        colArray[0]?.result_data?.length || 0,
        rowArray[0]?.result_data?.length || 0
      );
  
      for (let i = 0; i < rowCount; i++) {
        const rowObj: any = {};
        colArray.forEach((col: { column: string; result_data: any[] }) => {
          rowObj[col.column] = col.result_data?.[i];
        });
        rowArray.forEach((row: { col: string; result_data: any[] }) => {
          rowObj[row.col] = row.result_data?.[i];
        });
        combinedTableData.push(rowObj);
      }
  
      // if (colArray.length > 0) {
      //   xAxisCategories.push(...(colArray[0].result_data?.map((v: any) => v ?? 'nu  ll') || []));
      // }

      const maxLength = Math.max(...colArray.map((col:any) => col.result_data?.length || 0));

      for (let i = 0; i < maxLength; i++) {
        const combined = colArray.map((col:any) => col.result_data?.[i] ?? 'null').join(', ');
        xAxisCategories.push(combined);
      }
  
      multiSeriesChartData.push(
        ...rowArray.map((row: { col: any; result_data: any }) => ({
          name: row.col,
          data: row.result_data || []
        }))
      );
  
      return {
        xAxisCategories,
        multiSeriesChartData,
        combinedTableData,
        columnNames
      };
    }
  
    updateChartOptions(chartOptions: any, chartId: any, isApexChart: boolean,
      xAxisCategories: string[], multiSeriesChartData: { name: string; data: number[] }[]): any {
        // chartType = chartType?.toLowerCase();
      // if (!chartOptions) chartOptions = {};
  
      // if (isApexChart) {
      //   if (['pie', 'donut', 'guage'].includes(chartType)) {
      //     chartOptions.series = multiSeriesChartData[0]?.data || [];
      //     chartOptions.labels = xAxisCategories;
      //   } else {
      //     chartOptions.series?.forEach((row: any, index: number) => {
      //       row.data = multiSeriesChartData[index]?.data || [];
      //     });
      //     chartOptions.xaxis = {
      //       ...chartOptions.xaxis,
      //       categories: xAxisCategories
      //     };
      //   }
      // } else {
      //   chartOptions.series?.forEach((row: any, index: number) => {
      //     row.data = multiSeriesChartData[index]?.data || [];
      //   });
      //   chartOptions.xAxis = {
      //     ...chartOptions.xAxis,
      //     data: xAxisCategories
      //   };
      // }
  
  
       if (!chartOptions) chartOptions = {};
  
    if (isApexChart) {
      if ([24, 10].includes(chartId)) {
        chartOptions.series = multiSeriesChartData[0]?.data || [];
        chartOptions.labels = xAxisCategories;
      } else if(chartId == 28){
        chartOptions.series = multiSeriesChartData[0]?.data || [];
        chartOptions.labels = [multiSeriesChartData[0]?.name];
      } else {
        chartOptions.series?.forEach((row: any, index: number) => {
          row.data = multiSeriesChartData[index]?.data || [];
        });
        chartOptions.xaxis = chartOptions.xaxis || {};
        chartOptions.xaxis.categories = xAxisCategories;
      }
    } else {
      if (![12, 26, 11, 29, 24, 10, 27].includes(chartId)) {
        chartOptions.series?.forEach((row: any, index: number) => {
          row.data = multiSeriesChartData[index]?.data || [];
        });
      } else if (chartId == 26) {
        const heatmapData: any[][] = [];
        multiSeriesChartData.forEach((row, rowIndex: any) => {
          row.data.forEach((value, colIndex: any) => { // Assuming each row has a data array
            if (value !== null && value !== undefined) { // Ensure value is valid
              heatmapData.push([colIndex, rowIndex, value]); // [xIndex, yIndex, value]
            }
          });
        });

        chartOptions.series.forEach((row: any, index: any) => {
          row.data = heatmapData;
        });
      }
  
      if (chartId == 4) {
        chartOptions.xAxis?.forEach((column: any) => {
          column.data = xAxisCategories;
        });
      } else if ([2, 3, 14].includes(chartId)) {
        // chartOptions.yAxis?.forEach((column: any) => {
        //   column.data = xAxisCategories;
        // });
        chartOptions.yAxis.data = xAxisCategories;
      } else if (chartId == 12) {
        let radarArray = xAxisCategories.map((value: any, index: number) => ({
          name: xAxisCategories[index]
        }));
        const transformedArray = multiSeriesChartData.map((obj: any) => ({
          name: obj.name,
          value: obj.data
        }));
        chartOptions.radar.indicator = radarArray;
        // this.chartOptions.series[0].data = transformedArray;
        chartOptions.series[0].data.forEach((row: any, index: any) => {
          row.value = multiSeriesChartData[index].data;
        });
      } else if (chartId == 11) {
        let calendarData: any[] = [];
        let years: Set<any> = new Set();
  
        if (multiSeriesChartData[0]?.data?.length > 0 || xAxisCategories?.length > 0) {
          multiSeriesChartData.forEach((series: any) => {
            series.data.forEach((value: any, index: number) => {
              const formattedDate = xAxisCategories[index]?.split(" ")[0];
              calendarData.push([formattedDate, value]);
              years.add(new Date(xAxisCategories[index]).getFullYear());
            });
          });
  
          const yearArray = Array.from(years).sort((a: any, b: any) => a - b);
          const series = yearArray.map((year: any, idx: number) => ({
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: idx,
            data: calendarData.filter(d => new Date(d[0]).getFullYear() === year)
          }));
  
          const calendarHeight = 120;
          const yearGap = 30;
          const calendars = yearArray.map((year: any, idx: number) => ({
            top: idx === 0 ? 25 : (calendarHeight + yearGap) * idx,
            range: year.toString(),
            cellSize: ['auto', 12],
            splitLine: {
              show: true,
              lineStyle: {
                color: '#000',
                width: 1
              }
            },
            yearLabel: {
              show: true,
              margin: 25,
              fontSize: 14,
              fontWeight: 'bold'
            }
          }));
  
          const allValues = multiSeriesChartData[0].data;
          const minValue = Math.min(...allValues);
          const maxValue = Math.max(...allValues);
  
          chartOptions.series = series;
          chartOptions.calendar = calendars;
          chartOptions.visualMap = {
            ...(chartOptions.visualMap || {}),
            min: minValue,
            max: maxValue
          };
        } else {
          chartOptions = {};
        }
      } else if (chartId == 29) {
        const result: any[] = [];
        let minData = 0;
        const maxData = Math.max(...multiSeriesChartData[0].data);
  
        xAxisCategories.forEach((country: string, index: number) => {
          const countryData: any = {
            name: country,
            value: multiSeriesChartData[0].data[index]
          };
          multiSeriesChartData.forEach((measure: any) => {
            countryData[measure.name] = measure.data[index];
          });
          result.push(countryData);
        });
  
        if (multiSeriesChartData.length > 0) {
          minData = Math.min(...multiSeriesChartData[0].data);
        }
  
        chartOptions.tooltip = {
          formatter: (params: any) => {
            const { name, data } = params;
            if (data) {
              return Object.entries(data)
                .map(([key, val]) => `${key}: ${val}`)
                .join('<br/>');
            } else {
              return `${name}: No Data`;
            }
          },
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2
        };
  
        chartOptions.visualMap = {
          ...(chartOptions.visualMap || {}),
          min: minData,
          max: maxData
        };
  
        chartOptions.series[0].data = result;
        chartOptions = {...chartOptions};
      } else if([24, 10, 27].includes(chartId)){
        let data: any[] = [];
        xAxisCategories.forEach((col: any, index: any) => {
          data.push({ value: multiSeriesChartData[0].data[index], name: col })
        });
        chartOptions.series[0].data = data;
      } else {
        chartOptions.xAxis = {
          ...(chartOptions.xAxis || {}),
          data: xAxisCategories
        };
      }
    }
  
      return { ...chartOptions }; // ensure immutability
    }
  }
  
        

