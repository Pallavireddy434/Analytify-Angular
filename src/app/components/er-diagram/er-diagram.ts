import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkbenchService } from '../workbench/workbench.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import mermaid from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-er-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './er-diagram.html',
  styleUrls: ['./er-diagram.scss']
})
export class ErDiagram implements OnInit, AfterViewInit {
  @ViewChild('mermaidContainer', { static: false }) mermaidContainer!: ElementRef;

  @Input() hierarchyIdInput?: string;
  @Input() tokenInput?: string;

  hierarchyId: string = '';
  token: string = '';
  erData: any;
  error: any;

  // Declare mermaidSvgCode as SafeHtml for binding
  mermaidSvgCode: SafeHtml = '';

  mermaidSyntax: string = '';

  zoomLevel: number = 2.0;
  minZoom: number = 0.1;
  maxZoom: number = 2.0;
  zoomStep: number = 0.1;

  constructor(
    private route: ActivatedRoute,
    private workbenchService: WorkbenchService,
    private sanitizer: DomSanitizer // Inject sanitizer
  ) {}

  ngOnInit(): void {
  mermaid.initialize({ startOnLoad: false, theme: 'default' });
  if (this.hierarchyIdInput && this.tokenInput) {
    this.hierarchyId = this.hierarchyIdInput;
    this.token = this.tokenInput;
    this.fetchErDiagramData();
    return;
  }
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
    // Optional: initialize svg-pan-zoom if needed
  }

  fetchErDiagramData(): void {
    this.workbenchService.getErDiagramData(this.hierarchyId, this.token)
      .subscribe({
        next: (data) => {
          this.erData = data;
          this.mermaidSyntax = this.generateMermaidSyntax(this.erData);
          
          // Convert the syntax to SVG (or HTML) and sanitize
          this.mermaidSvgCode = this.sanitizer.bypassSecurityTrustHtml(this.mermaidSyntax);
          
          // Delay rendering if necessary
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

    if (data.relationships) {
      for (const rel of data.relationships) {
        const sourceTbl = this.sanitizeName(rel.source_table);
        const targetTbl = this.sanitizeName(rel.target_table);
        const sourceCol = this.sanitizeName(rel.source_column);
        const targetCol = this.sanitizeName(rel.target_column);
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

  console.log('Generated Mermaid Syntax:', this.mermaidSyntax); // Log the syntax for debugging

  if (!this.mermaidContainer || !this.mermaidContainer.nativeElement) {
    console.warn('Mermaid container element is not available.');
    return;
  }

  const container = this.mermaidContainer.nativeElement;
  container.innerHTML = '';

  // Insert the SVG or HTML (already sanitized)
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

  onZoomChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.zoomLevel = parseFloat(input.value);
    this.applyZoom();
  }

  private applyZoom(): void {
    if (this.mermaidContainer && this.mermaidContainer.nativeElement) {
      const container = this.mermaidContainer.nativeElement;
      container.style.transform = `scale(${this.zoomLevel})`;
      container.style.transformOrigin = '0 0';
    }
  }
}