import { Component, Input, OnChanges, OnInit, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-sunburst-chart',
  templateUrl: './sunburst-chart.component.html',
  styleUrls: ['./sunburst-chart.component.scss']
})
export class SunburstChartComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() width: number = 600;
  @Input() height: number = 400;
  @Input() colorScheme: string = 'interpolateRainbow';
  @Input() showTooltips: boolean = true;
  @Input() showLabels: boolean = true;

  @ViewChild('sunburstContainer', { static: true }) private chartContainer!: ElementRef;

  private svg: any;
  private g: any; // Group element for the chart
  private radius: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let updateChart = false;
    let updateDimensions = false;

    if (changes['data'] && !changes['data'].firstChange && this.data) {
      updateChart = true;
    }

    if ((changes['width'] || changes['height']) && (!changes['width']?.firstChange || !changes['height']?.firstChange)) {
      updateDimensions = true;
    }

    if (changes['colorScheme'] && !changes['colorScheme'].firstChange) {
      updateChart = true;
    }
    if (changes['showTooltips'] && !changes['showTooltips'].firstChange) {
      updateChart = true;
    }
    if (changes['showLabels'] && !changes['showLabels'].firstChange) {
      updateChart = true;
    }

    if (updateDimensions) {
      this.updateDimensions(); // This will also call updateChart
    } else if (updateChart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove(); // Remove any existing SVG

    this.radius = Math.min(this.width, this.height) / 2;

    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.updateChart();
  }

  private updateDimensions(): void {
    if (!this.svg || !this.g) {
      if(this.data){ // If data is present, it means createChart was already called or should be
        this.createChart(); //Re-create if svg/g not found
      }
      return;
    }

    this.radius = Math.min(this.width, this.height) / 2;

    this.svg.attr('width', this.width).attr('height', this.height);
    this.g.attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.updateChart(); // Redraw chart with new dimensions
  }

  private updateChart(): void {
    if (!this.data || !this.g) {
       if(this.data && !this.g && this.svg) { // If svg is there but g is not, try to recreate g
         this.g = this.svg.append('g')
          .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
       } else if (!this.data) {
        this.g?.selectAll('*').remove(); // Clear chart if no data
        return;
       } else { // If no svg, no g, but data is present
        this.createChart(); // Attempt to create the chart
        return;
       }
    }

    this.g.selectAll('*').remove(); // Clear previous chart elements for redraw

    const partition = (data: any) => d3.partition()
      .size([2 * Math.PI, this.radius])
      (d3.hierarchy(data)
        .sum((d: any) => d.value) // Ensure value is taken from d.value
        .sort((a: any, b: any) => b.value - a.value));

    const root = partition(this.data);
    root.each((d: any) => d.current = d); // Store the initial state

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(this.radius / 2)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => Math.max(d.y0, d.y1 - 1));

    let colorScale: any;
    if (this.colorScheme.startsWith('interpolate')) {
      // @ts-ignore
      colorScale = d3.scaleOrdinal(d3.quantize(d3[this.colorScheme], (this.data.children || []).length + 1));
    } else if (this.colorScheme.startsWith('scheme')) {
      // @ts-ignore
      colorScale = d3.scaleOrdinal(d3[this.colorScheme]);
    } else {
      colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Default
    }

    const paths = this.g.selectAll('path')
      .data(root.descendants().slice(1))
      .join('path')
      .attr('fill', (d: any) => {
        let ancestor = d;
        while (ancestor.depth > 1) ancestor = ancestor.parent;
        return colorScale(ancestor.data.name);
      })
      .attr('fill-opacity', (d: any) => this.arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
      .attr('pointer-events', (d: any) => this.arcVisible(d.current) ? 'auto' : 'none')
      .attr('d', (d: any) => arc(d.current));

    if (this.showTooltips) {
      paths.append('title')
        .text((d: any) => `${d.ancestors().map((a: any) => a.data.name).reverse().join('/')}\nValue: ${d.value?.toLocaleString()}`);
    }

    // Remove existing labels before potentially re-adding them
    this.g.selectAll('.label-group').remove();

    if (this.showLabels) {
      const labelGroup = this.g.append('g')
        .attr('class', 'label-group') // Added class for easier selection/removal
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none');

      labelGroup.selectAll('text')
        .data(root.descendants().slice(1).filter((d: any) => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10 && this.arcVisible(d.current)))
        .join('text')
        .attr('transform', (d: any) => {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr('dy', '0.35em')
        .text((d: any) => d.data.name)
        .attr('fill-opacity', 0.7);
    }
  }

  private arcVisible(d: any): boolean {
    // Check if the arc is within the visible angular and radial range
    return d.y1 <= this.radius && d.y0 >= 0 && d.x1 > d.x0 && (d.x1 - d.x0) > 0.001; // Avoid rendering tiny arcs
  }
}
