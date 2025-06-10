import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SheetDataTransformerService {
  constructor() {}

  transformTableAndChartData(data: any): {
    xAxisCategories: string[],
    multiSeriesChartData: { name: string; data: number[] }[],
    combinedTableData: any[],
    columnNames: string[]
  } {
    const colArray = data?.col || [];
    const rowArray = data?.row || [];

    const xAxisCategories: string[] = [];
    const multiSeriesChartData: { name: string; data: number[] }[] = [];
    const combinedTableData: any[] = [];
    const columnNames: string[] = [
      ...colArray.map((col: { column: any }) => col.column),
      ...rowArray.map((row: { col: any }) => row.col)
    ];

    const rowCount = Math.max(
      colArray[0]?.result_data?.length || 0,
      rowArray[0]?.result_data?.length || 0
    );

    for (let i = 0; i < rowCount; i++) {
      const rowObj: any = {};
      colArray.forEach((col: { column: string; result_data: any[] }) => {
        rowObj[col.column] = col.result_data?.[i];
      });
      rowArray.forEach((row: { col: string; result_data: any[] }) => {
        rowObj[row.col] = row.result_data?.[i];
      });
      combinedTableData.push(rowObj);
    }

    if (colArray.length > 0) {
      xAxisCategories.push(...(colArray[0].result_data?.map((v: any) => v ?? 'null') || []));
    }

    multiSeriesChartData.push(
      ...rowArray.map((row: { col: any; result_data: any }) => ({
        name: row.col,
        data: row.result_data || []
      }))
    );

    return {
      xAxisCategories,
      multiSeriesChartData,
      combinedTableData,
      columnNames
    };
  }
  /**
   * Transform API response into hierarchical data for Sunburst chart.
   */
  transformSunburstData(data: any): any {
    const root: any = { name: 'root', children: [] };
    const cols = data?.col || [];
    const rows = data?.row || [];
    const count = cols[0]?.result_data?.length || 0;
    for (let i = 0; i < count; i++) {
      const parentName = cols[0].result_data[i] ?? 'null';
      const parent: any = { name: parentName, children: [] };
      for (const r of rows) {
        parent.children.push({ name: r.col, value: r.result_data?.[i] });
      }
      root.children.push(parent);
    }
    return root;
  }

  updateChartOptions(chartOptions: any, chartType: string, isApexChart: boolean,
    xAxisCategories: string[], multiSeriesChartData: { name: string; data: number[] }[]): any {

    // if (!chartOptions) chartOptions = {};

    // if (isApexChart) {
    //   if (['pie', 'donut', 'guage'].includes(chartType)) {
    //     chartOptions.series = multiSeriesChartData[0]?.data || [];
    //     chartOptions.labels = xAxisCategories;
    //   } else {
    //     chartOptions.series?.forEach((row: any, index: number) => {
    //       row.data = multiSeriesChartData[index]?.data || [];
    //     });
    //     chartOptions.xaxis = {
    //       ...chartOptions.xaxis,
    //       categories: xAxisCategories
    //     };
    //   }
    // } else {
    //   chartOptions.series?.forEach((row: any, index: number) => {
    //     row.data = multiSeriesChartData[index]?.data || [];
    //   });
    //   chartOptions.xAxis = {
    //     ...chartOptions.xAxis,
    //     data: xAxisCategories
    //   };
    // }


     if (!chartOptions) chartOptions = {};

  if (isApexChart) {
    if (['pie', 'donut', 'guage'].includes(chartType)) {
      chartOptions.series = multiSeriesChartData[0]?.data || [];
      chartOptions.labels = xAxisCategories;
    } else {
      chartOptions.series?.forEach((row: any, index: number) => {
        row.data = multiSeriesChartData[index]?.data || [];
      });
      chartOptions.xaxis = chartOptions.xaxis || {};
      chartOptions.xaxis.categories = xAxisCategories;
    }
  } else {
    if (!['radar', 'heatmap', 'calendar', 'map', 'pie', 'donut', 'funnel'].includes(chartType)) {
      chartOptions.series?.forEach((row: any, index: number) => {
        row.data = multiSeriesChartData[index]?.data || [];
      });
    }  else if(chartType === 'heatmap'){
      const heatmapData: any[][] = [];
     multiSeriesChartData.forEach((row, rowIndex: any) => {
        row.data.forEach((value, colIndex: any) => { // Assuming each row has a data array
          if (value !== null && value !== undefined) { // Ensure value is valid
            heatmapData.push([colIndex, rowIndex, value]); // [xIndex, yIndex, value]
          }
        });
      });

      chartOptions.series.forEach((row: any, index: any) => {
        row.data = heatmapData;
      });
    }

    if (chartType === 'barline') {
      chartOptions.xAxis?.forEach((column: any) => {
        column.data = xAxisCategories;
      });
    } else if (['hstocked', 'hgrouped'].includes(chartType)) {
      chartOptions.yAxis?.forEach((column: any) => {
        column.data = xAxisCategories;
      });
    } else if(['pie', 'donut', 'funnel'].includes(chartType)){
      let data:any[] = [];
      xAxisCategories.forEach((col:any, index:any)=>{
        data.push({value: multiSeriesChartData[0].data[index], name: col})
      });
      chartOptions.series[0].data = data;
    } else if(chartType === 'radar'){
      let radarArray = xAxisCategories.map((value: any, index: number) => ({
        name:xAxisCategories[index]
      }));
      const transformedArray = multiSeriesChartData.map((obj: any) => ({
        name: obj.name,
        value: obj.data
      }));
      chartOptions.radar.indicator = radarArray;
      // this.chartOptions.series[0].data = transformedArray;
      chartOptions.series[0].data.forEach((row: any, index: any) => {
        row.value = multiSeriesChartData[index].data;
      });
    } else if (chartType === 'calendar') {
      let calendarData: any[] = [];
      let years: Set<any> = new Set();

      if (multiSeriesChartData[0]?.data?.length > 0 || xAxisCategories?.length > 0) {
        multiSeriesChartData.forEach((series: any) => {
          series.data.forEach((value: any, index: number) => {
            const formattedDate = xAxisCategories[index]?.split(" ")[0];
            calendarData.push([formattedDate, value]);
            years.add(new Date(xAxisCategories[index]).getFullYear());
          });
        });

        const yearArray = Array.from(years).sort((a: any, b: any) => a - b);
        const series = yearArray.map((year: any, idx: number) => ({
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: idx,
          data: calendarData.filter(d => new Date(d[0]).getFullYear() === year)
        }));

        const calendarHeight = 120;
        const yearGap = 30;
        const calendars = yearArray.map((year: any, idx: number) => ({
          top: idx === 0 ? 25 : (calendarHeight + yearGap) * idx,
          range: year.toString(),
          cellSize: ['auto', 12],
          splitLine: {
            show: true,
            lineStyle: {
              color: '#000',
              width: 1
            }
          },
          yearLabel: {
            show: true,
            margin: 25,
            fontSize: 14,
            fontWeight: 'bold'
          }
        }));

        const allValues = multiSeriesChartData[0].data;
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        chartOptions.series = series;
        chartOptions.calendar = calendars;
        chartOptions.visualMap = {
          ...(chartOptions.visualMap || {}),
          min: minValue,
          max: maxValue
        };
      } else {
        chartOptions = {};
      }
    } else if (chartType === 'map') {
      const result: any[] = [];
      let minData = 0;
      const maxData = Math.max(...multiSeriesChartData[0].data);

      xAxisCategories.forEach((country: string, index: number) => {
        const countryData: any = {
          name: country,
          value: multiSeriesChartData[0].data[index]
        };
        multiSeriesChartData.forEach((measure: any) => {
          countryData[measure.name] = measure.data[index];
        });
        result.push(countryData);
      });

      if (multiSeriesChartData.length > 1) {
        minData = Math.min(...multiSeriesChartData[0].data);
      }

      chartOptions.tooltip = {
        formatter: (params: any) => {
          const { name, data } = params;
          if (data) {
            return Object.entries(data)
              .map(([key, val]) => `${key}: ${val}`)
              .join('<br/>');
          } else {
            return `${name}: No Data`;
          }
        },
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
      };

      chartOptions.visualMap = {
        ...(chartOptions.visualMap || {}),
        min: minData,
        max: maxData
      };

      chartOptions.series[0].data = result;
    } else {
      chartOptions.xAxis = {
        ...(chartOptions.xAxis || {}),
        data: xAxisCategories
      };
    }
  }
}
}
  /**
   * Transform API response data into hierarchical format for Sunburst chart.
   */
  // transformSunburstData(data: any): any {
  //   const root: any = { name: 'root', children: [] };
  //   const colArray = data?.col || [];
  //   const rowArray = data?.row || [];
  //   // Determine number of entries based on first column's result_data length
  //   const entryCount = colArray[0]?.result_data?.length || 0;
  //   for (let i = 0; i < entryCount; i++) {
  //     const parentName = colArray[0].result_data[i] ?? 'null';
  //     const parentNode: any = { name: parentName, children: [] };
  //     rowArray.forEach((row: { col: string; result_data: any[] }) => {
  //       const value = row.result_data?.[i];
  //       parentNode.children.push({ name: row.col, value: value });
  //     });
  //     root.children.push(parentNode);
  //   }
  //   return root;
  // }

  //   return { ...chartOptions }; // ensure immutability
  // }
// }
