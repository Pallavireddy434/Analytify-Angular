import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunburstChartComponent } from './sunburst-chart.component';

@NgModule({
  declarations: [SunburstChartComponent],
  imports: [
    CommonModule
  ],
  exports: [SunburstChartComponent]
})
export class SunburstChartModule { }
