import { Component } from '@angular/core';
import { NgbDropdown, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import Drawflow from 'drawflow';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EtlLoggerViewComponent } from '../etl-logger-view/etl-logger-view.component';
import { DataFlowSearchFilterPipe } from '../../../shared/pipes/data-flow-search-filter.pipe';
import { ResizableTopDirective } from '../../../shared/directives/resizable-top.directive';

@Component({
  selector: 'app-etl-job-flow',
  standalone: true,
  imports: [NgbModule, CommonModule, NgSelectModule, FormsModule, EtlLoggerViewComponent, DataFlowSearchFilterPipe, ResizableTopDirective],
  templateUrl: './etl-job-flow.component.html',
  styleUrl: './etl-job-flow.component.scss'
})
export class EtlJobFlowComponent {
  drawflow: any;
  nodeToAdd: string = '';
  isOpen: boolean = true;
  active = 1;
  isNodeSelected: boolean = false;
  selectedNode: any;
  modal: any;
  dataFlowOptions: any[] = [];
  selectedDataFlow: any = null;
  dataObjectOptions: [] = [];
  posX: any;
  posY: any;
  tableTabId: number = 1;
  tableTypeTabId: number = 1;
  nodeTypeCounts: { [key: string]: number } = {};
  etlName: string = '';
  jobFlowId!: string;
  nodeName: string = '';
  isRunEnable: boolean = false;
  objectType: string = 'select';
  jobFlowStatus: any[] = [];
  runId: string = '';
  nodeLogs: any[] = [];
  pollingInterval: any;
  currentNodeColumns: any[] = [];
  logs: any = '';
  isLogShow: boolean = false;
  selectedGroupAttrs: any[] = [];
  groupAttributesList: any[] = [];
  allChecked: boolean = false;
  isSourceClicked: boolean = false;
  isRefrshEnable: boolean = false;
  jobFlowRunStatus: string = '';
  expression: string = '';
  selectedField: any = {};
  groupedColumns: any = {};
  selectedGroup: any = '';
  selectedColumn: any = {};
  selectedIndex: number = -1;
  isCanvasSelected: boolean = false;
  canvasData: any = { parameters: [], sqlParameters: [] };
  isParameter: boolean = false;
  isSQLParameter: boolean = false;
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
  dataPointOptions: any[] = [];
  selectedDataPoint: any = null;
  isDataPointChange: boolean = false;
  srcConnections: any[] = [];
  transformations: any[] = [];
  isTaskCommand: boolean = false;
  isDbCommand: boolean = false;
  isLoopCommand: boolean = false;
  isTo: boolean = false;
  isCC: boolean = false;
  isSubject: boolean = false;
  isMessage: boolean = false;
  returnTypes: string[] = ['varchar', 'char', 'byteint', 'bigint', 'smallint', 'integer', 'numeric', 'boolean', 'date', 'time with time zone',
    'interval', 'time', 'timestamp', 'decimal', 'real', 'double', 'float', 'nvarchar', 'nchar', 'array[string]', 'array[int]', 'param', 'string', 'datetime'
  ];
  dataTypes: string[] = [
    // Numeric types
    'smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'double precision', 'serial', 'bigserial', 'money',

    // Character types
    'char', 'character', 'varchar', 'character varying', 'text',
  
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
    private loaderService: LoaderService, private router: Router, private route: ActivatedRoute) {

    if (this.router.url.startsWith('/analytify/etlList/jobFlow')) {
      if (route.snapshot.params['id1']) {
        const id = +atob(route.snapshot.params['id1']);
        this.jobFlowId = id.toString();
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

      if (this.jobFlowId) {
        this.getJobFlow();
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
          this.tableTabId = 8;
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
        }

      });
      this.drawflow.on('connectionSelected', (connection: any) => {
      });

      this.drawflow.on('connectionRemoved', (connection: any) => {
        const { output_id, input_id } = connection;

        const sourceNode = this.drawflow.getNodeFromId(output_id);
        const targetNode = this.drawflow.getNodeFromId(input_id);

        if (targetNode.data.type === 'Joiner') {
          const nodeNamesDropdown = targetNode.data.nodeData.properties.nodeNamesDropdown;
          const sourceNodeName = sourceNode.data.nodeData.general.name;

          const index = nodeNamesDropdown.findIndex((item: any) => item.label === sourceNodeName);
          if (index !== -1) {
            const sourceNodeValue = nodeNamesDropdown[index].value;
            nodeNamesDropdown.splice(index, 1);

            const joinList = targetNode.data.nodeData.properties.joinList;
            const joinIndex = joinList.findIndex((join: any) => join.sourceNodeId === sourceNodeValue);
            if (joinIndex !== -1) {
              joinList.splice(joinIndex, 1);
            }

            if (targetNode.data.nodeData.properties.primaryObject?.value === sourceNodeValue) {
              targetNode.data.nodeData.properties.primaryObject = null;
            }

            if (nodeNamesDropdown.length <= 1) {
              targetNode.data.nodeData.properties.joinList = [];
            }
            this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
          }
        }
        if (this.selectedNode.hasOwnProperty('data')) {
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

    if (targetNode.data.type === 'Joiner') {
      targetNode.data.nodeData.properties.nodeNamesDropdown.push({ label: sourceNode.data.nodeData.general.name, value: sourceNode.id });
      if (targetNode.data.nodeData.properties.nodeNamesDropdown.length > 1) {
        targetNode.data.nodeData.properties.joinList.push({ joinType: '', secondaryObject: null, joinCondition: '', sourceNodeId: sourceNode.id, joinObject: null });
      }
      this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
    }

    console.log('Output Node ID:', output_id);
    console.log('Input Node ID:', input_id);
    console.log('Source Node:', sourceNode);
    console.log('Target Node:', targetNode);
  }

  joinListUpdate(event: any, index: any) {
    this.selectedNode.data.nodeData.properties.joinList[index].secondaryObject = event.label;
    this.selectedNode.data.nodeData.properties.joinList[index].sourceNodeId = event.value;
    this.updateNode('properties');
  }


  onDragStart(event: DragEvent, nodeType: string, modal: any) {
    this.nodeToAdd = nodeType;
    this.modal = modal;
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

    if (['dataFlow'].includes(this.nodeToAdd)) {
      this.modalService.open(this.modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
      this.getDataFlowList();
    } else if(this.nodeToAdd === 'dbCommand') {
      this.modalService.open(this.modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
      this.getDataPointList();
    } else {
      this.addNode(this.nodeToAdd, this.posX, this.posY);
    }
  }

  addNode(name: string, posX: number, posY: number) {
    // bump per‑type counter
    const count = (this.nodeTypeCounts[name] = (this.nodeTypeCounts[name] || 0) + 1);

    // the common shape of nodeData.nodeData
    const defaults = {
      dataFlow: {},
      general: { name: '' },
      properties: {
        successCodes: '0, 99', retryEnable: false, 
        type: 'sql', command: '', returnType: 'varchar', delimiter: '', iterationMode: 'sequential', failZeroRowsReturn: false, looperStartJob: '',
        to: '', cc: '', subject: '', attachment: '', message: ''
      },
      command: {
        commandType: 'external', commandDesc: '', timeOut: 0, sleepInterval: 0,
        runDBCommandFile: false, continueExecutionFailure: false, dbCommand: '', dbCommandOutputFile: '$$SrcFileDir'
      },
      dataPoints: {dataPoint: this.selectedDataPoint?.display_name ?? '', dataPointSchema: '', selectedDataPoint: this.selectedDataPoint},
      connections: [] as any[],
      transformations: [] as any[],
      dataFlowParameters: {}
    };

    /** per‑type config for icon/alt text, port counts, initial name, etc. */
    interface NodeConfig {
      iconPath: string;
      altText: string;
      inputCount: number;
      outputCount: number;
      name: string;
      extraNodeData?: Partial<typeof defaults>;
    }

    const configs: Record<string, NodeConfig> = {
      dataFlow: {
        iconPath: this.selectedDataFlow?.type === 'POSTGRESQL'
          ? './assets/images/etl/PostgreSQL-etl.svg'
          : './assets/images/etl/PostgreSQL-etl.svg',
        altText: this.selectedDataFlow?.type === 'POSTGRESQL'
          ? 'PostgreSQL'
          : '',
        inputCount: 1,
        outputCount: 1,
        name: this.selectedDataFlow?.data_flow_name,
        extraNodeData: {
          dataFlow: this.selectedDataFlow,
          connections: this.srcConnections,
          transformations: this.transformations
        },
      },
      taskCommand: {
        iconPath: './assets/images/etl/task_command-etl.svg', altText: 'Task Command', inputCount: 1, outputCount: 1, name:
          `Task_Command_Name_${count}`
      },
      dbCommand: {
        iconPath: './assets/images/etl/db_command-etl.svg', altText: 'DB Command', inputCount: 1, outputCount: 1, name:
          `DB_Command_Name_${count}`
      },
      emailNotification: {
        iconPath: './assets/images/etl/email-etl.svg', altText: 'Email', inputCount: 1, outputCount: 1, name:
          `Email_Name_${count}`
      },
      loop: {
        iconPath: './assets/images/etl/loop_start-etl.svg', altText: 'Loop', inputCount: 1, outputCount: 1, name:
          `Loop_Name_${count}`
      },
    };

    const config = configs[name];
    if (!config) {
      return;
    }

    const buildAndAdd = (nodeType: string, nodeName: string, x: number, iconPath: string, altText: string, extraData: Partial<typeof defaults> = {} ): number => {
      const nodeData = {
        type: nodeType,
        nodeData: { ...defaults, general: { name: nodeName }, ...extraData }
      };
      if(nodeName.includes('Loop_End_Name_')){
        if(nodeData?.nodeData?.properties?.looperStartJob){
          nodeData.nodeData.properties.looperStartJob = nodeName;
        }
      }
      let label = nodeName;
      if (label.length > 8) {
        label = label.substring(0, 8) + '..';
      }
      const container = document.createElement('div');
      container.innerHTML = `<div><img src=\"${iconPath}\" class=\"node-icon\" alt=\"${altText}\" /><div class=\"node-label\"
        title=\"${nodeName}\">${label}</div><div class=\"node-status\" style=\"display:none;\"></div></div>`;
      return this.drawflow.addNode(nodeType, config.inputCount, config.outputCount, x, posY, nodeType, nodeData, container.innerHTML);
    };

    // add the primary node
    let nodeId = buildAndAdd(name, config.name, posX, config.iconPath, config.altText, config.extraNodeData || {});

    // special ‑ for loop we also add a Loop_End node offset in X
    if (name === 'loop') {
      nodeId = buildAndAdd('loop_end', `Loop_End_Name_${count}`, posX + 300, './assets/images/etl/loop_end-etl.svg', 'Loop End');
    }

    // === unchanged post‑add housekeeping ===
    this.selectedDataFlow = null;
    this.selectedDataPoint = null;
    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
    Object.entries(allNodes).forEach(([id, node]) =>
      console.log('Node ID:', id, 'Node Data:', node)
    );
  }

  updateNode(type: any) {
    let data = {};
    let nodeId = '';
    if (type !== 'parameter') {
      nodeId = this.selectedNode.id;
    }
    if (type === 'general') {
      const general = { name: this.nodeName }
      nodeId = this.selectedNode.id;
      data = {
        ...this.selectedNode.data,
        nodeData: {
          ...this.selectedNode.data.nodeData,
          general: general
        }
      };

      let displayName = this.nodeName;
      if (displayName.length > 8) {
        displayName = displayName.substring(0, 8) + '..';
      }
      this.selectedNode.data.nodeData.general.name = this.nodeName;
      const nodeElement = document.querySelector(`#node-${nodeId}`);
      if (nodeElement) {
        const labelElement = nodeElement.querySelector('.node-label') as HTMLElement;
        if (labelElement) {
          labelElement.innerText = displayName;
          labelElement.setAttribute('title', this.nodeName);
        }
      }
    } else if (type === 'parameter') {
      const module = this.drawflow.module || 'Home';
      this.drawflow.drawflow.drawflow[module].canvasData = this.canvasData;
    } else {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    }
    if (type !== 'parameter') {
      this.drawflow.updateNodeDataFromId(nodeId, data);
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
    if(this.selectedNode.data.type === 'loop_end'){
      this.tableTabId = 2;
    }
    if (this.isRefrshEnable && !['success', 'failed'].includes(this.jobFlowRunStatus)) {
      this.tableTypeTabId = 2;
      this.getJobFlowLogs(this.nodeName);
    }
  }

  getDataFlowList() {
    this.workbechService.getEtlDataFlowList(1, 100, '','dataflow').subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowOptions = data.data;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }

  getDataPointList(){
    this.workbechService.getConnectionsForEtl('POSTGRESQL').subscribe({
      next: (data) => {
        console.log(data);
        this.dataPointOptions = data.data;
      },
      error: (error: any) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }

  saveOrUpdateEtlJobFlow(): void {
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

    const etlFlow = {
      dag_id: this.etlName,
      tasks,
      flow: flows,
      flow_type: 'jobflow'
    };
    console.log(etlFlow);

    const jsonString = JSON.stringify(exportedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'etl-drawflow.json', { type: 'application/json' });
    const flow_type = 'jobflow';

    const formData = new FormData();
    formData.append('transformation_flow', file);
    formData.append('ETL_flow', JSON.stringify(etlFlow));
    formData.append('flow_type', flow_type);

    if(this.jobFlowId){
      formData.append('id', this.jobFlowId);
      this.workbechService.updateEtl(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isRunEnable = true;
          this.jobFlowId = data.dataflow_id;
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
          this.jobFlowId = data.dataflow_id;
          const encodedId = btoa(this.jobFlowId.toString());
          this.router.navigate(['/analytify/etlList/jobFlow/'+encodedId]);
          this.toasterService.success('JobFlow Saved Successfully', 'success', { positionClass: 'toast-top-right' });
        },
        error: (error: any) => {
          this.isRunEnable = false;
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          console.log(error);
        }
      });
    }
  }

  runJobFlow() {
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
        this.getJobFlowStatus(data.run_id);
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
  getJobFlowStatus(runId: any) {
    let object = {
      dag_id: this.etlName,
      run_id: runId
    }
    this.workbechService.disableLoaderForNextRequest();
    this.workbechService.getDataFlowStatus(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.jobFlowStatus = data.tasks;
        this.jobFlowRunStatus = data.status;

        Object.entries(this.drawflow.drawflow.drawflow[this.drawflow.module].data).forEach(([id, node]) => {
          const node1 = this.drawflow.getNodeFromId(id);
          const nodeName = node1.data.nodeData.general.name;

          // Find matching task status from dataFlowStatus
          const matchedTask = this.jobFlowStatus.find(task => task.task === nodeName);

          if (matchedTask) {
            let status = matchedTask.state;
            if (node1) {
              const nodeElement = document.querySelector(`#node-${id}`);
              if (nodeElement) {
                const statusDiv = nodeElement.querySelector('.node-status') as HTMLElement;
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
        if (!['success', 'failed'].includes(data.status)) {
          setTimeout(() => {
            this.getJobFlowStatus(runId);
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
  getJobFlowLogs(taskId: any) {
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

    if (nodes[nodeId].data.type === 'taskCommand') {
      task.command_type = nodes[nodeId].data.nodeData.command.commandType;
      task.commands = nodes[nodeId].data.nodeData.command.commandDesc;
      task.time_out = nodes[nodeId].data.nodeData.command.timeOut;
      task.sleep_interval = nodes[nodeId].data.nodeData.command.sleepInterval;
    } else if(nodes[nodeId].data.type === 'dbCommand'){
      task.queries = nodes[nodeId].data.nodeData.command.dbCommand;
      task.hierarchy_id = nodes[nodeId].data.nodeData.dataPoints.selectedDataPoint.hierarchy_id;
    } else if(nodes[nodeId].data.type === 'loop'){
      
    } else if(nodes[nodeId].data.type === 'emailNotification'){
      
    } else if(nodes[nodeId].data.type === 'dataFlow'){
      task.trigger_dag = nodes[nodeId].data.nodeData.dataFlow.data_flow_name;
    }


    const inputConnections = nodes[nodeId].inputs?.input_1?.connections || [];
    if (inputConnections.length > 0) {
      const prevTaskIds = inputConnections.map((conn: any) => nodes[conn.node].data.nodeData.general.name);
      task.previous_task_id = prevTaskIds;
    }

    return task;
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
    grouped.forEach((group: any) => {
      group.isChecked = group.attributes.every((attr: any) => attr.isChecked);
    });

    this.groupAttributesList = grouped;

    if (modal !== null) {
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

  openExpressionEdit(modal: any, attribute: any, index: any) {
    if (index !== null || index !== undefined) {
      this.selectedIndex = index;
    }
    let dataObject: any[] = [];
    if (attribute.paramName) {
      dataObject = [''].map((col: any) => ({
        label: '',
        value: '',
        dataType: '',
        group: 'Project Parameters'
      }));
    } else {
      const nodeData = JSON.parse(JSON.stringify(this.selectedNode.data.nodeData));
      dataObject = nodeData.dataObject || [];
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

    if (attribute.hasOwnProperty('paramName')) {
      this.selectedField = attribute;
      this.selectedColumn = '';
      if (attribute.hasOwnProperty('sql')) {
        this.isSQLParameter = true;
        this.expression = attribute.sql;
      } else {
        this.isParameter = true;
        this.expression = attribute.default;
      }
      this.isTaskCommand = false;
      this.isDbCommand = false;
      this.isLoopCommand = false;
      this.isTo = false;
      this.isCC = false;
      this.isSubject = false;
      this.isMessage = false;
    } else {
      this.isParameter = false;
      this.isSQLParameter = false;
      this.selectedField = attribute;
      this.selectedColumn = '';
      if(attribute === 'command') {
        this.isTaskCommand = true;
        this.isDbCommand = false;
        this.isLoopCommand = false;
        this.isTo = false;
        this.isCC = false;
        this.isSubject = false;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.command.commandDesc;
      } else if(attribute === 'dbCommand') {
        this.isTaskCommand = false;
        this.isDbCommand = true;
        this.isLoopCommand = false;
        this.isTo = false;
        this.isCC = false;
        this.isSubject = false;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.command.dbCommand;
      } else if(attribute === 'loopCommand') {
        this.isTaskCommand = false;
        this.isDbCommand = false;
        this.isLoopCommand = true;
        this.isTo = false;
        this.isCC = false;
        this.isSubject = false;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.properties.command;
      } else if(attribute === 'to') {
        this.isTaskCommand = false;
        this.isDbCommand = false;
        this.isLoopCommand = false;
        this.isTo = true;
        this.isCC = false;
        this.isSubject = false;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.properties.to;
      } else if(attribute === 'cc') {
        this.isTaskCommand = false;
        this.isDbCommand = false;
        this.isLoopCommand = false;
        this.isTo = false;
        this.isCC = true;
        this.isSubject = false;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.properties.cc;
      } else if(attribute === 'subject') {
        this.isTaskCommand = false;
        this.isDbCommand = false;
        this.isLoopCommand = false;
        this.isTo = false;
        this.isCC = false;
        this.isSubject = true;
        this.isMessage = false;
        this.expression = this.selectedNode.data.nodeData.properties.subject;
      } else if(attribute === 'message') {
        this.isTaskCommand = false;
        this.isDbCommand = false;
        this.isLoopCommand = false;
        this.isTo = false;
        this.isCC = false;
        this.isSubject = false;
        this.isMessage = true;
        this.expression = this.selectedNode.data.nodeData.properties.message;
      } 
    }
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
      modalDialogClass: 'modal-lg modal-dialog-scrollable'
    });
  }

  updateExpressionToNode() {
    if (this.isParameter) {
      this.canvasData.parameters[this.selectedIndex].default = this.expression;
    } else if (this.isSQLParameter) {
      this.canvasData.sqlParameters[this.selectedIndex].sql = this.expression;
    } else if( this.isTaskCommand) {
      this.selectedNode.data.nodeData.command.commandDesc = this.expression;
    } else if(this.isDbCommand) {
      this.selectedNode.data.nodeData.command.dbCommand = this.expression;
    } else if(this.isLoopCommand) { 
      this.selectedNode.data.nodeData.properties.command = this.expression;
    } else if(this.isTo) {
      this.selectedNode.data.nodeData.properties.to = this.expression;
    } else if(this.isCC) {
      this.selectedNode.data.nodeData.properties.cc = this.expression;
    } else if(this.isSubject) {
      this.selectedNode.data.nodeData.properties.subject = this.expression;
    }  else if(this.isMessage) {
      this.selectedNode.data.nodeData.properties.message = this.expression;
    }

    if (!this.isParameter && !this.isSQLParameter) {
      this.updateNode('');
    } else {
      this.updateNode('parameter');
    }
    this.expression = '';
    this.selectedGroup = '';
    this.selectedColumn = {};
    this.selectedIndex = -1;
    this.isTaskCommand = false;
    this.isDbCommand = false;
    this.isLoopCommand = false;
    this.isTo = false;
    this.isCC = false;
    this.isSubject = false;
    this.isMessage = false;
    this.isParameter = false;
    this.isSQLParameter = false;
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

  getJobFlow() {
    this.workbechService.getEtlDataFlow(this.jobFlowId, 'jobflow').subscribe({
      next: (data) => {
        console.log(data);
        this.etlName = data.dag_id;
        this.jobFlowId = data.id;
        const drawFlowJson = JSON.parse(data.transformation_flow);
        this.drawflow.import(drawFlowJson);
        console.log(drawFlowJson);
        this.isRunEnable = true;
        this.canvasData = drawFlowJson.drawflow.Home.canvasData ? drawFlowJson.drawflow.Home.canvasData : { parameters: [], sqlParameters: [] };
        console.log(this.canvasData);
        this.isNodeSelected = true;
        this.isCanvasSelected = true;
        this.tableTabId = 8;

        setTimeout(() => {
          const allNodes = this.drawflow.drawflow.drawflow['Home'].data;
          Object.entries(allNodes).forEach(([id, node]: [string, any]) => {
            const type = node.data?.type;
            if (type && type !== 'dataFlow') {
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

  addNewParameter() {
    const existingIndexes = this.canvasData?.parameters
      .map((p: any) => {
        const match = p.paramName?.match(/PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index: any) => index !== null)
      .sort((a: any, b: any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = { paramName: `PARAM_NAME_${newIndex}`, dataType: 'varchar', default: '' }
    this.canvasData?.parameters.push(parameter);
  }
  deleteParameter(index: any) {
    this.canvasData.parameters.splice(index, 1);
    this.updateNode('parameter');
  }

  addNewSQLParameter() {
    const existingIndexes = this.canvasData?.sqlParameters
      .map((p: any) => {
        const match = p.paramName?.match(/SQL_PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index: any) => index !== null)
      .sort((a: any, b: any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = { paramName: `SQL_PARAM_NAME_${newIndex}`, dataType: 'varchar', sql: '', default: 'null' }
    this.canvasData?.sqlParameters.push(parameter);
  }
  deleteSQLParameter(index: any) {
    this.canvasData.sqlParameters.splice(index, 1);
    this.updateNode('parameter');
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  canvasZoomOut() {
    this.drawflow.zoom_out();
  }
  canvasZoomReset() {
    this.drawflow.zoom_reset()
  }
  canvasZoomIn() {
    this.drawflow.zoom_in();
  }

  changeDataPointPopup(modal:any){
    this.modalService.open(this.modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
    this.selectedDataPoint = this.selectedNode.data.nodeData.dataPoints.selectedDataPoint
    this.getDataPointList();
  }

  updateDataPointToNode(){
    this.selectedNode.data.nodeData.dataPoints.selectedDataPoint = this.selectedDataPoint;
    this.selectedNode.data.nodeData.dataPoints.dataPoint = this.selectedDataPoint?.display_name;
    this.updateNode('');
  }

  getDataFlow(id: any) {
    this.workbechService.getEtlDataFlow(id, 'dataflow').subscribe({
      next: (data) => {
        console.log(data);
        const drawFlowJson = JSON.parse(data.transformation_flow);
        console.log(drawFlowJson);
        const allNodes = Object.values(drawFlowJson.drawflow.Home.data);
        this.srcConnections = allNodes.filter((node: any) => node.data.type === 'source_data_object' || node.data.type === 'target_data_object');
        this.transformations = allNodes.filter((node: any) => node.data.type !== 'source_data_object' && node.data.type !== 'target_data_object');
      },
      error: (error: any) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }
}
