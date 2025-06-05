import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgZone, ChangeDetectorRef, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { of, Subject } from 'rxjs';

import { SheetsComponent } from './sheets.component';
import { WorkbenchService } from '../../workbench/workbench.service';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { SharedService } from '../../../shared/services/shared.service';
import { DefaultColorPickerService } from '../../../services/default-color-picker.service';

// Import necessary modules for standalone component, or use NO_ERRORS_SCHEMA
import { SunburstChartModule } from '../../../workbench/charts/sunburst-chart/sunburst-chart.module';
import { SharedModule } from '../../../shared/sharedmodule'; // If SharedModule is used for pipes etc.

// Mocks for services
class MockWorkbenchService {
  getColumnsData = jasmine.createSpy('getColumnsData').and.returnValue(of([]));
  getDataExtraction = jasmine.createSpy('getDataExtraction').and.returnValue(of({
    rows: [], columns: [], custom_query: '', data: { col: [], row: [] }
  }));
  getSheetNames = jasmine.createSpy('getSheetNames').and.returnValue(of({ data: [] }));
  sheetSave = jasmine.createSpy('sheetSave').and.returnValue(of({ message: 'Saved', sheet_id: 123 }));
  sheetUpdate = jasmine.createSpy('sheetUpdate').and.returnValue(of({ message: 'Updated' }));
  sheetGet = jasmine.createSpy('sheetGet').and.returnValue(of({}));
  // Add other methods used by SheetsComponent as needed
}

class MockNgbModal {
  open = jasmine.createSpy('open').and.returnValue({ componentInstance: {}, result: Promise.resolve(true) });
}
class MockViewTemplateDrivenService {
    canDeleteSheetInSheetComponent = jasmine.createSpy('canDeleteSheetInSheetComponent').and.returnValue(true);
    editDashboard = jasmine.createSpy('editDashboard').and.returnValue(true);
    addDashboard = jasmine.createSpy('addDashboard').and.returnValue(true);
    addDatasource = jasmine.createSpy('addDatasource').and.returnValue(true);
}
class MockToastrService {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  info = jasmine.createSpy('info');
  warning = jasmine.createSpy('warning');
}
class MockLoaderService {
  show = jasmine.createSpy('show');
  hide = jasmine.createSpy('hide');
}
class MockSharedService {
    localStorageValue$ = of('apex'); // Mock observable
}
class MockDefaultColorPickerService {
    color$ = of('#FFFFFF'); // Mock observable
}


