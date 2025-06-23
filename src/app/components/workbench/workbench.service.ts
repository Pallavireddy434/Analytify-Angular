import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WorkbenchService {
  private skipLoader = false; // Flag to control the loader
  disableLoaderForNextRequest() {
    this.skipLoader = true;
  }

  shouldSkipLoader(): boolean {
    return this.skipLoader;
  }

  resetSkipLoader() {
    this.skipLoader = false; // Reset after request
  }
  getDrillDowndata(Obj: any) {
    throw new Error('Method not implemented.');
  }

  addSheetToDashboard(obj : any) {
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/sheetidupdate/`+this.accessToken,obj);
  }

  dashboardFilterDeleteFetchSheetData(obj : any) {
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboard_nosheet_filter/`+this.accessToken,obj);
  }

  fetchSheetsList(sheet_ids: any) {
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheets_data/`+this.accessToken,sheet_ids);
  }

  accessToken: any;
  constructor(private http: HttpClient) { }

  postGreSqlConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/database_connection/`+this.accessToken,obj);
  }
  postGreSqlConnectionput(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/database_connection/`+this.accessToken,obj);
  }
  DbConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/database_connection/`+this.accessToken,obj);
  }
  connectWiseConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/connectwise/`+this.accessToken,obj);
  }
  ninjaRMMConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/ninja_authentication/`+this.accessToken,obj);
  }
  
  immyBotConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/immybot_authentication/`+this.accessToken,obj);
  }

  immyBotConnectionUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/immybot_authentication/`+this.accessToken,obj);
  }
  haloPSAConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/halops/`+this.accessToken,obj);
  }
  shopifyConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/shopify_authentication/`+this.accessToken,obj);
  }
  hubspotConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/hubspot_authentication/`+this.accessToken,obj);
  }
  connectWiseConnectionUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/connectwise/`+this.accessToken,obj);
  }
  googleAnalyticsConnectionApi(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/GA4_connection/`+this.accessToken,obj);
  }
  haloPSAConnectionUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/halops/`+this.accessToken,obj);
  }
  createTally(config: any) {
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/halops/`+this.accessToken, config);
  }

  updateTally(config: any) {
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/halops/`+this.accessToken, config);
  }

  ninjaRMMConnectionUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/ninja_authentication/`+this.accessToken,obj);
  }
  shopifyConnectionUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/shopify_authentication/`+this.accessToken,obj);
  }
  googleAnalyticsUpdate(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/GA4_connection/`+this.accessToken,obj);
  }
  DbConnectionFiles(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/upload_file/`+this.accessToken,obj);
  }
  getTablesFromFileId(id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/get_file/`+id+'/'+this.accessToken);
  }

  fetchSchemaList(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/get-schemas/`+this.accessToken, obj);
  }
  //crossDb
  crossDbConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/server_tables/`+this.accessToken,obj);
  }

  //Quickbooks
  connectQuickBooks(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/quickbooks/`+this.accessToken);
  }
  //salesforce
  connectSalesforce(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/salesforce/`+this.accessToken);
  }

  connectGoogleSheets(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/auth/google/`+this.accessToken);
  }
  getGoogleSheetsDetails(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/auth/google/callback/`+this.accessToken,obj);
  }
  getHierachyIdFromGsheets(parentId:any,id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/google_sheets_data/`+this.accessToken+'/'+parentId+'/'+id);
  }
  // getTableData(obj:any){
  //   const currentUser = localStorage.getItem( 'currentUser' );
  //   console.log(JSON.parse( currentUser!))
  //   this.accessToken = JSON.parse( currentUser! )['Token'];
  //   return this.http.post<any>(`${environment.apiUrl}/get_details/`,obj);
  // }

  tableRelation(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/get_table_relationship/`+this.accessToken,obj);
  }
  saveThemes(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/usercustomtheme/`+this.accessToken,obj);
  }
  getTableData(obj:any){
    return this.http.put<any>(`${environment.apiUrl}/get_table_relationship/`+this.accessToken,obj)
  }
  getdatabaseConnectionsList(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/connection_list/`+this.accessToken,obj)
  }
  getTablesFromConnectedDb(id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/tables_list/`+this.accessToken+'/'+id)
  }
  getTablesfromPrevious(dbId:any,querysetId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/retrieve_datasource/`+dbId+'/'+querysetId+'/'+this.accessToken)
  }
  getSavedQueryData(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/queryfetch/`+this.accessToken,obj)
  }
  getSchemaTablesFromConnectedDb(id:any,obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/server_tables/`+this.accessToken,obj)
  }
  buildRelation(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/crossdb_relation/`+this.accessToken,obj)
  }
  getColumnsData(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/columnextracting/`+this.accessToken,obj);
  }
  executeQuery(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/custom_query/`+this.accessToken,obj);
  }
  clearFiltersOnClearQuery(custmQryId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/clear_filters/`+custmQryId+'/'+this.accessToken);
  }
  saveQueryName(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/querysetname/`+this.accessToken,obj);
  }
  updateCustmQuery(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/custom_query/`+this.accessToken,obj);
  }
  joiningTables(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/tables_joining/`+this.accessToken,obj);
  }
  joiningTablesTest(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/tables_test_joining/`+this.accessToken,obj);
  }
  getTableJoiningData(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/query_data/`+this.accessToken,obj);
  }
  getDataExtraction(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/multi_col_dk/`+this.accessToken,obj);
  }
  getChartsEnableDisable(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/show_me/`+this.accessToken,obj);
  }
  deleteDbConnection(id:any){
    return this.http.delete<any>(`${environment.apiUrl}/database_disconnect/`+this.accessToken+'/'+id);
  }
  deleteFileConnection(id:any){
    return this.http.delete<any>(`${environment.apiUrl}/delete_file/`+id+'/'+this.accessToken);
  }
  deleteDbMsg(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/database_delete_stmt/`+this.accessToken,obj);
  }

  crossDbDeletion(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/crossdb_deletion/`+this.accessToken,obj);
  }
  sheetSave(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetsave/`+this.accessToken,obj);
  }
  sheetUpdate(obj:any,id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetupdate/`+id+"/"+this.accessToken,obj);
  }
  // sheetDelete(serverId:any,querysetId:any,sheetId:any){
  //   const currentUser = localStorage.getItem( 'currentUser' );
  //   this.accessToken = JSON.parse( currentUser! )['Token'];
  //   return this.http.delete<any>(`${environment.apiUrl}/sheetdelete/`+serverId+"/"+querysetId+"/"+sheetId+"/"+this.accessToken);
  // }
  sheetGet(obj:any,sheet_id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetretrieve/`+sheet_id+'/'+this.accessToken,obj);
  }
  getSheetData(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/sheetslist/`+this.accessToken);
  }
  sheetsDataWithQuerysetId(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetslist/`+this.accessToken,obj);
  }

  getDashboardDrillDowndata(obj : any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_down/`+this.accessToken,obj);
  }
  
  getPublicDashboardDrillDowndata(obj : any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboard_drill_down/`,obj);
  }

  sheetRetrivelBasedOnIds(obj : any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetslistdata/`+this.accessToken,obj);
  }
  
  saveDashboard(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboardsave/`+this.accessToken,obj);
  }
  updateDashboard(obj:any,dashboardId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboardupdate/`+dashboardId+'/'+this.accessToken,obj);
  }
  saveDAshboardimage(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboardimage/`+this.accessToken,obj);
  }
  getSavedDashboardData(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboardretrieve/`+this.accessToken,obj);
  }
  filterPost(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj);
  }
  filterPut(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj)
  }
  updateQuerySetTitle(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/querysetname/`+this.accessToken,obj)
  }
  filterEditPost(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/get_datasource/`+this.accessToken,obj);
  }
  filterDelete(filterId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/filter_delete/`+filterId+"/sheet/"+this.accessToken);
  }
  selectedColumnGetRows(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj);
  }
  getSelectedRowsFilter(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj);
  }
  getDsQuerysetId(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/data_source_data/`+this.accessToken,obj);
  }
  getUserSheetList(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/sheetslist/`+this.accessToken);
  }

  fetchSheetsListData(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/querysetslist/`+this.accessToken);
  }

  getUserSheetListPut(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/sheetslist/`+this.accessToken,obj);
  }

  getUserSheetListPutTest(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/querysheets/`+this.accessToken,obj);
  }

  deleteSheet(serverId:any,qurysetId:any,sheetId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/sheetdelete/`+serverId+'/'+qurysetId+'/'+sheetId+'/'+this.accessToken);
  }
  deleteSheetMessage(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheet_delete_stmt/`+this.accessToken,obj);
  }

  sheetFiltersDuplicate(sheetId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/duplicate_sheet_filters/`+ sheetId +'/'+this.accessToken);
  }

  deleteSavedQuery(qryId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/querysetdelete/`+qryId+'/'+this.accessToken);
  }
  deleteSavedQueryMessage(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/query_delete_stmt/`+this.accessToken,obj);
  }
  getuserDashboardsList(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/dashboardlist/`+this.accessToken);
  }
  getSheetName(sheetId: number){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/sheet_name/`+sheetId+'/'+this.accessToken);
  }
  getuserDashboardsListput(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/dashboardlist/`+this.accessToken,obj);
  }
  deleteDashboard(dashboardId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/dashboarddelete/`+dashboardId+'/'+this.accessToken);
  }
  getFilteredList(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/list_filters/`+this.accessToken,obj);
  }
  editFilter(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/get_datasource/`+this.accessToken,obj);
  }
  deleteFilter(filterId:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/filter_delete/`+filterId+'/'+'datasource'+'/'+this.accessToken);
  }
  callColumnWithTable(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/get_column_names/`+this.accessToken,obj);
  }
  deleteRelation(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/delete_condition/`+this.accessToken,obj);
  }
  getSavedQueryList(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/savedqueries/`+this.accessToken,obj);
  }
  //jhansi
  getSheetNames(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetnamelist/`+this.accessToken,obj);
  }
  renameColumn(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/rename_column/`+this.accessToken,obj);
  }
//
// sheet table pagination
tablePaginationSearch(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/table_pagination/`+this.accessToken,obj);
}
//dahboard table pagination
paginationTableDashboard(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_table/`+this.accessToken,obj);
}
//Dashboard Filters
getColumnsInDashboardFilter(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_column_preview/`+this.accessToken,obj);  
}

