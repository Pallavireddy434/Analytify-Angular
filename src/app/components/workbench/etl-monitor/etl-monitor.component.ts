import { Component, ElementRef, NgModule, Renderer2, ViewChild, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { WorkbenchService } from '../workbench.service';
import { finalize } from 'rxjs/operators';

// Interface for sidebar task statuses (optional, but good practice)
interface SidebarTaskStatus {
  name: string;
  hasFailureInHistory?: boolean;
  statuses: Array<{ status: string; runId?: string }>;
}

interface Run {
  id: string;
  runId: string; // This could be the display ID, 'id' could be internal unique key
  state: 'Success' | 'Failed' | 'Running' | 'Queued' | 'Completed' | 'InProgress';
  runType: 'Manual' | 'Scheduled' | 'Backfill' | 'Asset Triggered' | 'Automatic';
  startDate: Date;
  endDate?: Date;
  duration: string;
}

interface Task {
  id: string;
  name: string;
  operator: string;
  triggerRule: string;
  lastRun?: Date;
  lastInstanceId?: string;
  status: 'success' | 'failed' | 'running' | 'skipped' | 'upstream_failed';
  miniChartData: Array<{ heightPercentage: number; status: string; runId?: string }>;
}

interface EventEntry {
  when: Date;
  runId: string;
  taskId?: string;
  event: string;
  mapIndex?: number;
  user?: string;
}

@Component({
  selector: 'app-etl-monitor',
  standalone: true,
  providers: [ { provide: NGX_ECHARTS_CONFIG, useFactory: () => ({ echarts: echarts }), },],
  imports: [NgbNavModule, CommonModule, NgbModule, FormsModule, NgxEchartsModule],
  templateUrl: './etl-monitor.component.html',
  styleUrl: './etl-monitor.component.scss'
})
export class EtlMonitorComponent {
  
  // --- Sidebar Data ---
  sidebarChartTitle: string = 'Overall Run Health (Last 10 Runs)';
  sidebarChartOptions: EChartsOption = {}; // Will be populated in ngOnInit
  tasksRunStatuses: SidebarTaskStatus[] = [];
  // numRunsSelect is a template reference variable, value accessed via template

  // --- Main Header Data ---
  schedule: string = 'Daily at 03:00 UTC';
  latestRunTimestamp: string = new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(); // Approx 2 hours ago
  latestRunId: string = 'manual__2025-05-22T15:56:42';
  nextRunTimestamp: string = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(); // Approx 24 hours from now

  // --- Tab Management ---
  activeTabId: number = 1;

  // --- Overview Tab Data ---
  selectedRangeLabel: string = 'Last 7 days';
  dateRangeDisplay: string = `${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
  mainChartTitle: string = 'DAG Run Performance (Last 7 days)';
  chartOptions: EChartsOption = {}; // Will be populated in ngOnInit

  // --- Runs Tab Data ---
  selectedStateFilter: string | null = null;
  selectedRunTypeFilter: string | null = null;
  sortColumnRun: string = 'startDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  runs: Run[] = [];
  filteredRuns: Run[] = []; // Initially a copy of runs

  // --- Tasks Tab Data ---
  tasks: Task[] = [];
  filteredTasks: Task[] = []; // Initially a copy of tasks

  // --- Resizable Sidebar Elements ---
  @ViewChild('resizeContainer') resizeContainer!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('divider') divider!: ElementRef;
  @ViewChild('main') main!: ElementRef;

  private isResizing = false;

  constructor() { }

  ngOnInit(): void {
    this.populateStaticData();
    this.filteredRuns = [...this.runs];
    this.filteredTasks = [...this.tasks];
  }

  ngAfterViewInit(): void {
    this.initResize();
  }

  populateStaticData(): void {
    // Sidebar Chart
    this.sidebarChartOptions = {
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom', data: ['Success', 'Failed', 'Running'] },
      series: [
        {
          name: 'Run Status',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: 7, name: 'Success', itemStyle: { color: '#28a745'} }, // green
            { value: 2, name: 'Failed', itemStyle: { color: '#dc3545'} },   // red
            { value: 1, name: 'Running', itemStyle: { color: '#17a2b8'} }  // blue/info
          ]
        }
      ]
    };

    // Sidebar Task Statuses
    this.tasksRunStatuses = [
      {
        name: 'SRC_date_dimensions',
        hasFailureInHistory: false,
        statuses: [
          { status: 'success', runId: 'run1' }, { status: 'success', runId: 'run2' },
          { status: 'success', runId: 'run3' }, { status: 'success', runId: 'run4' },
          { status: 'success', runId: 'run5' }
        ]
      },
      {
        name: 'SRC_dim_samples_load',
        hasFailureInHistory: true,
        statuses: [
          { status: 'success', runId: 'run1' }, { status: 'failed', runId: 'run2' },
          { status: 'success', runId: 'run3' }, { status: 'success', runId: 'run4' },
          { status: 'running', runId: 'run5' }
        ]
      },
      {
        name: 'Process_fact_table',
        statuses: [
          { status: 'success', runId: 'run1' }, { status: 'success', runId: 'run2' },
          { status: 'skipped', runId: 'run3' }, { status: 'success', runId: 'run4' },
          { status: 'success', runId: 'run5' }
        ]
      },
      {
        name: 'Final_aggregation_step_long_name',
        hasFailureInHistory: false,
        statuses: Array(5).fill(0).map((_, i) => ({ status: 'success', runId: `run${i+1}`}))
      }
    ];

    // Main Overview Chart
    this.chartOptions = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Duration (s)', 'Success', 'Failed'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5', 'Run 6', 'Run 7'] },
      yAxis: [{ type: 'value', name: 'Duration (s)' }, { type: 'value', name: 'Count' }],
      series: [
        { name: 'Duration (s)', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130], itemStyle: {color: '#0d6efd'} },
        { name: 'Success', type: 'line', yAxisIndex: 1, data: [5, 4, 5, 5, 3, 5, 4], itemStyle: {color: '#28a745'} },
        { name: 'Failed', type: 'line', yAxisIndex: 1, data: [0, 1, 0, 0, 2, 0, 1], itemStyle: {color: '#dc3545'} }
      ]
    };

    // Runs Data
    const now = new Date();
    this.runs = [
      { id: 'run101', runId: 'manual__2025-05-22T15:56:42', state: 'Success', runType: 'Manual', startDate: new Date(now.getTime() - 2 * 3600000), endDate: new Date(now.getTime() - 1.8 * 3600000), duration: '12m 5s' },
      { id: 'run102', runId: 'scheduled__2025-05-22T03:00:00', state: 'Failed', runType: 'Scheduled', startDate: new Date(now.getTime() - 26 * 3600000), endDate: new Date(now.getTime() - 25.5 * 3600000), duration: '30m 15s' },
      { id: 'run103', runId: 'backfill__2025-05-21T10:00:00', state: 'Success', runType: 'Backfill', startDate: new Date(now.getTime() - 50 * 3600000), endDate: new Date(now.getTime() - 49 * 3600000), duration: '1h 0m 0s' },
      { id: 'run104', runId: 'asset_triggered__2025-05-23T09:15:00', state: 'Running', runType: 'Asset Triggered', startDate: new Date(now.getTime() - 0.5 * 3600000), duration: '25m 10s' },
      { id: 'run105', runId: 'scheduled__2025-05-21T03:00:00', state: 'Success', runType: 'Scheduled', startDate: new Date(now.getTime() - 52 * 3600000), endDate: new Date(now.getTime() - 51.5 * 3600000), duration: '28m 0s' },
      { id: 'run106', runId: 'manual__2025-05-20T11:00:00', state: 'Queued', runType: 'Manual', startDate: new Date(now.getTime() - 72 * 3600000), duration: 'N/A' },
    ];

    // Tasks Data
    this.tasks = [
      {
        id: 'task_A', name: 'Extract_Source_Data_Orders', operator: 'PythonOperator', triggerRule: 'all_success',
        lastRun: new Date(now.getTime() - 2 * 3600000), lastInstanceId: 'run101_task_A', status: 'success',
        miniChartData: [{heightPercentage: 80, status:'success'}, {heightPercentage: 70, status:'success'}, {heightPercentage: 90, status:'success'}, {heightPercentage: 60, status:'failed', runId:'old_run_fail'}, {heightPercentage: 85, status:'success'}]
      },
      {
        id: 'task_B', name: 'Transform_Order_Details', operator: 'SparkSubmitOperator', triggerRule: 'all_success',
        lastRun: new Date(now.getTime() - 1.9 * 3600000), lastInstanceId: 'run101_task_B', status: 'failed',
        miniChartData: [{heightPercentage: 70, status:'success'}, {heightPercentage: 65, status:'failed'}, {heightPercentage: 0, status:'skipped'}, {heightPercentage: 80, status:'success'}, {heightPercentage: 75, status:'failed'}]
      },
      {
        id: 'task_C', name: 'Load_Fact_Orders', operator: 'PostgresOperator', triggerRule: 'all_done',
        lastRun: new Date(now.getTime() - 26 * 3600000), lastInstanceId: 'run102_task_C', status: 'upstream_failed',
        miniChartData: [{heightPercentage: 50, status:'upstream_failed'}, {heightPercentage: 70, status:'success'}, {heightPercentage: 60, status:'success'}, {heightPercentage: 0, status:'skipped'}, {heightPercentage: 70, status:'success'}]
      },
      {
        id: 'task_D', name: 'Generate_Report_Summary', operator: 'BashOperator', triggerRule: 'one_success',
        status: 'running',  lastRun: new Date(now.getTime() - 0.5 * 3600000), lastInstanceId: 'run104_task_D',
        miniChartData: [{heightPercentage: 90, status:'success'}, {heightPercentage: 80, status:'success'}, {heightPercentage: 85, status:'running'}, {heightPercentage: 70, status:'success'}, {heightPercentage: 75, status:'success'}]
      }
    ];
  }

  // --- STUBBED METHODS for UI Interaction (Implement these later) ---

  updateSidebarChartAndTasks(selectedValue: string): void {
    console.log('Number of runs for sidebar updated to:', selectedValue);
    this.sidebarChartTitle = `Overall Run Health (Last ${selectedValue} Runs)`;
    // TODO: In a real app, you would refetch/filter tasksRunStatuses and update sidebarChartOptions
  }

  navigateToTask(taskName: string, runId?: string): void {
    console.log('Navigate to task:', taskName, 'for run ID:', runId);
    this.activeTabId = 3; // Switch to Tasks tab
    // TODO: Implement actual navigation/filtering on Tasks tab
  }

  navigateToRun(runId: string | undefined): void {
    if (!runId) return;
    console.log('Navigate to run:', runId);
    this.activeTabId = 2; // Switch to Runs tab
    // TODO: Implement actual navigation/filtering on Runs tab
  }

  selectDateRange(rangeKey: string): void {
    console.log('Date range selected:', rangeKey);
    if (rangeKey === '24h') {
        this.selectedRangeLabel = 'Last 24 hours';
        this.dateRangeDisplay = `${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
    } else if (rangeKey === '7d') {
        this.selectedRangeLabel = 'Last 7 days';
        this.dateRangeDisplay = `${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
    } else if (rangeKey === '30d') {
        this.selectedRangeLabel = 'Last 30 days';
        this.dateRangeDisplay = `${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
    } else if (rangeKey === 'custom') {
        this.selectedRangeLabel = 'Custom Range';
        this.dateRangeDisplay = 'Select Dates...'; // Placeholder
        // TODO: Implement custom date picker logic
    }
    this.mainChartTitle = `DAG Run Performance (${this.selectedRangeLabel})`;
    // TODO: Refetch/recalculate main chartOptions data
  }

  filterRunsByState(state: string | null): void {
    console.log('Filter runs by state:', state);
    this.selectedStateFilter = state;
    this._applyRunFilters();
  }

  filterRunsByType(type: string | null): void {
    console.log('Filter runs by type:', type);
    this.selectedRunTypeFilter = type;
    this._applyRunFilters();
  }

  filterRunsById(runIdQuery: string): void {
    console.log('Filter runs by ID query:', runIdQuery);
    // This is a simple text filter, you might want more sophisticated logic
    const query = runIdQuery.toLowerCase();
    this.filteredRuns = this.runs.filter(run =>
        (run.runId.toLowerCase().includes(query)) &&
        (!this.selectedStateFilter || run.state === this.selectedStateFilter) &&
        (!this.selectedRunTypeFilter || run.runType === this.selectedRunTypeFilter)
    );
  }

  private _applyRunFilters(): void {
    this.filteredRuns = this.runs.filter(run =>
        (!this.selectedStateFilter || run.state === this.selectedStateFilter) &&
        (!this.selectedRunTypeFilter || run.runType === this.selectedRunTypeFilter)
    );
  }


  sort(column: string, type: any): void {
    console.log(`Sort by column: ${column} for type: ${type}`);
    const sortColumnProp = 'sortColumnRun';

    if (this[sortColumnProp] === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this[sortColumnProp] = column;
      this.sortDirection = 'asc';
    }

    // TODO: Implement actual sorting logic on filteredRuns or filteredEvents
    // For now, just logging. Actual sort would be like:
    // const dataToSort = type === 'run' ? this.filteredRuns : this.filteredEvents;
    // dataToSort.sort((a,b) => { ... comparison logic ... });
  }

  viewRunDetails(runId: string): void {
    console.log('View details for run ID:', runId);
    // Potentially open a modal or navigate to a more detailed run view
  }

  viewRunLogs(runId: string): void {
    console.log('View logs for run ID:', runId);
  }

  retryRun(runId: string): void {
    console.log('Retry run ID:', runId);
    // Add confirmation dialog
  }
  canRetryRun(run: Run): boolean {
    // Example logic: only allow retry for failed manual or scheduled runs
    return run.state === 'Failed' && (run.runType === 'Manual' || run.runType === 'Scheduled');
  }

  filterTasksByName(nameQuery: string): void {
    console.log('Filter tasks by name query:', nameQuery);
    const query = nameQuery.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => task.name.toLowerCase().includes(query));
  }

  viewTaskDetails(taskId: string): void {
    console.log('View details for task ID:', taskId);
  }
  viewTaskInstances(taskId: string): void {
    console.log('View instances for task ID:', taskId);
  }
  viewTaskLogs(instanceId: string | undefined): void {
    if(!instanceId) return;
    console.log('View logs for task instance ID:', instanceId);
  }
  viewTaskInstanceDetails(instanceId: string | undefined): void {
    if(!instanceId) return;
    console.log('View details for task instance ID:', instanceId);
  }

  // --- Resizable Sidebar Logic ---
  initResize(): void {
    if (!this.divider || !this.sidebar || !this.main || !this.resizeContainer) return;

    this.divider.nativeElement.addEventListener('mousedown', (event: MouseEvent) => {
      this.isResizing = true;
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      event.preventDefault(); // Prevent text selection
    });
  }

  onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;

    const containerRect = this.resizeContainer.nativeElement.getBoundingClientRect();
    let newSidebarWidth = event.clientX - containerRect.left;

    // Constraints
    const minSidebarWidth = 200; // px
    const maxSidebarWidth = containerRect.width * 0.5; // 50% of container

    if (newSidebarWidth < minSidebarWidth) newSidebarWidth = minSidebarWidth;
    if (newSidebarWidth > maxSidebarWidth) newSidebarWidth = maxSidebarWidth;

    this.sidebar.nativeElement.style.width = `${newSidebarWidth}px`;
    this.sidebar.nativeElement.style.flexBasis = `${newSidebarWidth}px`; // Important for flex items
    this.sidebar.nativeElement.style.maxWidth = `${newSidebarWidth}px`;

    // Adjust main content width (optional, flex should handle it)
    // this.main.nativeElement.style.width = `${containerRect.width - newSidebarWidth - this.divider.nativeElement.offsetWidth}px`;

  }

  onMouseUp = (): void => {
    if (!this.isResizing) return;
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

}
