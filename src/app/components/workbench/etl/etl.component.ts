import { Component } from '@angular/core';
import { NgbDropdown, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import Drawflow from 'drawflow';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { expression } from 'mathjs';
import { EtlGraphService } from '../etl-graph.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EtlLoggerViewComponent } from '../etl-logger-view/etl-logger-view.component';
import { DataFlowSearchFilterPipe } from '../../../shared/pipes/data-flow-search-filter.pipe';
import { ResizableTopDirective } from '../../../shared/directives/resizable-top.directive';

@Component({
  selector: 'app-etl',
  standalone: true,
  imports: [NgbModule, CommonModule, NgSelectModule, FormsModule, EtlLoggerViewComponent, DataFlowSearchFilterPipe, ResizableTopDirective],
  templateUrl: './etl.component.html',
  styleUrl: './etl.component.scss'
})
export class ETLComponent {
  drawflow: any;
  nodeToAdd: string = '';
  isOpen: boolean = true;
  active = 1;
  isNodeSelected: boolean = false;
  selectedNode: any;
  modal: any;
  connectionOptions: any[] = [];
  selectedConnection: any = null;
  dataObjectOptions: [] = [];
  selectedDataObject: any = null;
  posX: any;
  posY: any;
  tableTabId: number = 1;
  tableTypeTabId: number = 1;
  nodeTypeCounts: { [key: string]: number } = {};
  etlName: string = '';
  dataFlowId!: string;
  nodeName: string = '';
  isRunEnable : boolean = false;
  objectType : string = 'select';
  dataFlowStatus : any[] = [];
  runId: string = '';
  nodeLogs: any[] = [];
  pollingInterval: any;
  currentNodeColumns : any[] = [];
  logs : any = '';
  isLogShow : boolean = false;
  selectedGroupAttrs: any[] = [];
  groupAttributesList: any[] = [];
  allChecked: boolean = false;
  isSourceClicked : boolean = false;
  isRefrshEnable: boolean = false;
  dataFlowRunStatus: string = '';
  expression: string = '';
  selectedField: any = {};
  groupedColumns: any = {};
  selectedGroup: any = '';
  selectedColumn: any = {};
  selectedIndex: number = -1;
  isJoinerCondition: boolean = false;
  isCanvasSelected: boolean = false;
  canvasData: any = {parameters: [], sqlParameters: []};
  isParameter: boolean = false;
  isSQLParameter: boolean = false;
  isHaving : boolean = false;
  isWhere : boolean = false;
  isFilter : boolean = false;
  sourceSearchTerm: string = '';
  groupSearchTerm: string = '';
  attributeSearchTerm: string = '';
  parameterSearchTerm: string = '';
  expEditorSearchTerm: string = '';
  attrSelectionSearchTerm: string = '';
  selectedSourceAttributeIndex: number | null = null;
  selectedGroupAttributeIndex: number | null = null;
  selectedAttributeIndex: number | null = null;
  isCollapsed = false;
  type: string = '';
  fileSelectType: string = 'dataSource';
  sourcePath: string = '';
  selectedFile: any = '';
  Folders: any[] = [];
  dataTypes: string[] = [
    // Numeric types
    'smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'double precision', 'serial', 'bigserial', 'money', 'double', 'float', 'int',

    // Character types
    'char', 'character', 'varchar', 'character varying', 'text', 'string', 'any',
  
    // Boolean
    'boolean',
  
    // Date/Time types
    'date', 'time', 'time without time zone', 'time with time zone', 'timestamp', 'timestamp without time zone', 'timestamp with time zone', 'interval',
  
    // UUID
    'uuid',
  
    // Binary data
    'bytea',
  
    // Network types
    'cidr', 'inet', 'macaddr', 'macaddr8',
  
    // JSON types
    'json', 'jsonb',
  
    // Arrays
    'array',
  
    // Range types
    'int4range', 'int8range', 'numrange', 'tsrange', 'tstzrange', 'daterange',
  
    // Geometric types
    'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle',
  
    // XML
    'xml',
  
    // Full Text Search
    'tsvector', 'tsquery',
  
    // Bit string types
    'bit', 'bit varying',
  
    // Object identifiers
    'oid', 'regproc', 'regprocedure', 'regoper', 'regoperator', 'regclass', 'regtype', 'regrole', 'regnamespace',
  
    // Other
    'name', 'enum', 'composite', 'pg_lsn', 'txid_snapshot', 'unknown'
  ];

  constructor(private modalService: NgbModal, private toasterService: ToastrService, private workbechService: WorkbenchService, 
    private loaderService: LoaderService, private etlGraphService: EtlGraphService, private router: Router,private route: ActivatedRoute) {
      
      if (this.router.url.startsWith('/analytify/etlList/dataFlow')) {
        if (route.snapshot.params['id1']) {
          const id = +atob(route.snapshot.params['id1']);
          this.dataFlowId = id.toString();
        }
      }
  }

  ngOnInit() {
    this.loaderService.hide();
    this.intializeDrawflow();
  }
  intializeDrawflow() {
    setTimeout(() => {
      const container = document.getElementById('drawflow')!;
      this.drawflow = new Drawflow(container);
      this.drawflow.reroute = true;
      this.drawflow.start();
      this.drawflow.zoom = 0.8;
      this.drawflow.zoom_refresh();
      this.drawflow.drawflow.drawflow[this.drawflow.module].canvasData = this.canvasData;

      if(this.dataFlowId){
        this.getDataFlow();
      }

      const canvasElement = container.querySelector('.drawflow') as HTMLElement;

      canvasElement?.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Ignore clicks on nodes, ports, and connections
        const isOnNode = target.closest('.drawflow-node');
        const isOnInput = target.closest('.input');
        const isOnOutput = target.closest('.output');
        const isOnConnection = target.closest('svg.connection, .main-path');

        if (!isOnNode && !isOnInput && !isOnOutput && !isOnConnection) {
          console.log('Canvas clicked at:', event.clientX, event.clientY);
          this.isNodeSelected = true;
          this.isCanvasSelected = true;
          this.tableTabId = 7;
        }
      });

      this.drawflow.on('connectionCreated', (connection: any) => {

        const module = this.drawflow.module;
        const data = this.drawflow.drawflow.drawflow[module].data;

        const { input_id, input_class } = connection;
        const inputNode = data[input_id];
        const inputPort = inputNode.inputs[input_class];
        const nodeType = inputNode.data.type;
        if (nodeType !== 'Joiner' && inputPort.connections.length > 1) {
          const lastConnection = inputPort.connections[inputPort.connections.length - 1];
      
          this.drawflow.removeSingleConnection(lastConnection.node, input_id, lastConnection.input, input_class);
      
          console.log('Connection limit exceeded for this node type!');
        } else {
          this.getConnectionData(connection);
          this.getDropdownColumnsData(this.drawflow.getNodeFromId(input_id));
        }

      });
      this.drawflow.on('connectionSelected', (connection: any) => {
        // this.getConnectionData(connection);
      });

      this.drawflow.on('connectionRemoved', (connection: any) => {
        const { output_id, input_id } = connection;

        const sourceNode = this.drawflow.getNodeFromId(output_id);
        const targetNode = this.drawflow.getNodeFromId(input_id);

        if (targetNode.data.type === 'Joiner') {
          const nodeNamesDropdown = targetNode.data.nodeData.properties.nodeNamesDropdown;
          const sourceNodeName = sourceNode.data.nodeData.general.name;
      
          const index = nodeNamesDropdown.findIndex((item:any) => item.label === sourceNodeName);
          if (index !== -1) {
            const sourceNodeValue = nodeNamesDropdown[index].value;
            nodeNamesDropdown.splice(index, 1);

            const joinList = targetNode.data.nodeData.properties.joinList;
            const joinIndex = joinList.findIndex((join:any) => join.sourceNodeId === sourceNodeValue);
            if (joinIndex !== -1) {
              joinList.splice(joinIndex, 1);
            }

            if (targetNode.data.nodeData.properties.primaryObject?.value === sourceNodeValue) {
              targetNode.data.nodeData.properties.primaryObject = null;
            }

            if(nodeNamesDropdown.length <= 1){
              targetNode.data.nodeData.properties.joinList = [];
            }
            this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
          }
        }
        this.selectedNode = this.drawflow.getNodeFromId(input_id);
        if (this.selectedNode.data.type === 'target_data_object' && !this.selectedNode.data.nodeData.properties.create) {
          const mapper = this.selectedNode.data.nodeData.attributeMapper
          if (mapper.length > 0) {
            mapper.forEach((attr: any) => {
              attr.selectedColumn = null;
              attr.selectedDataType = '';
            });
          }
          this.selectedNode.data.nodeData.properties.truncate = false;
        } else if(this.selectedNode.data.type === 'Expression'){
          this.selectedNode.data.nodeData.attributes = [];
        } else if(this.selectedNode.data.type === 'Rollup'){
          this.selectedNode.data.nodeData.attributes = [];
          this.selectedNode.data.nodeData.properties.havingClause = '';
          this.selectedNode.data.nodeData.groupAttributes = [];
        } else if(this.selectedNode.data.type === 'Joiner'){
          this.selectedNode.data.nodeData.attributes = [];
          this.selectedNode.data.nodeData.properties.whereClause = '';
        } else if(this.selectedNode.data.type === 'filter'){
          this.selectedNode.data.nodeData.properties.filterCondition = '';
        }
        this.getDropdownColumnsData(this.selectedNode);
        if(this.selectedNode.hasOwnProperty('data')){
          const node = this.drawflow.getNodeFromId(this.selectedNode.id);
          this.getSelectedNodeData(node);
        }
      });

      this.drawflow.on('nodeSelected', (nodeId: number) => {
        const nodeEl = document.querySelector(`[id="node-${nodeId}"]`);
        this.tableTabId = 1;
        this.isCanvasSelected = false;
        if (nodeEl) {
          nodeEl.addEventListener('click', () => {
            const node = this.drawflow.getNodeFromId(nodeId);
            this.getSelectedNodeData(node);
          });
        }
      });

      // this.drawflow.on('nodeUnselected', () => {
      //   this.selectedNode = {data: {type: '', nodeData: {general: {name: this.etlName}}}};
      //   this.isNodeSelected = true;
      // });

      const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
      Object.entries(allNodes).forEach(([id, node]) => {
        console.log('Node ID:', id, 'Node Data:', node);
      });
    }, 100);
  }

  getConnectionData(connection: any) {
    const { output_id, input_id } = connection;

    const sourceNode = this.drawflow.getNodeFromId(output_id);
    const targetNode = this.drawflow.getNodeFromId(input_id);

    if(targetNode.data.type === 'Joiner'){
      targetNode.data.nodeData.properties.nodeNamesDropdown.push({label: sourceNode.data.nodeData.general.name, value: sourceNode.id});
      if(targetNode.data.nodeData.properties.nodeNamesDropdown.length > 1){
        targetNode.data.nodeData.properties.joinList.push({joinType: '', secondaryObject: null, joinCondition: '', sourceNodeId: sourceNode.id, joinObject: null});
      }
      this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
    }

    console.log('Output Node ID:', output_id);
    console.log('Input Node ID:', input_id);
    console.log('Source Node:', sourceNode);
    console.log('Target Node:', targetNode);
  }

  joinListUpdate(event:any, index:any){
    this.selectedNode.data.nodeData.properties.joinList[index].secondaryObject = event.label;
    this.selectedNode.data.nodeData.properties.joinList[index].sourceNodeId = event.value;
    this.updateNode('properties');
  }


  onDragStart(event: DragEvent, nodeType: string, modal: any, sourceOrTargetType:string) {
    this.nodeToAdd = nodeType;
    this.modal = modal;
    this.type = sourceOrTargetType;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const canvas = document.getElementById('drawflow')!;
    const rect = canvas.getBoundingClientRect();
    this.posX = event.clientX - rect.left;
    this.posY = event.clientY - rect.top;

    if (['source_data_object', 'target_data_object'].includes(this.nodeToAdd)) {
      this.modalService.open(this.modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
      this.getConnections();
    } else {
      this.addNode(this.nodeToAdd, this.posX, this.posY);
    }
  }

  addNode(name: string, posX: number, posY: number) {
    let data = { 
      type: '', 
      source: { type: '',  fileSelectFrom: '', path: '', file: '' },
      nodeData: { 
        general: { name: '' }, 
        connection: {}, dataObject: {}, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes: [], 
        groupAttributes: [],
        sourceAttributes: [],
        attributeMapper: [] as any[]
      } 
    };
    let iconPath = '';
    let altText = '';
    let baseName = name;
    let inputNodeCount = 1;
    let outputNodeCount = 1;

    if (baseName === 'source_data_object') {
      if (this.type === 'POSTGRESQL') {
        iconPath = './assets/images/etl/PostgreSQL-etl.svg';
        altText = 'PostgreSQL';
      } else if(this.type === 'file'){
        iconPath = './assets/images/etl/File-etl.svg';
        altText = 'file';
      }
      data.type = name;
      data.source = {type: this.type, fileSelectFrom: this.fileSelectType, path: this.sourcePath, file: this.selectedFile};
      data.nodeData = { 
        connection: this.selectedConnection, 
        dataObject: this.selectedDataObject, 
        general: { name: 'SRC_' + this.selectedDataObject?.tables }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: []
      };
      inputNodeCount = 0;
      outputNodeCount = 1;
    }
    else if (baseName === 'target_data_object') {
      if (this.type === 'POSTGRESQL') {
        iconPath = './assets/images/etl/PostgreSQL-etl.svg';
        altText = 'PostgreSQL';
      } else if(this.type === 'file'){
        iconPath = './assets/images/etl/File-etl.svg';
        altText = 'file';
      }
      data.type = name;
      data.nodeData = { 
        connection: this.selectedConnection, 
        dataObject: this.selectedDataObject, 
        general: { name: 'TGT_' + (this.objectType === 'select' ? this.selectedDataObject?.tables : this.selectedDataObject) }, 
        properties: { truncate: false, create: this.objectType === 'select' ? false : true, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: []
      };
      inputNodeCount = 1;
      outputNodeCount = 0;
      if(!data.nodeData.properties.create){
        let cols : any[] = [];
        for (const col of this.selectedDataObject.columns) {
          cols.push({
            column: col.col,
            dataType: col.dtype,
            selectedColumn: null,
            selectedDataType: ''
          });
        }
        data.nodeData.attributeMapper = cols;
      }
    }
    else if (baseName === 'Expression') {
      iconPath = './assets/images/etl/expression-etl.svg';
      altText = 'Expression';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `expression_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: []
      }
    }
    else if (baseName === 'Joiner') {
      iconPath = './assets/images/etl/mjoiner-etl.svg';
      altText = 'Joiner';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `joiner_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: [] 
      }
    }
    else if (baseName === 'Rollup') {
      iconPath = './assets/images/etl/rollup-etl.svg';
      altText = 'Rollup';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `rollup_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: []
      }
    }
    else if (baseName === 'Filter') {
      iconPath = './assets/images/etl/filter-etl.svg';
      altText = 'Filter';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `filter_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[],
        sourceAttributes: [],
        attributeMapper: []
      }
    }
    data.nodeData.general.name = data.nodeData.general.name.replace(/ /g, '_');
    let displayName = data.nodeData.general.name;
    if (displayName.length > 8) {
      displayName = displayName.substring(0, 8) + '..';
    }
    var html = document.createElement('div');
    html.innerHTML = `<div>
      <img src="${iconPath}" class="node-icon" alt="${altText}" />
      <div class="node-label" title="${data.nodeData.general.name}">${displayName}</div>
      <div class="node-status" style="display: none;"></div>
      </div>`;

    // this.drawflow.registerNode(name, html);
    const nodeId = this.drawflow.addNode(name, inputNodeCount, outputNodeCount, posX, posY, name, data, html.innerHTML);

    this.selectedConnection = null;
    this.selectedDataObject = null;
    this.objectType = 'select';
    this.fileSelectType = 'dataSource'; 
    this.sourcePath = ''; 
    this.selectedFile = '';
    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
    Object.entries(allNodes).forEach(([id, node]) => {
      console.log('Node ID:', id, 'Node Data:', node);
    });

    const node = this.drawflow.getNodeFromId(nodeId);
    this.selectedNode = node;

    if(this.selectedNode.data.type === 'source_data_object'){
      this.openAttributesSelection(null);
      this.groupAttributesList.forEach((group:any)=>{
        group.isChecked = true;
        this.toggleGroup(group);
      });
      this.isSourceClicked = true;
      this.applySelectedAttributes();
    }
  }

  updateNode(type: any, nameInput?: any) {
    let data = {};
    let nodeId = '';
    if(type !== 'parameter'){
      nodeId = this.selectedNode.id;
    }
    if (type === 'general') {
      let general;
      if(nameInput && nameInput?.invalid && nameInput?.touched){
        general = { name: this.selectedNode.data.nodeData.general.name}
      } else{
        general = { name: this.nodeName}
      }
      nodeId = this.selectedNode.id;
      if(['target_data_object'].includes(this.selectedNode.data.type) && this.selectedNode.data.nodeData.properties.create){
        let currentDataObject;
        // if(!this.selectedNode.data.nodeData.properties.create){
        //   currentDataObject = {
        //     ...this.selectedNode.data.nodeData.dataObject,
        //     tables: this.nodeName
        //   };
        // } else{
          currentDataObject = general.name;
        // }
        data = {
          ...this.selectedNode.data,
          nodeData: {
            ...this.selectedNode.data.nodeData,
            general: general,
            dataObject: currentDataObject
          }
        };
      } else{
        data = {
          ...this.selectedNode.data,
          nodeData: {
            ...this.selectedNode.data.nodeData,
            general: general
          }
        };
      }

      let displayName = general.name;
      if (displayName.length > 8) {
        displayName = displayName.substring(0, 8) + '..';
      }
      this.selectedNode.data.nodeData.general.name = general.name;
      const nodeElement = document.querySelector(`#node-${nodeId}`);
      if (nodeElement) {
        const labelElement = nodeElement.querySelector('.node-label') as HTMLElement;
        if (labelElement) {
          labelElement.innerText = displayName;
          labelElement.setAttribute('title', general.name);
        }
      }
    } else if (type === 'properties') {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else if (type === 'attribute') {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else if (type === 'groupAttribute'){
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else if(type === 'parameter'){
      const module = this.drawflow.module || 'Home';
      this.drawflow.drawflow.drawflow[module].canvasData = this.canvasData;
    } else{
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    }
    if(type !== 'parameter'){
      this.drawflow.updateNodeDataFromId(nodeId, data);
      const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
      Object.entries(allNodes).forEach(([id, node]) => {
        this.getDropdownColumnsData(node);
      });
    }
    console.log(this.drawflow.drawflow.drawflow[this.drawflow.module]);
  }

  getSelectedNodeData(node: any) {
    this.isNodeSelected = true;
    this.selectedNode = node;
    this.nodeName = this.selectedNode.data.nodeData.general.name;
    console.log(this.selectedNode);
    this.selectedAttributeIndex = null;
    this.selectedGroupAttributeIndex = null;
    this.selectedSourceAttributeIndex = null;
    if(this.isRefrshEnable && !['success', 'failed'].includes(this.dataFlowRunStatus)){
      this.tableTypeTabId = 2;
      this.getDataFlowLogs(this.nodeName);
    }
  }

  getConnections() {
    // let object = {};
    this.workbechService.getConnectionsForEtl(this.type).subscribe({
      next: (data) => {
        console.log(data);
        this.connectionOptions = data.data;
      },
      error: (error: any) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }
  getDataObjects() {
    let server_id = this.selectedConnection?.server_id
    const object = {
      hierarchy_ids: [server_id]
    }
    if (server_id) {
      this.workbechService.getTablesForDataTransformation(this.selectedConnection.server_id).subscribe({
        next: (data) => {
          console.log(data);
          this.dataObjectOptions = data?.tables;
        },
        error: (error) => {
          console.log(error);
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        }
      });
    }
  }
  getDataObjectsforFile(){
     let server_id = this.selectedConnection?.server_id
    if (server_id) {
      this.workbechService.getDataObjectsForFile(this.selectedConnection.server_id).subscribe({
        next: (data) => {
          console.log(data);
          this.selectedDataObject = data?.tables[0];
        },
        error: (error) => {
          console.log(error);
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        }
      });
    }
  }
  getFilesforServer() {
    this.workbechService.getFilesForServer(this.sourcePath).subscribe({
      next: (data) => {
        console.log(data);
        this.Folders = data?.files || [];
      },
      error: (error) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }
  getDataObjectsFromServer() {
    let object = {
      source_type: this.sourcePath,
      file_name: this.selectedFile,
    }
    this.workbechService.getDataObjectsFromServer(object).subscribe({
      next: (data) => {
        console.log(data);
        this.selectedDataObject = data?.tables[0];
      },
      error: (error) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }

  // saveOrUpdateEtlDataFlow() {
  //   const exportedData = this.drawflow.export();
  //   const nodes = exportedData.drawflow.Home.data;
  //   console.log(exportedData);
  //   console.log(nodes);

  //   const tasks: any[] = [];
  //   const flows: string[][] = [];

  //   const result: number[][] = [];
  //   const queue: number[] = [];

  //   // Step 1: Add all nodes with empty inputs (sources) to queue
  //   for (const key in nodes) {
  //     const node = nodes[key];
  //     if (!node.inputs || Object.keys(node.inputs).length === 0) {
  //       queue.push(Number(key)); // Use key directly here
  //     }
  //   }

  //   const visited = new Set<string>();

  //   // Step 2: Process the queue
  //   while (queue.length > 0) {
  //     const current = queue.shift();
  //     if (current === undefined) continue; // type guard

  //     const node = nodes[current];
  //     if (!node || !node.outputs) continue;

  //     for (const outputKey in node.outputs) {
  //       const connections = node.outputs[outputKey]?.connections || [];
  //       for (const conn of connections) {
  //         const to = Number(conn.node);
  //         const key = `${current}-${to}`;
  //         if (!visited.has(key)) {
  //           visited.add(key);
  //           result.push([current, to]);
  //           flows.push([this.drawflow.getNodeFromId(current).data.nodeData.general.name, this.drawflow.getNodeFromId(to).data.nodeData.general.name]);
  //           queue.push(to);
  //         }
  //       }
  //     }
  //   }

  //   result.forEach((connection, index) => {
  //     const [prevNode, currentNode] = connection;

  //     const task = this.generateTasks(prevNode, nodes);
  //     if (!tasks.some((t: any) => t.id === task.id)) {
  //       tasks.push(task);
  //     }
  //   });

  //   result.forEach((connection, index) => {
  //     const [prevNode, currentNode] = connection;

  //     const task = this.generateTasks(currentNode, nodes);
  //     if (!tasks.some((t: any) => t.id === task.id)) {
  //       tasks.push(task);
  //     }
  //   });

  //   console.log(result);
  //   console.log(flows);
  //   console.log(tasks);

  //   if(tasks.length > 0){
  //     this.isRunEnable = tasks.some((task: any) => task.type === 'target_data_object');
  //   }

  //   const etlFlow = {
  //     dag_id: this.etlName,
  //     tasks: tasks,
  //     flow: flows
  //   };

  //   console.log(etlFlow);

  //   const jsonString = JSON.stringify(exportedData);
  //   const blob = new Blob([jsonString], { type: 'application/json' });
  //   const file = new File([blob], 'etl-drawflow.json', { type: 'application/json' });

  //   const formData = new FormData();
  //   formData.append('transformation_flow', file);
  //   formData.append('ETL_flow', JSON.stringify(etlFlow));

  //   if(this.dataFlowId){
  //     formData.append('id', this.dataFlowId);
  //     this.workbechService.updateEtl(formData).subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         this.isRunEnable = true;
  //         this.dataFlowId = data.dataflow_id;
  //         this.toasterService.success(data.message, 'success', { positionClass: 'toast-top-right' });
  //       },
  //       error: (error: any) => {
  //         this.isRunEnable = false;
  //         this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
  //         console.log(error);
  //       }
  //     });
  //   } else{
  //     this.workbechService.saveEtl(formData).subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         this.isRunEnable = true;
  //         this.dataFlowId = data.dataflow_id;
  //         this.toasterService.success(data.message, 'success', { positionClass: 'toast-top-right' });
  //       },
  //       error: (error: any) => {
  //         this.isRunEnable = false;
  //         this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
  //         console.log(error);
  //       }
  //     });
  //   }
  // }

  saveOrUpdateEtlDataFlow(): void {
    const exportedData = this.drawflow.export();
    const nodes = exportedData.drawflow.Home.data;

    const tasks: any[] = [];
    const flows: string[][] = [];
    const visitedEdges = new Set<string>();
    const allTo = new Set<number>();
    const adjacency = new Map<number, number[]>();

    for (const key in nodes) {
      const from = Number(key);
      const outputs = nodes[key].outputs;
      if (!outputs) {
        continue;
      }
      for (const outKey in outputs) {
        for (const conn of outputs[outKey]?.connections ?? []) {
          const to = Number(conn.node);
          allTo.add(to);
          if (!adjacency.has(from)) {
            adjacency.set(from, []);
          }
          adjacency.get(from)!.push(to);
        }
      }
    }

    const sources = Object.keys(nodes)
      .map(id => Number(id))
      .filter(id => !allTo.has(id));

    const queue = [...sources];
    while (queue.length) {
      const current = queue.shift()!;
      const neighbors = adjacency.get(current) || [];
      for (const target of neighbors) {
        const edgeKey = `${current}-${target}`;
        if (visitedEdges.has(edgeKey)) {
          continue;
        }
        visitedEdges.add(edgeKey);

        const sourceName = this.drawflow.getNodeFromId(current).data.nodeData.general.name;
        const targetName = this.drawflow.getNodeFromId(target).data.nodeData.general.name;
        flows.push([sourceName, targetName]);

        const taskA = this.generateTasks(current, nodes);
        if (!tasks.some(t => t.id === taskA.id)) {
          tasks.push(taskA);
        }
        const taskB = this.generateTasks(target, nodes);
        if (!tasks.some(t => t.id === taskB.id)) {
          tasks.push(taskB);
        }

        queue.push(target);
      }
    }

    console.log(tasks);
    console.log(flows);

    if(tasks.length > 0){
      this.isRunEnable = tasks.some((task: any) => task.type === 'target_data_object');
    }

    const etlFlow = {
      dag_id: this.etlName,
      tasks,
      flow: flows
    };
    console.log(etlFlow);

    const jsonString = JSON.stringify(exportedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'etl-drawflow.json', { type: 'application/json' });
    const flow_type = 'dataflow';

    const formData = new FormData();
    formData.append('transformation_flow', file);
    formData.append('ETL_flow', JSON.stringify(etlFlow));
    formData.append('flow_type', flow_type);

    if(this.dataFlowId){
      formData.append('id', this.dataFlowId);
      this.workbechService.updateEtl(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isRunEnable = true;
          this.dataFlowId = data.dataflow_id;
          this.toasterService.success(data.message, 'success', { positionClass: 'toast-top-right' });
        },
        error: (error: any) => {
          this.isRunEnable = false;
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          console.log(error);
        }
      });
    } else{
      this.workbechService.saveEtl(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isRunEnable = true;
          this.dataFlowId = data.dataflow_id;
          const encodedId = btoa(this.dataFlowId.toString());
          this.router.navigate(['/analytify/etlList/etl/'+encodedId]);
          this.toasterService.success('DataFlow Saved Successfully', 'success', { positionClass: 'toast-top-right' });
        },
        error: (error: any) => {
          this.isRunEnable = false;
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          console.log(error);
        }
      });
    }
  }
  runDataFlow() {
    this.workbechService.runEtl(this.etlName).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isRefrshEnable = true;
        this.runId = data.run_id;
        // this.startPollingDataFlowStatus(data.run_id);
        Object.entries(this.drawflow.drawflow.drawflow[this.drawflow.module].data).forEach(([id, node]) => {
          const nodeElement = document.querySelector(`#node-${id}`);
          if (nodeElement) {
            const statusDiv = nodeElement.querySelector('.node-status') as HTMLElement;
            if (statusDiv) {
              statusDiv.textContent = '';
              statusDiv.style.display = 'none';
              statusDiv.className = 'node-status'; // remove any previous status class
            }
          }
        });
        this.isLogShow = true;
        this.getDataFlowStatus(data.run_id);
        this.toasterService.success('Run Successfully', 'success', { positionClass: 'toast-top-right' });
      },
      error: (error: any) => {
        this.isRefrshEnable = false;
        this.isLogShow = false;
        if (error?.error?.message?.detail?.includes('not found')) {
          this.toasterService.info('Please Run After 5 seconds.', 'info', { positionClass: 'toast-top-right' });
        } else {
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        }
        console.log(error);
      }
    });
  }
  getDataFlowStatus(runId : any){
    let object = {
      dag_id: this.etlName,
      run_id: runId
    }
    this.workbechService.disableLoaderForNextRequest();
    this.workbechService.getDataFlowStatus(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowStatus = data.tasks;
        this.dataFlowRunStatus = data.status;
        // if (data.status === 'success' || data.status === 'failed') {
        //   clearInterval(this.pollingInterval);
        // }

        Object.entries(this.drawflow.drawflow.drawflow[this.drawflow.module].data).forEach(([id, node]) => {
          const node1 = this.drawflow.getNodeFromId(id);
          const nodeName = node1.data.nodeData.general.name;

          // Find matching task status from dataFlowStatus
          const matchedTask = this.dataFlowStatus.find(task => task.task === nodeName);

          if (matchedTask) {
            let status = matchedTask.state;
            if (node1) {
              const nodeElement = document.querySelector(`#node-${id}`);
              if (nodeElement) {
                const statusDiv = nodeElement.querySelector('.node-status')  as HTMLElement;
                if (statusDiv && status) {
                  statusDiv.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                  statusDiv.style.display = 'block';
                  statusDiv.className = `node-status node-status-${status}`;
                }
              }
            }
          }
        });
        // this.tableTypeTabId = 2;
        if(!['success', 'failed'].includes(data.status)){
          setTimeout(() => {
            this.getDataFlowStatus(runId);
          }, 3000);
        } else {
          this.isRefrshEnable = false;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  getDataFlowLogs(taskId:any){
    let object = {
      dag_id: this.etlName,
      run_id: this.runId,
      task_id: taskId
    }
    this.workbechService.getDataFlowLogs(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.logs = data.content;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  generateTasks(nodeId: any, nodes: any) {
    // Build task for currentNode
    const task: any = {
      type: nodes[nodeId].data.type,
      id: nodes[nodeId].data.nodeData.general.name,
    };

    if (nodes[nodeId].data.type === 'source_data_object') {
      let sourceAttr: any[] = [];
      nodes[nodeId].data.nodeData.sourceAttributes.forEach((atrr: any) => {
        const array = [atrr.attributeName, atrr.dataType, atrr.selectedColumn.label, atrr.selectedColumn.dataType];
        sourceAttr.push(array);
      });
      let attr: any[] = [];
      nodes[nodeId].data.nodeData.attributes.forEach((atrr: any) => {
        const array = [atrr.attributeName, atrr.dataType, atrr.expression];
        attr.push(array);
      });
      if (nodes[nodeId].data?.source?.type === 'POSTGRESQL') {
        task.format = 'database',
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id;
        task.path = '';
      } else if(nodes[nodeId].data?.source?.type === 'file') {
        task.format = 'file';
        if(nodes[nodeId].data.source.fileSelectFrom === 'server'){
          task.path = `${nodes[nodeId].data.source.path}/${nodes[nodeId].data.source.file}`;
          task.hierarchy_id = '';
        } else if(nodes[nodeId].data.source.fileSelectFrom === 'dataSource'){
          task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id;
          task.path = '';
        }
      } else{
        task.format = 'database';
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id;
        task.path = '';
      }
      task.source_table_name = nodes[nodeId].data.nodeData.dataObject.tables;
      task.attributes = attr;
      task.source_attributes = sourceAttr;
    } else {
      if (nodes[nodeId].data.type === 'target_data_object') {
        if(!nodes[nodeId].data.nodeData.properties.create){
          let attrMapper: any[] = [];
          nodes[nodeId].data.nodeData.attributeMapper.forEach((atrr: any) => {
            const array = [atrr.column, atrr.dataType, atrr.selectedColumn.label, atrr.selectedDataType];
            attrMapper.push(array);
          });
          task.attribute_mapper = attrMapper;
        }
        task.format = 'database',
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id,
        task.path = '',
        task.target_table_name = nodes[nodeId].data.nodeData.properties.create ? nodes[nodeId].data.nodeData.dataObject : nodes[nodeId].data.nodeData.dataObject.tables;
        task.truncate = nodes[nodeId].data.nodeData.properties.truncate;
        task.create = nodes[nodeId].data.nodeData.properties.create;
      } else if(nodes[nodeId].data.type === 'Rollup'){
        let grp : any[] = [];
        nodes[nodeId].data.nodeData.groupAttributes.forEach((atrr:any)=>{
          const array = [atrr.aliasName, '', atrr.selectedColumn.group+'.'+atrr.selectedColumn.label];
          grp.push(array);
        });
        let attr : any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr:any)=>{
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          attr.push(array);
        });
        task.group_attributes = grp;
        task.having_clause = nodes[nodeId].data.nodeData.properties.havingClause;
        task.attributes = attr;
      } else if(nodes[nodeId].data.type === 'Filter'){
        task.filter_conditions = nodes[nodeId].data.nodeData.properties.filterCondition;
      } else if(nodes[nodeId].data.type === 'Joiner'){
        task.primary_table = nodes[nodeId].data.nodeData.properties.primaryObject.label;
        let joins : any[] = [];
        nodes[nodeId].data.nodeData.properties.joinList.forEach((join:any)=>{
          const array = [join.joinType, join.secondaryObject, join.joinCondition];
          joins.push(array);
        });
        let attr : any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr:any)=>{
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          attr.push(array);
        });
        task.joining_list = joins;
        task.where_clause = nodes[nodeId].data.nodeData.properties.whereClause;
        task.attributes = attr;
      } else if(nodes[nodeId].data.type === 'Expression'){
        let exps : any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr:any)=>{
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          exps.push(array);
        });
        task.expressions_list = exps;
      }

      const inputConnections = nodes[nodeId].inputs?.input_1?.connections || [];
      if (inputConnections.length > 0) {
        const prevTaskIds = inputConnections.map((conn: any) => nodes[conn.node].data.nodeData.general.name);
        if(nodes[nodeId].data.type === 'Joiner'){
          task.previous_task_id = prevTaskIds;
        } else{
          task.previous_task_id = prevTaskIds[0];
        }
      }
    }

    return task;
  }
  addNewAttribute(){
    let count = this.selectedNode.data.nodeData.attributes.length+1;
    let attribute = {attributeName: 'ATTR_NAME_'+count, dataType: 'varchar', expression: ''}
    this.selectedNode.data.nodeData.attributes.push(attribute);
  }
  deleteAttribute(index:number){
    this.selectedNode.data.nodeData.attributes.splice(index, 1);
    this.updateNode('attribute');
  }
  addNewGroupAttribute(){
    let attribute = {aliasName: '', selectColumnDropdown: this.selectedNode.data.nodeData.dataObject, selectedColumn: null, dataType: '',}
    this.selectedNode.data.nodeData.groupAttributes.push(attribute);
  }
  deleteGroupAttribute(index:number){
    this.selectedNode.data.nodeData.groupAttributes.splice(index, 1);
    this.updateNode('groupattribute');
  }
  deleteSourceAttribute(index:number){
    this.selectedNode.data.nodeData.sourceAttributes.splice(index, 1);
    this.updateNode('');
  }
  startPollingDataFlowStatus(runId: any) {
    // Clear any existing polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  
    this.pollingInterval = setInterval(() => {
      this.getDataFlowStatus(runId);
    }, 2000); // Poll every 3 seconds
  }

  getDropdownColumnsData(node:any){
    const tree = this.etlGraphService.buildUpstreamTree(this.drawflow, node.id);
    console.log('nested upstream tree:', tree);

    const list = this.etlGraphService.flattenUpstream(tree);
    console.log('flattened topo list:', list);
    
    let childrenList = list.slice(1); // Exclude the selected node at index 0

    const inputIds: number[] = [];

    Object.values(node.inputs).forEach((input:any) => {
      input.connections.forEach((connection:any) => {
        inputIds.push(connection.node);
      });
    });

    childrenList = inputIds;

    const childDataObjects: any[] = [];
    const childAttributes: any[] = [];
    let childGrpAttributes: any = {};
    let childSourceAttributes: any = {};
    const nodeNames: any[] = [];
    const nodeTypes: any[] = [];


    childrenList.forEach(childId => {
      const childNode = this.drawflow.getNodeFromId(childId);
      if (childNode?.data?.nodeData) {
        childDataObjects.push(childNode.data.nodeData.dataObject);
        childAttributes.push(childNode.data.nodeData.attributes);
        const nodeName = childNode.data.nodeData.general.name;
        if(childNode.data.type === 'source_data_object'){
          childSourceAttributes[nodeName] = childNode.data.nodeData.sourceAttributes;
        }
        if(childNode.data.type === 'Rollup'){
          childGrpAttributes[nodeName] = childNode.data.nodeData.groupAttributes;
        }
        nodeNames.push(nodeName);
        nodeTypes.push(childNode.data.type);
      }
    });

    console.log('Children DataObjects:', childDataObjects);
    console.log('Children Attributes:', childAttributes);

    this.currentNodeColumns = [];

    for (let i = 0; i < childDataObjects.length; i++) {
      const nodeName = nodeNames[i];
      const nodeType = nodeTypes[i];
      const columns = childDataObjects[i]?.columns || [];
      const attributes = childAttributes[i] || [];
      const sourceAttributes = childSourceAttributes[i] || [];

      let items = [];

      if(nodeType === 'source_data_object'){
        const attr = childSourceAttributes[nodeName] || [];
        if(attr.length > 0){
          for (const atr of attr) {
            attr
            items.push({...atr.selectedColumn, group: nodeName, label: atr.attributeName, value: atr.attributeName, dataType: atr.dataType});
          }
        }
      } 
      else if(!['Rollup', 'Expression', 'Joiner'].includes(nodeType)){
        let dataObjects = JSON.parse(JSON.stringify(childDataObjects[i]));
        dataObjects.forEach((object:any)=>{
          object.group = nodeName;
        });
        items = dataObjects;
      }
       if(nodeType === 'Rollup'){
        const attr = childGrpAttributes[nodeName] || [];
        if(attr.length > 0){
          for (const atr of attr) {
            items.push({
              label: atr.aliasName,
              value: atr.aliasName,
              column: atr.selectedColumn,
              group: nodeName
            });
          }
        }
      }

      for (const attr of attributes) {
        items.push({
          label: attr.attributeName,
          value: attr.attributeName,
          dataType: attr.dataType,
          group: nodeName
        });
      }

      this.currentNodeColumns.push(...items);
    }

    this.currentNodeColumns = this.currentNodeColumns.filter((item, index, self) => {
      return index === self.findIndex(t => t.label === item.label && t.group === item.group);
    });
    console.log('Children columns:', this.currentNodeColumns);
    if(!['source_data_object', 'target_data_object'].includes(node.data.type)){
      node.data.nodeData.dataObject = this.currentNodeColumns;
      if(node.data.type === 'Rollup'){
        node.data.nodeData.groupAttributes.forEach((grp:any)=>{
          grp.selectColumnDropdown = this.currentNodeColumns;
          const match = this.currentNodeColumns.find((col: any) => 
            col.group === grp.selectedColumn?.group && 
            col.label === grp.selectedColumn?.label
          );
      
          if (!match) {
            grp.selectedColumn = '';
          }
        });
      }
      this.drawflow.updateNodeDataFromId(node.id, node.data);
    } else if(node.data.type === 'target_data_object'){
      node.data.nodeData.columnsDropdown = this.currentNodeColumns;
      this.drawflow.updateNodeDataFromId(node.id, node.data);
    }

    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
      Object.entries(allNodes).forEach(([id, node]) => {
        console.log('Node ID:', id, 'Node Data:', node);
    });
  }

  openAttributesSelection(modal: any) {
    const dataObject = this.selectedNode.data.nodeData.dataObject || [];
  
    let flatList = [];
  
    if (this.selectedNode.data.type === 'Rollup') {
      const selectedGroups = this.selectedNode.data.nodeData.groupAttributes || [];
      flatList = dataObject.map((attr: any) => {
        const matched = selectedGroups.find((grp: any) => grp.selectedColumn?.value === attr.value);
        return {
          ...attr,
          isChecked: !!matched
        };
      });
    } else if (['Expression', 'Joiner'].includes(this.selectedNode.data.type)) {
      flatList = dataObject.map((attr: any) => ({
        ...attr,
        isChecked: false
      }));
    } else if (this.selectedNode.data.type === 'source_data_object') {
      const columns = dataObject.columns || [];
      flatList = columns.map((col: any) => {
        const attr = {
          label: col.col,
          value: col.col,
          dataType: col.dtype,
          group: this.selectedNode.data.nodeData.general.name,
        };

        if (this.isSourceClicked) {
          const selectedSources = this.selectedNode.data.nodeData.sourceAttributes || [];
          const matched = selectedSources.find((grp: any) => grp.selectedColumn?.value === attr.value);
          return {
            ...attr,
            isChecked: !!matched
          };
        } else {
          return {
            ...attr,
            isChecked: false
          };
        }
      });
    }
  
    // Group the flat list by `group`
    const grouped = flatList.reduce((acc: any[], attr: any) => {
      let groupObj = acc.find(g => g.group === attr.group);
      if (!groupObj) {
        groupObj = { group: attr.group, isChecked: false, attributes: [] };
        acc.push(groupObj);
      }
      groupObj.attributes.push({ ...attr });
      return acc;
    }, []);
  
    // Set group-level isChecked
    grouped.forEach((group:any) => {
      group.isChecked = group.attributes.every((attr: any) => attr.isChecked);
    });
  
    this.groupAttributesList = grouped;
  
    if(modal !== null){
      this.modalService.open(modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
        modalDialogClass: 'modal-lg modal-dialog-scrollable'
      });
    }
  }
  
  toggleGroup(group: any) {
    group.attributes.forEach((attr: any) => attr.isChecked = group.isChecked);
  }

  toggleAllAttributes() {
    this.groupAttributesList.forEach(attr => {
      attr.isChecked = this.allChecked;
    });
  }

  applySelectedAttributes() {
    const flatSelected = this.groupAttributesList
      .flatMap(g => g.attributes)
      .filter(attr => attr.isChecked);
  
    const dataObject = this.selectedNode.data.nodeData.dataObject;
  
    if (this.selectedNode.data.type === 'Rollup') {
      this.selectedNode.data.nodeData.groupAttributes = flatSelected.map(attr => ({
        aliasName: attr.label,
        selectColumnDropdown: dataObject,
        selectedColumn: attr,
        dataType: attr.dataType || attr.column.dataType
      }));
      this.updateNode('groupAttribute');
  
    } else if (['Expression', 'Joiner'].includes(this.selectedNode.data.type)) {
      const existingAttributes = this.selectedNode.data.nodeData.attributes || [];

      const usedNames: { [key: string]: number } = {};
      // Pre-fill usedNames with existing attribute names
      existingAttributes.forEach((attr:any) => {
        const baseName = attr.attributeName.split('_')[0];
        usedNames[baseName] = Math.max(usedNames[baseName] || 0,
          parseInt(attr.attributeName.split('_')[1] || '0'));
      });

      const newAttributes = flatSelected.map(attr => {
        let name = attr.label;
        if (usedNames[name] !== undefined) {
          usedNames[name]++;
          name = `${name}_${usedNames[name]}`;
        } else {
          usedNames[name] = 0;
        }

        return {
          attributeName: name,
          dataType: attr.dataType || attr.column?.dataType,
          expression: `${attr.group}.${attr.label}`
        };
      });

      this.selectedNode.data.nodeData.attributes = [...existingAttributes, ...newAttributes];
      this.updateNode('');
    } else if(this.selectedNode.data.type === 'source_data_object'){
      if(this.isSourceClicked){
        let items : any[] = [];
        for (const col of dataObject.columns) {
          items.push({
            label: col.col,
            value: col.col,
            dataType: col.dtype,
            group: this.selectedNode.data.nodeData.general.name
          });
        }
        this.selectedNode.data.nodeData.sourceAttributes = flatSelected.map(attr => ({
          attributeName: attr.label,
          selectColumnDropdown: items,
          selectedColumn: attr,
          dataType: attr.dataType || attr.column.dataType
        }));
      } else{
        const usedNames: { [key: string]: number } = {};
        const existingNames = new Set<string>();

        // Include existing attribute names from both lists
        const existingAttributes = this.selectedNode.data.nodeData.attributes || [];
        const existingSourceAttributes = this.selectedNode.data.nodeData.sourceAttributes || [];

        [...existingAttributes, ...existingSourceAttributes].forEach(attr => {
          existingNames.add(attr.attributeName);

          const match = attr.attributeName.match(/^(.+?)(?:_(\d+))?$/);
          if (match) {
            const base = match[1];
            const suffix = match[2] ? parseInt(match[2]) : 0;
            usedNames[base] = Math.max(usedNames[base] || 0, suffix);
          }
        });

        flatSelected.forEach(attr => {
          let baseName = attr.label;
          let name = baseName;

          if (existingNames.has(name)) {
            let count = (usedNames[baseName] || 0) + 1;
            do {
              name = `${baseName}_${count}`;
              count++;
            } while (existingNames.has(name));
            usedNames[baseName] = count - 1;
          }

          existingNames.add(name);

          this.selectedNode.data.nodeData.attributes.push({
            attributeName: name,
            dataType: attr.dataType || attr.column?.dataType,
            expression: `${attr.group}.${attr.label}`
          });
        });


      }
      this.updateNode('');
    }
  }

  openExpressionEdit(modal:any, attribute:any, index:any){
    if(index !== null || index !== undefined){
      this.selectedIndex = index;
    }
    let dataObject: any[] = [];
    if(attribute.paramName){
      dataObject = [''].map((col: any) => ({
        label: '',
        value: '',
        dataType: '',
        group: 'Project Parameters'
      }));
    } else {
      const nodeData = JSON.parse(JSON.stringify(this.selectedNode.data.nodeData));

      if (this.selectedNode.data.type === 'source_data_object') {
        const columns = nodeData.dataObject.columns || [];
        const group = this.selectedNode.data.nodeData.general.name;

        dataObject = columns.map((col: any) => ({
          label: col.col,
          value: col.col,
          dataType: col.dtype,
          group: group
        }));
      } else {
        dataObject = nodeData.dataObject || [];
      }
    }

    this.groupedColumns = dataObject.reduce((acc: any, attr: any) => {
      if (!acc[attr.group]) {
        acc[attr.group] = [];
      }
      acc[attr.group].push(attr);
      return acc;
    }, {} as { [groupName: string]: any[] });

    const groupKeys = Object.keys(this.groupedColumns);
    this.selectedGroup = groupKeys.length > 0 ? groupKeys[0] : null;

    if(attribute.hasOwnProperty('secondaryObject')){
      this.isJoinerCondition = true;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute.secondaryObject;
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];
      this.expression = attribute.joinCondition;
    } else if(attribute.hasOwnProperty('paramName')){
      this.isJoinerCondition = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute;
      this.selectedColumn = '';
      if(attribute.hasOwnProperty('sql')){
        this.isSQLParameter = true;
        this.expression = attribute.sql;
      } else{
        this.isParameter = true;
        this.expression = attribute.default;
      }
    } else if(attribute === 'having'){
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isWhere = false;
      this.isFilter = false;
      this.isHaving = true;
      this.selectedField = 'Having Clause';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.havingClause;
    }  else if(attribute === 'where'){
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isFilter = false;
      this.isWhere = true;
      this.selectedField = 'Where Clause';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.whereClause;
    }  else if(attribute === 'filter'){
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = true;
      this.selectedField = 'Filter Condition';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.filterCondition;
    } else{
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute;
      this.selectedColumn = attribute;
      this.expression = attribute.expression;
    }
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
      modalDialogClass: 'modal-lg modal-dialog-scrollable'
    });
  }

  updateExpressionToNode(){
    if(this.isJoinerCondition){
      this.selectedNode.data.nodeData.properties.joinList[this.selectedIndex].joinCondition = this.expression;
    } else if(this.isParameter){
      this.canvasData.parameters[this.selectedIndex].default = this.expression;
    } else if(this.isSQLParameter){
      this.canvasData.sqlParameters[this.selectedIndex].sql = this.expression;
    } else if(this.isHaving){
      this.selectedNode.data.nodeData.properties.havingClause = this.expression;
    }  else if(this.isWhere){
      this.selectedNode.data.nodeData.properties.whereClause = this.expression;
    }  else if(this.isFilter){
      this.selectedNode.data.nodeData.properties.filterCondition = this.expression;
    } else{
      this.selectedNode.data.nodeData.attributes[this.selectedIndex].expression = this.expression;
    }

    if(!this.isParameter && !this.isSQLParameter){
      this.updateNode('');
    } else{
      this.updateNode('parameter');
    }
    this.expression = '';
    this.selectedGroup = '';
    this.selectedColumn = {};
    this.selectedIndex = -1;
    this.isJoinerCondition = false;
    this.isHaving = false;
    this.isWhere = false;
    this.isFilter = false;
  }

  insertOrReplace(text: string, textarea: HTMLTextAreaElement): void {
    const { selectionStart: start, selectionEnd: end } = textarea;
    const value = this.expression || '';
  
    const prefix = (value && start === end && value[start - 1] !== ' ') ? ' ' : '';
    this.expression = value.slice(0, start) + prefix + text + value.slice(end);
  
    const newPos = start + prefix.length + text.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    });
  }  
  
  getDataFlow(){
    this.workbechService.getEtlDataFlow(this.dataFlowId, 'dataflow').subscribe({
      next: (data) => {
        console.log(data);
        this.etlName = data.dag_id;
        this.dataFlowId = data.id;
        const drawFlowJson = JSON.parse(data.transformation_flow);
        this.drawflow.import(drawFlowJson);
        console.log(drawFlowJson);
        if (data?.etl_json?.tasks.length > 0) {
          this.isRunEnable = data?.etl_json?.tasks.some((task: any) => task.type === 'target_data_object');
        }
        // this.isRunEnable = true;
        this.canvasData = drawFlowJson.drawflow.Home.canvasData ? drawFlowJson.drawflow.Home.canvasData : {parameters: [], sqlParameters: []};
        console.log(this.canvasData);
        this.isNodeSelected = true;
        this.isCanvasSelected = true;
        this.tableTabId = 7;

        setTimeout(() => {
          const allNodes = this.drawflow.drawflow.drawflow['Home'].data;
          Object.entries(allNodes).forEach(([id, node]: [string, any]) => {
            const type = node.data?.type;
            if (type && !['source_data_object', 'target_data_object'].includes(type)) {
              this.nodeTypeCounts[type] = (this.nodeTypeCounts[type] || 0) + 1;
            }
            const displayName = (node.data?.nodeData?.general?.name || '').substring(0, 8) + '..';
            const nodeElement = document.querySelector(`#node-${id}`);
            if (nodeElement) {
              const labelElement = nodeElement.querySelector('.node-label') as HTMLElement;
              if (labelElement) {
                labelElement.innerText = displayName;
                labelElement.setAttribute('title', node.data?.nodeData?.general?.name);
              }
            }
          });
        }, 100);
      },
      error: (error: any) => {
        console.log(error);
        this.isRunEnable = false;
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }
  
  setAttributeAutoMapper(){
    const mapper = this.selectedNode.data.nodeData.attributeMapper
    if(mapper.length > 0){
      // mapper.forEach((attr:any)=>{
      //   this.selectedNode.data.nodeData.columnsDropdown
      //   if(attr.column === attr.selectedColumn){
      //     attr.selectedDataType = attr.dataType;
      //   }
      // });

      mapper.forEach((attr: any) => {
        const match = this.selectedNode.data.nodeData.columnsDropdown.find((col: any) =>
          col.label === attr.column // exact case-sensitive match
        );

        if (match) {
          attr.selectedColumn = match; // assign the matched column
          attr.selectedDataType = attr.dataType;
        }
      });
      this.drawflow.updateNodeDataFromId(this.selectedNode.id, this.selectedNode.data);
    }
  }

  addNewParameter(){
    const existingIndexes = this.canvasData?.parameters
      .map((p:any) => {
        const match = p.paramName?.match(/PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index:any) => index !== null)
      .sort((a:any, b:any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = {paramName: `PARAM_NAME_${newIndex}`, dataType: 'varchar', default: ''}
    this.canvasData?.parameters.push(parameter);
  }
  deleteParameter(index:any){
    this.canvasData.parameters.splice(index, 1);
    this.updateNode('parameter');
  }

  addNewSQLParameter(){
    const existingIndexes = this.canvasData?.sqlParameters
      .map((p:any) => {
        const match = p.paramName?.match(/SQL_PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index:any) => index !== null)
      .sort((a:any, b:any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = {paramName: `SQL_PARAM_NAME_${newIndex}`, dataType: 'varchar', sql: '', default: 'null'}
    this.canvasData?.sqlParameters.push(parameter);
  }
  deleteSQLParameter(index:any){
    this.canvasData.sqlParameters.splice(index, 1);
    this.updateNode('parameter');
  }

  moveUp(type:string) {
    let isChanged: boolean = false;
    if(type === 'sourceAttributes'){
      if (this.selectedSourceAttributeIndex !== null && this.selectedSourceAttributeIndex > 0) {
        const index = this.selectedSourceAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.sourceAttributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedSourceAttributeIndex--;
        isChanged = true;
      }
    } else if(type === 'groupAttributes'){
      if (this.selectedGroupAttributeIndex !== null && this.selectedGroupAttributeIndex > 0) {
        const index = this.selectedGroupAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.groupAttributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedGroupAttributeIndex--;
        isChanged = true;
      }
    } else if(type === 'attributes'){
      if (this.selectedAttributeIndex !== null && this.selectedAttributeIndex > 0) {
        const index = this.selectedAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.attributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedAttributeIndex--;
        isChanged = true;
      }
    }

    if(isChanged){
      this.updateNode('');
    }
  }
  
  moveDown(type:string) {
    let isChanged: boolean = false;
    if(type === 'sourceAttributes'){
      if (this.selectedSourceAttributeIndex !== null && this.selectedSourceAttributeIndex < this.selectedNode.data.nodeData.sourceAttributes.length - 1) {
        const index = this.selectedSourceAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.sourceAttributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedSourceAttributeIndex++;
        isChanged = true;
      }
    } else if(type === 'groupAttributes'){
      if (this.selectedGroupAttributeIndex !== null && this.selectedGroupAttributeIndex < this.selectedNode.data.nodeData.groupAttributes.length - 1) {
        const index = this.selectedGroupAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.groupAttributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedGroupAttributeIndex++;
        isChanged = true;
      }
    } else if(type === 'attributes'){
      if (this.selectedAttributeIndex !== null && this.selectedAttributeIndex < this.selectedNode.data.nodeData.attributes.length - 1) {
        const index = this.selectedAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.attributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedAttributeIndex++;
        isChanged = true;
      }
    }

    if(isChanged){
      this.updateNode('');
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  canvasZoomOut(){
    this.drawflow.zoom_out();
  }
  canvasZoomReset(){
    this.drawflow.zoom_reset()
  }
  canvasZoomIn(){
    this.drawflow.zoom_in();
  }
}
