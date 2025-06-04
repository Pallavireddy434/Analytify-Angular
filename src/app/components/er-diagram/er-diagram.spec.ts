import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkbenchService } from '../workbench/workbench.service';
import { CommonModule } from '@angular/common'; // For *ngIf, JsonPipe, etc.
import mermaid from 'mermaid';

@Component({
  selector: 'app-er-diagram',
  standalone: true, // Ensure this is still here if it was intended
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './er-diagram.html',
  styleUrl: './er-diagram.scss'
})
export class ErDiagram implements OnInit, AfterViewInit {
  @ViewChild('mermaidContainer') mermaidContainer!: ElementRef;

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
    if (this.mermaidSyntax && this.mermaidContainer) {
      this.renderMermaidDiagram();
    }
  }

  fetchErDiagramData(): void {
    this.workbenchService.getErDiagramData(this.hierarchyId, this.token)
      .subscribe({
        next: (data) => {
          this.erData = data;
          console.log('ER Diagram data fetched:', this.erData);
          mermaid.initialize({ startOnLoad: true, theme: 'default' }); // Initialize Mermaid
          this.mermaidSyntax = this.generateMermaidSyntax(this.erData);
          if (this.mermaidContainer) { // Check if view is initialized
            this.renderMermaidDiagram();
          }
        },
        error: (err) => {
          const errorMsg = 'Failed to fetch ER diagram data.';
          this.error = { message: errorMsg, details: err };
          console.error(errorMsg, err);
        }
      });
  }

  private renderMermaidDiagram(): void {
    if (this.mermaidSyntax && this.mermaidContainer && this.mermaidContainer.nativeElement) {
      try {
        this.mermaidContainer.nativeElement.innerHTML = this.mermaidSyntax; // Insert the syntax string
        // Ensure that the container is visible and in the DOM before calling mermaid.run
        // Angular's *ngIf might remove/add the element, ngAfterViewInit and checks help
        if (this.mermaidContainer.nativeElement.offsetParent !== null) {
             mermaid.run({ nodes: [this.mermaidContainer.nativeElement] });
             console.log('Mermaid diagram rendered.');
        } else {
            console.warn('Mermaid container not visible in DOM, skipping render.');
            // Optionally, you could try to defer this or set a flag to retry
        }
      } catch (renderError) {
        console.error('Error rendering Mermaid diagram:', renderError);
        this.error = {
          message: 'Failed to render ER diagram. Please check the diagram syntax if available.',
          details: {
            error: renderError,
            syntax: this.mermaidSyntax // Provide syntax for debugging
          }
        };
      }
    } else {
      console.warn('Mermaid syntax or container not available for rendering.');
      if (!this.mermaidSyntax) {
        this.error = { message: 'Cannot render diagram: Mermaid syntax is empty.'};
      }
    }
  }

  private sanitizeDataType(type: string): string {
    if (type === null || typeof type === 'undefined') {
      return 'unknown_type'; // Default for undefined types
    }
    // Ensure it's a string before calling replace, in case something non-stringy gets through
    return String(type).replace(/[^a-zA-Z0-9_]/g, '_');
  }

  private sanitizeName(name: string): string {
    if (name === null || typeof name === 'undefined' || String(name).trim() === '') {
      return 'unnamed_element'; // Default for undefined, null, or empty names
    }
    // Ensure it's a string before further processing
    let sanitized = String(name).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    // Prepend underscore if starts with a digit
    if (sanitized.match(/^\d/)) {
      sanitized = '_' + sanitized;
    }
    // Ensure not empty after sanitization (e.g. if name was only special chars)
    return sanitized || 'unnamed_element';
  }

  private generateMermaidSyntax(data: any): string {
    if (!data || !data.tables) {
      console.warn('No tables data found to generate Mermaid syntax.');
      return '';
    }

    const syntaxParts = ['erDiagram'];

    // Process Tables
    for (const table of data.tables) {
      const tableName = this.sanitizeName(table.name);
      syntaxParts.push(`    ${tableName} {`);
      if (table.columns) {
        for (const column of table.columns) {
          const columnName = this.sanitizeName(column.name);
          const columnType = this.sanitizeDataType(column.type);
          syntaxParts.push(`        ${columnType} ${columnName}`);
        }
      }
      syntaxParts.push(`    }`);
    }

    // Process Relationships
    if (data.relationships) {
      for (const relationship of data.relationships) {
        const sourceTable = this.sanitizeName(relationship.source_table);
        const targetTable = this.sanitizeName(relationship.target_table);
        const sourceColumn = this.sanitizeName(relationship.source_column);
        const targetColumn = this.sanitizeName(relationship.target_column);
        // Defaulting to a simple relationship label, can be customized
        const label = `${sourceColumn} to ${targetColumn}`;
        syntaxParts.push(`    ${sourceTable} ||--o{ ${targetTable} : "${label}"`);
      }
    }
    return syntaxParts.join('\n');
  }
}
