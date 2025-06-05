import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkbenchService } from '../workbench/workbench.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';
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

  @Input() hierarchyIdInput?: string;
  @Input() tokenInput?: string;

  hierarchyId: string = '';
  token: string = '';
  erData: any;
  error: any;

  // Declare mermaidSvgCode as SafeHtml for binding
  mermaidSyntax: string = '';
  // Zoom/pan parameters
  minZoom: number = 1.0;
  maxZoom: number = 15.0;
  zoomStep: number = 1.0;

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
          // Render after view update
          setTimeout(() => this.renderMermaidDiagram(), 0);
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
    if (!this.mermaidSyntax || !this.mermaidContainer) {
      return;
    }
    const container: HTMLElement = this.mermaidContainer.nativeElement;
    // Clear existing content
    container.innerHTML = '';
    // Generate a unique ID for this diagram
    const graphId = 'erDiagram_' + Date.now();
    // Render Mermaid to SVG
    mermaid.render(graphId, this.mermaidSyntax)
      .then((result: { svg: string }) => {
        container.innerHTML = result.svg;
        // After inserting SVG, enable D3 zoom/pan
        const svgEl = container.querySelector('svg') as SVGSVGElement | null;
        if (svgEl) {
          const svgSelection = d3.select<SVGSVGElement, unknown>(svgEl);
          // Ensure viewBox is set
          if (!svgEl.hasAttribute('viewBox')) {
            const bbox = svgEl.getBBox();
            svgSelection.attr('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
          }
          // Remove fixed width/height to allow scaling
          svgSelection.attr('width', null).attr('height', null);
          // Apply zoom behavior
          const inner = svgSelection.select('g');
          svgSelection.call(
            d3.zoom<SVGSVGElement, unknown>()
              .scaleExtent([this.minZoom, this.maxZoom])
              // Capture wheel events to prevent container scroll
              .filter((event: any) => {
                if (event.type === 'wheel') {
                  event.preventDefault();
                }
                return true;
              })
              .on('zoom', (event) => {
                inner.attr('transform', event.transform);
              })
          );
          // Set initial cursor
          svgSelection.style('cursor', 'grab');
        }
      })
      .catch(err => {
        console.error('Error rendering Mermaid diagram:', err);
        this.error = { message: 'Failed to render ER diagram.', details: err };
      });
  }

  /**
   * Optional handler for manual zoom input (e.g., slider)
   */
}