getQuerySetInDashboardFilter(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_query_preview/`+this.accessToken,obj);  
}

selectedDatafromFilter(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_save/`+this.accessToken,obj);  
}
copyDashboard(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_copy/`+this.accessToken,obj);
}
updatesDashboardFilters(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.put<any>(`${environment.apiUrl}/dashboard_filter_save/`+this.accessToken,obj);  
}
getColDataFromFilterId(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_columndata_preview/`+this.accessToken,obj); 
}
getDashboardFilterredList(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_list/`+this.accessToken,obj); 
}
getFilteredData(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filtered_data/`+this.accessToken,obj); 
}

getServerTablesList(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/ai/copilot/`+this.accessToken,obj);
}

openApiKey(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/ai/validate-api-key/`+this.accessToken,obj);
}
deleteDashbaordFilter(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_delete/`+this.accessToken,obj); 
}

deleteSheetFilter(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_sheet_update/`+this.accessToken,obj); 
}
editFilterDataGet(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/dashboard_filter_detail/`+this.accessToken,obj); 
}
//roles
getSavedRolesList(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.put<any>(`${environment.apiUrl}/roleslist/`+this.accessToken,obj); 
}
getPrevilagesList(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.put<any>(`${environment.apiUrl}/previlages_list/`+this.accessToken,obj); 
}
addPrevilage(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/role/`+this.accessToken,obj); 
}
deleteRole(id:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.delete<any>(`${environment.apiUrl}/deleterole/`+id+'/'+this.accessToken); 
}
getRoleIdDetails(id:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.get<any>(`${environment.apiUrl}/roledetails/`+id+'/'+this.accessToken); 
}
editRoleDetails(id:any,obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.put<any>(`${environment.apiUrl}/editroles/`+id+'/'+this.accessToken,obj); 
}
//users
getUserList(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.put<any>(`${environment.apiUrl}/getusersroles/`+this.accessToken,obj); 
}
getAddedRolesList(){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.get<any>(`${environment.apiUrl}/roleslist/`+this.accessToken); 
}
addUserwithRoles(obj:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/adduser/`+this.accessToken,obj); 
}
deleteUser(id:any){
  const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.delete<any>(`${environment.apiUrl}/deleteuser/`+id+'/'+this.accessToken); 
}

  getUserIdDetails(id: any) {
    const currentUser = localStorage.getItem('currentUser');
    this.accessToken = JSON.parse(currentUser!)['Token'];
    return this.http.get<any>(`${environment.apiUrl}/userdetails/` + id + '/' + this.accessToken);
  }
  editUser(id: any, obj: any) {
    const currentUser = localStorage.getItem('currentUser');
    this.accessToken = JSON.parse(currentUser!)['Token'];
    return this.http.put<any>(`${environment.apiUrl}/edituser/` + id + '/' + this.accessToken, obj);
  }

  //dashboard properties
  getRoleDetailsDshboard(){
    const currentUser = localStorage.getItem('currentUser');
    this.accessToken = JSON.parse(currentUser!)['Token'];
    return this.http.get<any>(`${environment.apiUrl}/dashboardroledetails/`+ this.accessToken);
  }
  getUsersOnRole(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
  this.accessToken = JSON.parse( currentUser! )['Token'];
  return this.http.post<any>(`${environment.apiUrl}/multipleroles/`+this.accessToken,obj); 
  }
  saveDashboardProperties(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/dashboard_prop_update/`+this.accessToken,obj); 
  }
  getAddedDashboardProperties(id:any){
    const currentUser = localStorage.getItem('currentUser');
    this.accessToken = JSON.parse(currentUser!)['Token'];
    return this.http.get<any>(`${environment.apiUrl}/dashboard_properties/`+id+'/'+ this.accessToken);
  }
  //public dashboard
  publishDashbord(id:any){
    return this.http.get<any>(`${environment.apiUrl}/is_public/`+id);
  }
  getDashboardFilterredListPublic(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboard_filter_list/`,obj); 
  }
  getSavedDashboardDataPublic(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboardretrieve/`,obj);
  }getFilteredDataPublic(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboard_filtered_data/`,obj); 
  }
  getColDataFromFilterIdPublic(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboard_columndata_preview/`,obj); 
  }
  paginationTableDashboardPublic(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/public/dashboard_table/`,obj);
  }
  //image convert
      blobToFile(theBlob:any){
      theBlob.lastModifiedDate = new Date();
      theBlob.name = theBlob.lastModifiedDate.getTime()+'.jpeg';
      return theBlob;
      
     }
    // convertBase64ToFileObject(dataURI) {
    //   const byteString = atob(dataURI.split(',')[1]);
    //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i++) {  ia[i] = byteString.charCodeAt(i);  }
    //   const blob = new Blob([ab], {type: mimeString});
    //   return (<File> blob);
    // }

    base64ToBlob(dataUrl: string): Blob {
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   return new Blob([ab], { type: mimeString });
    // }
    for (let i = 0; i < byteString.length; i++) {  ia[i] = byteString.charCodeAt(i);  }
      const blob = new Blob([ab], {type: mimeString});
      return (<File> blob);
    }

    //dashboard sheets upadte
    dashboardSheetsUpdate(sheetId:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_sheet_update/`+this.accessToken,sheetId);
    }

    //user help guide
    getModulesData(){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/moduledata/`+this.accessToken);
    }
    getUserHelpGuide(moduleId : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/userguide/`+this.accessToken,moduleId);
    }
    getUserHelpGuideSearch(search : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/userguidesearch/`+this.accessToken,search);
    }

    //chart plug-in setter
    setChartType(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/userconfig/`+this.accessToken,object);
    }

    applyCalculatedFields(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/calculation/`+this.accessToken,object);
    }

    editCalculatedFields(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/calculation/`+this.accessToken,object);
    }

    fetchCalculatedFields(id : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/get_calculation/`+ id + '/' +this.accessToken);
    }

    deleteCalculatedFields(id : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.delete<any>(`${environment.apiUrl}/delete_calculation/`+ id + '/' +this.accessToken);
    }

    //Drill Through
    getDrillThroughData(object : any, isPublicUrl : any){
      if(isPublicUrl){
        return this.http.post<any>(`${environment.apiUrl}/public/dashboard_drill_through/`,object);
      }
      else {
        const currentUser = localStorage.getItem('currentUser');
        this.accessToken = JSON.parse(currentUser!)['Token'];
        return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through/`+this.accessToken,object);
      }
    }

    getSheetsInDashboardAction(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_sheets/`+this.accessToken,object);
    }

    saveDrillThroughAction(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_save/`+this.accessToken,object);
    }

    updateDrillThroughAction(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/dashboard_drill_through_save/`+this.accessToken,object);
    }

    getDrillThroughAction(id : any, isPublicUrl : any){
      let object = {
        action_id: id
      }
      if(isPublicUrl){
        return this.http.post<any>(`${environment.apiUrl}/public/dashboard_drill_through_get/`,object);
      }
      else {
        const currentUser = localStorage.getItem('currentUser');
        this.accessToken = JSON.parse(currentUser!)['Token'];
        return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_get/`+this.accessToken,object);
      }
    }

    getDrillThroughActionList(object : any, isPublicUrl : any){
      if(isPublicUrl){
        return this.http.post<any>(`${environment.apiUrl}/public/dashboard_drill_through_action_list/`,object);
      }
      else {
        const currentUser = localStorage.getItem('currentUser');
        this.accessToken = JSON.parse(currentUser!)['Token'];
        return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_action_list/`+this.accessToken,object);
      }
    }

    getDrillThroughActionEditPreview(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_action_detail/`+this.accessToken,object);
    }

    deleteDrillThroughAction(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_delete/`+this.accessToken,object);
    }

    actionUpdateOnSheetRemove(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_drill_through_action_sheet_update/`+this.accessToken,object);
    }

    resetDrillThroughOnActionDelete(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/drill_noaction_sheet/`+this.accessToken,object);
    }

    //refresh dashboard
    refreshDashboardData(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/refresh_dashboard/`+this.accessToken,object);
    }

    //excel and csv replace & upsert(append)
    replaceExcelOrCsvFile(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/file_replace/`+this.accessToken,object);
    }

    autoRefreshFrequency(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard/refresh/schedule/`+this.accessToken,object);
    }

    fetchRefreshedData(id : any){
      return this.http.get<any>(`${environment.apiUrl}/dashboard/refresh/data/`+ id+'/');
    }

    fetchSchedularData(dashboardId : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/dashboard/refresh/status/`+ dashboardId + '/' +this.accessToken);
    }

    upsertExcelOrCsvFile(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/file_upsert/`+this.accessToken,object);
    }

    appendExcelOrCsvFile(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/file_append/`+this.accessToken,object);
    }

    //data transformation
    getTablesForDataTransformation(hierarchyId : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/Database_tables/`+this.accessToken+`/${hierarchyId}`);
    }

    setTransformations(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/Database_Transformation/`+this.accessToken,object);
    }

    checkDatasourceConnection(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/test_connection/`+this.accessToken,object);
    }

    getTransformationsPreview(id : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/Edit_Transformations/`+this.accessToken+`/${id}`);
    }

    getTransformationList(page:any, pageCount:any, search:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/transformation_list/`+this.accessToken+`/?page=${page}&page_count=${pageCount}`+(search ? `&search=${search}` : ``));
    }

    getDeleteTransformationMessage(hierarchyId:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/transformation_del_stmt/`+this.accessToken+`/${hierarchyId}`);
    }

    deleteTransformation(hierarchyId:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.delete<any>(`${environment.apiUrl}/Database_Transformation/`+this.accessToken+`/${hierarchyId}`);
    }

    updateDashboardOnSchedularLoad(object : any, dashboardId : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/shared_dashboard_refresh_update/`+ dashboardId ,object);
    }

    clearTabSheetFilterActions(obj: any) {
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/clear_dashboard_tabs/`+this.accessToken,obj);
    }

    //color palette
    saveColorPalette(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/colour_palette/`+this.accessToken,object);
    }
    updateColorPalette(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/colour_palette/`+this.accessToken,object);
    }
    getColorPalettes(id : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/colour_palette/`+this.accessToken+`/${id}`);
    }

    buildSampleDashbaord(id : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/connectwise_dashboard/`+id+'/'+this.accessToken);
    }

    buildSampleHALOPSADashbaord(id : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/halops_dashboard/`+id+'/'+this.accessToken);
    }

    buildQuickBooksDashbaord(id : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/quickbooks_dashboard/`+id+'/'+this.accessToken);
    }

    buildSampleSalesforceDashbaord(id : number){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/salesforce_dashbaord/`+id+'/'+this.accessToken);
    }

    fetchSDKData(){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/get_app_details/`+this.accessToken);
    }

    saveSDKData(object: any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/create_app/`+this.accessToken,object);
    }

    fetchDashboardToken(object: any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_token/`+this.accessToken,object);
    }

    fetchSheetToken(object: any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/sheet_token/`+this.accessToken,object);
    }

    exportDashboard(object:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/export_dashboard/`+this.accessToken,object);
    }

    importDashboard(object:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/import_dashboard/`+this.accessToken,object);
    }

    getSheetSdkData(object:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dynamic_filter_embedded_sheet/`+this.accessToken,object);
    }

    fetchSheetId(object:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/app_sheet_token/`+this.accessToken,object);
    }

    getDashboardIdFromToken(object: any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/app_dashboard_token/`+this.accessToken,object);
    }

    getEmbedDashboardData(obj:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dynamic_filter_embedded_dashboard/`+this.accessToken,obj);
    }
    getTargetdbsForSwitch(obj:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_connection_list/`+this.accessToken,obj);
    }
    datbaseSwitch(obj:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dashboard_switch/`+this.accessToken,obj);
    }
    //etl
    saveEtl(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/etl/`+this.accessToken,object);
    }

    updateEtl(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/etl_update/`+this.accessToken,object);
    }

    getEtlDataFlow(id : any, type : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/etl_data/`+this.accessToken+'/'+id+`?flow=${type}`);
    }

    getEtlDataFlowList(page:any, pageSize:any, search:any, type:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/dags_list/`+this.accessToken+`?page=${page}&page_size=${pageSize}`+(search ? `&search=${search}` : ``)+`&flow=${type}`);
    }

    deleteDataFlow(id : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.delete<any>(`${environment.apiUrl}/dag_delete/`+this.accessToken+'/'+id);
    }

    runEtl(dagId : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/trigger/`+dagId+'/'+this.accessToken,{});
    }

    getDataFlowStatus(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/dataflow_status/`+this.accessToken,object);
    }

    getDataFlowLogs(object : any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/Dataflow_Task_status/`+this.accessToken,object);
    }
    getConnectionsForEtl(type:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/etl_source_objects/`+this.accessToken+`?connection_type=${type}`);
    }
    getDataObjectsForFile(id:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/get_file_detials/`+this.accessToken+'/'+id);
    }
    getFilesForServer(from:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/list-files/`+this.accessToken+`?path=${from}`);
    }
    getDataObjectsFromServer(object:any){
      const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/server_files/`+this.accessToken, object);
    }

    getMailAletsDashboardData(id:any){
       const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.get<any>(`${environment.apiUrl}/mail_alerts/`+this.accessToken+'/'+id+'/');
    }
    updateEmailAlerts(obj:any){
       const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.put<any>(`${environment.apiUrl}/mail_alerts/`+ this.accessToken,obj);
    }
    saveEmailAlerts(obj:any){
       const currentUser = localStorage.getItem( 'currentUser' );
      this.accessToken = JSON.parse( currentUser! )['Token'];
      return this.http.post<any>(`${environment.apiUrl}/mail_alerts/`+ this.accessToken,obj);
    }
    analyzeAndDownloadDashboard(obj:any){
      return this.http.post<any>(`${environment.apiUrl}/analyze-dashboard/`,obj);
    }
    // Airflow API
    airflowToken: string | null = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlzcyI6W10sImF1ZCI6ImFwYWNoZS1haXJmbG93IiwibmJmIjoxNzQ5MDQyOTI5LCJleHAiOjE3NDkxMjkzMjksImlhdCI6MTc0OTA0MjkyOX0.OPipRIhG-me15qyyGXRlt2xLuNWKOr2RexHtU7xc8kyXqP3dHfcNAq2t6Zf6sNiKbnb437AyKsagA9rgbKK6wg';

    private getHeaders(): HttpHeaders {
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9',
        'Authorization': `Bearer ${this.airflowToken}`,
        'Connection': 'keep-alive',
        'Referer': 'http://3.101.147.3:8080', // or current airflow UI URL
        'User-Agent': navigator.userAgent
      });
      return headers;
    }

    getDags() {
      return this.http.get(`${environment.airflowApiUrl}/dags`, {
        headers: this.getHeaders(),
      });
    }

    getDagRuns(dagId: string) {
      return this.http.get(`${environment.airflowApiUrl}/dags/${dagId}/dagRuns`, {
        headers: this.getHeaders(),
      });
    }

    getTaskInstances(dagId: string, runId: string) {
      return this.http.get(
        `${environment.airflowApiUrl}/dags/${dagId}/dagRuns/${runId}/taskInstances`,
        { headers: this.getHeaders() }
      );
    }
}