describe('SheetsComponent', () => {
  let component: SheetsComponent;
  let fixture: ComponentFixture<SheetsComponent>;
  let workbenchService: WorkbenchService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SheetsComponent, // Since it's standalone
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbDropdownModule,
        NgbTooltipModule,
        ToastrModule.forRoot(),
        SunburstChartModule, // Import if SunburstChartComponent is used in template directly
        SharedModule,
      ],
      providers: [
        { provide: WorkbenchService, useClass: MockWorkbenchService },
        { provide: NgbModal, useClass: MockNgbModal },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (val: string) => val } },
        { provide: ViewTemplateDrivenService, useClass: MockViewTemplateDrivenService },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: SharedService, useClass: MockSharedService },
        { provide: DefaultColorPickerService, useClass: MockDefaultColorPickerService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} }, // Mock snapshot
            params: of({}), // Mock observable params
            queryParams: of({}) // Mock observable queryParams
          }
        },
        // NgZone and ChangeDetectorRef are usually provided by Angular automatically.
      ],
      // schemas: [NO_ERRORS_SCHEMA] // Use if child components are not fully mocked/declared
    }).compileComponents();

    fixture = TestBed.createComponent(SheetsComponent);
    component = fixture.componentInstance;
    workbenchService = TestBed.inject(WorkbenchService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    // Mock localStorage
    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);

    // fixture.detectChanges(); // Initial ngOnInit call and change detection
  });

  it('should create', () => {
    // fixture.detectChanges(); // ngOnInit might rely on localStorage being mocked first
    expect(component).toBeTruthy();
  });

  describe('Sunburst Chart Selection', () => {
    it('should set sunburstChart true and other charts false when chartDisplay is called for sunburst', () => {
      component.chartDisplay(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, 30);
      expect(component.sunburstChart).toBeTrue();
      expect(component.chartId).toBe(30);
      expect(component.bar).toBeFalse();
      expect(component.pie).toBeFalse();
      // ... test other chart flags
    });

    it('should set sunburstChart true and other charts false when chartDisplaySunburst is called', () => {
      component.chartDisplaySunburst(true, 30);
      expect(component.sunburstChart).toBeTrue();
      expect(component.chartId).toBe(30);
      expect(component.bar).toBeFalse();
      expect(component.pie).toBeFalse();
      // ... test other chart flags
    });
  });

  describe('Data Transformation Call for Sunburst', () => {
    it('should call transformDataForSunburst when sunburstChart is true during dataExtraction', fakeAsync(() => {
      spyOn(component as any, 'transformDataForSunburst').and.callThrough();
      component.sunburstChart = true;
      component.draggedColumns = [{ column: 'Dim1', data_type: 'text' }]; // Mock prerequisites
      component.draggedRows = [{ column: 'Measure1', data_type: 'numeric' }];

      // Mock the response for getDataExtraction
      (workbenchService.getDataExtraction as jasmine.Spy).and.returnValue(of({
        data: { col: [{column: 'Dim1', result_data: ['A']}], row: [{col: 'Measure1', result_data: [10]}] },
        rows: [], columns: [], custom_query: ''
      }));

      component.dataExtraction(false);
      tick(); // Process observables

      expect((component as any).transformDataForSunburst).toHaveBeenCalled();
    }));

    it('should NOT call transformDataForSunburst when sunburstChart is false during dataExtraction', fakeAsync(() => {
        spyOn(component as any, 'transformDataForSunburst').and.callThrough();
        component.sunburstChart = false;
        component.draggedColumns = [{ column: 'Dim1', data_type: 'text' }];
        component.draggedRows = [{ column: 'Measure1', data_type: 'numeric' }];

        (workbenchService.getDataExtraction as jasmine.Spy).and.returnValue(of({
            data: { col: [{column: 'Dim1', result_data: ['A']}], row: [{col: 'Measure1', result_data: [10]}] },
            rows: [], columns: [], custom_query: ''
        }));

        component.dataExtraction(false);
        tick();

        expect((component as any).transformDataForSunburst).not.toHaveBeenCalled();
      }));
  });

  describe('Sunburst Customization Options', () => {
    it('should update component properties for sunburst customization', () => {
      component.sunburstChart = true;
      component.sunburstColorScheme = 'interpolateViridis';
      component.sunburstShowTooltips = false;
      component.sunburstShowLabels = false;

      expect(component.sunburstColorScheme).toBe('interpolateViridis');
      expect(component.sunburstShowTooltips).toBeFalse();
      expect(component.sunburstShowLabels).toBeFalse();
    });
  });

  describe('Save/Retrieve Sunburst Chart Settings', () => {
    beforeEach(() => {
      // Mock necessary properties for sheetSave/sheetRetrive if not already covered
      component.qrySetId = 1;
      component.databaseId = 1;
      component.sheetTitle = 'Test Sheet';
      component.sheetTagName = 'Test Sheet';
      component.filterId = [];
      component.dimetionMeasure = [];
      component.mulColData = [];
      component.mulRowData = [];
      component.pivotMeasureValues = [];
      component.sheetCustomQuery = '';
      component.draggedColumns = [];
      component.draggedColumnsData = [];
      component.draggedRows = [];
      component.draggedRowsData = [];
    });

    it('sheetSave should include sunburst options in customizeOptions when sunburstChart is active', () => {
      component.sunburstChart = true;
      component.chartId = 30;
      component.sunburstColorScheme = 'schemeCategory10';
      component.sunburstShowTooltips = false;
      component.sunburstShowLabels = true;

      component.sheetSave();

      const expectedCustomizeOptions = jasmine.objectContaining({
        sunburstColorScheme: 'schemeCategory10',
        sunburstShowTooltips: false,
        sunburstShowLabels: true
      });

      // Check if sheetSave or sheetUpdate was called and inspect its arguments
      const saveArgs = (workbenchService.sheetSave as jasmine.Spy).calls.mostRecent()?.args[0];
      const updateArgs = (workbenchService.sheetUpdate as jasmine.Spy).calls.mostRecent()?.args[0];

      if (saveArgs) { // New sheet
        expect(saveArgs.data.customizeOptions).toEqual(expectedCustomizeOptions);
      } else if (updateArgs) { // Existing sheet
        expect(updateArgs.data.customizeOptions).toEqual(expectedCustomizeOptions);
      } else {
        fail('Neither sheetSave nor sheetUpdate was called');
      }
    });

    it('sheetRetrive should load sunburst options from customizeOptions for sunburst chart', () => {
      const mockSheetResponse = {
        sheet_id: 300,
        chart_id: 30, // Sunburst chart ID
        sheet_name: 'Retrieved Sunburst Sheet',
        sheet_tag_name: 'Retrieved Sunburst Sheet',
        // ... other necessary sheet properties
        sheet_data: {
          columns: [], rows: [], columns_data: [], rows_data: [],
          // ... other sheet_data properties
          customizeOptions: {
            // ... other general customizeOptions ...
            sunburstColorScheme: 'interpolatePlasma',
            sunburstShowTooltips: false,
            sunburstShowLabels: false,
          }
        },
        col_data: [], row_data: [], // Mock these if chartsDataSet uses them
        filters_data: [],
      };
      (workbenchService.sheetGet as jasmine.Spy).and.returnValue(of(mockSheetResponse));

      component.retriveDataSheet_id = 300; // Set this so sheetRetrive processes the response
      component.sheetRetrive(false);

      expect(component.sunburstChart).toBeTrue();
      expect(component.sunburstColorScheme).toBe('interpolatePlasma');
      expect(component.sunburstShowTooltips).toBeFalse();
      expect(component.sunburstShowLabels).toBeFalse();
    });

    it('setCustomizeOptions should load sunburst options', () => {
        const customizeOpts = {
            sunburstColorScheme: 'interpolateWarm',
            sunburstShowTooltips: false,
            sunburstShowLabels: true,
            // ... other options
        };
        component.setCustomizeOptions(customizeOpts);
        expect(component.sunburstColorScheme).toBe('interpolateWarm');
        expect(component.sunburstShowTooltips).toBe(false);
        expect(component.sunburstShowLabels).toBe(true);
    });

    it('resetCustomizations should reset sunburst options to defaults', () => {
        component.sunburstColorScheme = 'testScheme';
        component.sunburstShowTooltips = false;
        component.sunburstShowLabels = false;

        component.resetCustomizations();

        expect(component.sunburstColorScheme).toBe('interpolateRainbow');
        expect(component.sunburstShowTooltips).toBe(true);
        expect(component.sunburstShowLabels).toBe(true);
    });

  });

});
