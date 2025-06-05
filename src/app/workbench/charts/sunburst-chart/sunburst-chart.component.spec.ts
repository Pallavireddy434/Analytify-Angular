import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { SunburstChartComponent } from './sunburst-chart.component';
import * as d3 from 'd3';

// Mock data for testing
const MOCK_DATA = {
  name: 'root',
  children: [
    {
      name: 'CategoryA',
      children: [
        { name: 'SubA1', value: 100 },
        { name: 'SubA2', value: 200 },
      ],
    },
    {
      name: 'CategoryB',
      children: [
        { name: 'SubB1', value: 150 },
        { name: 'SubB2', value: 50 },
      ],
    },
  ],
};

describe('SunburstChartComponent', () => {
  let component: SunburstChartComponent;
  let fixture: ComponentFixture<SunburstChartComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunburstChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SunburstChartComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;

    // Initialize with some default data, width, and height
    component.data = MOCK_DATA;
    component.width = 600;
    component.height = 400;
    // fixture.detectChanges(); // Initial detection if ngOnInit should run
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChart on init', () => {
    spyOn(component as any, 'createChart').and.callThrough();
    component.ngOnInit();
    expect((component as any).createChart).toHaveBeenCalled();
  });

  describe('Input Changes', () => {
    it('should update chart when data input changes', () => {
      spyOn(component as any, 'updateChart').and.callThrough();
      component.data = { ...MOCK_DATA, name: 'newRoot' }; // Ensure new object reference
      component.ngOnChanges({
        data: new SimpleChange(MOCK_DATA, component.data, false),
      });
      fixture.detectChanges();
      expect((component as any).updateChart).toHaveBeenCalled();
    });

    it('should update dimensions when width input changes', () => {
      spyOn(component as any, 'updateDimensions').and.callThrough();
      component.width = 700;
      component.ngOnChanges({
        width: new SimpleChange(600, component.width, false),
      });
      fixture.detectChanges();
      expect((component as any).updateDimensions).toHaveBeenCalled();
    });

    it('should update dimensions when height input changes', () => {
      spyOn(component as any, 'updateDimensions').and.callThrough();
      component.height = 500;
      component.ngOnChanges({
        height: new SimpleChange(400, component.height, false),
      });
      fixture.detectChanges();
      expect((component as any).updateDimensions).toHaveBeenCalled();
    });
  });

  describe('SVG Rendering', () => {
    beforeEach(() => {
        component.data = MOCK_DATA;
        component.ngOnInit(); // Calls createChart
        fixture.detectChanges(); // Ensures the chart is rendered
      });

    it('should create an SVG element', () => {
      const svgElement = hostElement.querySelector('svg');
      expect(svgElement).toBeTruthy();
    });

    it('should render path elements for arcs when data is provided', () => {
      const pathElements = hostElement.querySelectorAll('svg g path');
      // Based on MOCK_DATA: root (not drawn) -> 2 categories -> 4 subcategories = 6 paths
      expect(pathElements.length).toBeGreaterThan(0); // Check if any paths are rendered
      // A more specific count would be MOCK_DATA.children.length + MOCK_DATA.children[0].children.length + MOCK_DATA.children[1].children.length
      const expectedPaths = MOCK_DATA.children.length + (MOCK_DATA.children[0].children?.length || 0) + (MOCK_DATA.children[1].children?.length || 0);
      expect(pathElements.length).toEqual(expectedPaths);
    });

    it('should clear chart if data is null or undefined', () => {
        component.data = null;
        component.ngOnChanges({
            data: new SimpleChange(MOCK_DATA, null, false)
        });
        fixture.detectChanges();
        const pathElements = hostElement.querySelectorAll('svg g path');
        expect(pathElements.length).toBe(0);
        const textElements = hostElement.querySelectorAll('svg g .label-group text');
        expect(textElements.length).toBe(0);
      });
  });

  describe('Responsiveness', () => {
    beforeEach(() => {
        component.data = MOCK_DATA;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should update SVG width and height attributes', () => {
      component.width = 800;
      component.height = 600;
      component.ngOnChanges({
        width: new SimpleChange(600, 800, false),
        height: new SimpleChange(400, 600, false),
      });
      fixture.detectChanges();

      const svgElement = hostElement.querySelector('svg');
      expect(svgElement?.getAttribute('width')).toBe('800');
      expect(svgElement?.getAttribute('height')).toBe('600');
    });
  });

  describe('Customization Inputs', () => {
    beforeEach(() => {
        component.data = MOCK_DATA;
        component.ngOnInit(); // createChart is called
        fixture.detectChanges();
    });

    it('should update chart when colorScheme changes', () => {
      spyOn(component as any, 'updateChart').and.callThrough();
      component.colorScheme = 'interpolateViridis';
      component.ngOnChanges({
        colorScheme: new SimpleChange('interpolateRainbow', component.colorScheme, false),
      });
      fixture.detectChanges();
      expect((component as any).updateChart).toHaveBeenCalled();
      // Further test: check if a D3 scale with Viridis is used (hard to check directly without deep D3 mocking)
      // For now, just ensure updateChart is called.
    });

    it('should show/hide tooltips based on showTooltips input', () => {
      // Case 1: showTooltips = true (default)
      component.showTooltips = true;
       component.ngOnChanges({
        showTooltips: new SimpleChange(false, component.showTooltips, false),
      });
      fixture.detectChanges();
      let titleElements = hostElement.querySelectorAll('svg g path title');
      expect(titleElements.length).toBeGreaterThan(0);

      // Case 2: showTooltips = false
      component.showTooltips = false;
      component.ngOnChanges({
        showTooltips: new SimpleChange(true, component.showTooltips, false),
      });
      fixture.detectChanges();
      titleElements = hostElement.querySelectorAll('svg g path title');
      expect(titleElements.length).toBe(0);
    });

    it('should show/hide labels based on showLabels input', () => {
      // Case 1: showLabels = true (default)
      component.showLabels = true;
      component.ngOnChanges({
        showLabels: new SimpleChange(false, component.showLabels, false),
      });
      fixture.detectChanges();
      let labelElements = hostElement.querySelectorAll('svg g .label-group text');
      expect(labelElements.length).toBeGreaterThan(0);

      // Case 2: showLabels = false
      component.showLabels = false;
       component.ngOnChanges({
        showLabels: new SimpleChange(true, component.showLabels, false),
      });
      fixture.detectChanges();
      labelElements = hostElement.querySelectorAll('svg g .label-group text');
      expect(labelElements.length).toBe(0);
    });
  });

});
