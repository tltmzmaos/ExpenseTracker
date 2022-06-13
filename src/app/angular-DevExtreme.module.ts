import { NgModule } from "@angular/core";

import { DxPieChartModule, DxSelectBoxModule, DxChartModule } from 'devextreme-angular';

@NgModule({
  exports: [
    DxPieChartModule,
    DxSelectBoxModule,
    DxChartModule
  ]
})
export class AngularDevExtremeModule {}
