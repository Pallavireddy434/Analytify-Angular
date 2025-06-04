import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkbenchService } from '../workbench/workbench.service';
import { CommonModule } from '@angular/common'; // For *ngIf, JsonPipe, etc.
import mermaid from 'mermaid';

@Component({
  selector: 'app-er-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './er-diagram.html',
  styleUrls: ['./er-diagram.scss']
})
export class ErDiagram implements OnInit, AfterViewInit {
  @ViewChild('mermaidContainer', { static: false }) mermaidContainer!: ElementRef;

  hierarchyId: string = '';
  token: string = '';
  erData: any;
  error: any;
  mermaidSyntax: string = '';

  constructor(
    private route: ActivatedRoute,
    private workbenchService: WorkbenchService
  ) {}

  ngOnInit(): void {
    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    this.route.params.subscribe(params => {
      this.hierarchyId = params['hierarchy_id'];
      this.token = params['token'];
      if (this.hierarchyId && this.token) {
        this.fetchErDiagramData();
      } else {
        const errorMsg = 'Missing hierarchy_id or token in route parameters.';
        this.error = { message: errorMsg, details: { currentParams: params } };
        console.error(errorMsg, 'Current params:', params);
      }
    });
  }

  ngAfterViewInit(): void {
    // No immediate rendering here; wait for data
  }

  fetchErDiagramData(): void {
    this.workbenchService.getErDiagramData(this.hierarchyId, this.token)
      .subscribe({
        next: (data) => {
          this.erData = data;
          this.mermaidSyntax = this.generateMermaidSyntax(this.erData);
          // Delay rendering to ensure view is ready
          setTimeout(() => {
            this.renderMermaidDiagram();
          }, 0);
        },
        error: (err) => {
          this.error = { message: 'Failed to fetch ER diagram data.', details: err };
          console.error(err);
        }
      });
  }

  private generateMermaidSyntax(data: any): string {
    if (!data || !data.tables) {
      console.warn('No tables data found.');
      return '';
    }

    const syntaxParts: string[] = ['erDiagram'];

    // Process Tables
    for (const table of data.tables) {
      const tableName = this.sanitizeName(table.name);
      syntaxParts.push(`    ${tableName} {`);
      if (table.columns) {
        for (const column of table.columns) {
          const columnName = this.sanitizeName(column.name);
          const columnType = this.sanitizeDataType(column.data_type);
          syntaxParts.push(`        ${columnType} ${columnName}`);
        }
      }
      syntaxParts.push(`    }`);
    }

    // Process Relationships
    if (data.relationships) {
      for (const rel of data.relationships) {
        const sourceTbl = this.sanitizeName(rel.source_table);
        const targetTbl = this.sanitizeName(rel.target_table);
        const sourceCol = this.sanitizeName(rel.source_column);
        const targetCol = this.sanitizeName(rel.target_column);

        // Mermaid ER syntax for FK relationship
        syntaxParts.push(`    ${sourceTbl} ||--o{ ${targetTbl} : "${sourceCol} to ${targetCol}"`);
      }
    }

    return syntaxParts.join('\n');
  }

  private sanitizeDataType(dataType: any): string {
    if (dataType === null || dataType === undefined) {
      console.warn('Column data_type is undefined or null. Defaulting to "unknown_type".');
      return 'unknown_type';
    }
    const match = String(dataType).match(/(?:Nullable\()?([a-zA-Z0-9_]+)\)?/);
    if (match && match[1]) {
      return match[1];
    }
    return String(dataType).replace(/[^a-zA-Z0-9_]/g, '_');
  }

  private sanitizeName(name: string): string {
    let sanitized = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    if (/^\d/.test(sanitized)) {
      sanitized = '_' + sanitized;
    }
    return sanitized || 'unnamed';
  }

  private renderMermaidDiagram(): void {
    if (!this.mermaidSyntax) {
      console.warn('Mermaid syntax is empty.');
      return;
    }

    if (!this.mermaidContainer || !this.mermaidContainer.nativeElement) {
      console.warn('Mermaid container element is not available.');
      return;
    }

    const container = this.mermaidContainer.nativeElement;
    // Clear previous diagram if any
    container.innerHTML = '';

    // Insert the new syntax
    container.innerHTML = this.mermaidSyntax;

    // Render the diagram
    try {
      mermaid.init(undefined, container);
      console.log('Mermaid diagram rendered.');
    } catch (err) {
      console.error('Error during mermaid.init:', err);
      this.error = {
        message: 'Failed to render ER diagram.',
        details: err
      };
    }
  }
}