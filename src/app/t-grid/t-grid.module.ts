import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveSvgPipe } from './save-svg.pipe';
import { TGridComponent } from './t-grid/t-grid.component';
import { TbrGridComponent } from './tbr-grid/tbr-grid.component';
import { TablerGridComponent } from './tabler-grid/tabler-grid.component';
import { CustomGridComponent } from './custom-grid/custom-grid.component';
import { GridComponent } from './grid/grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

const COMPONSNTS: any[] = [
  TGridComponent,
  TbrGridComponent,
  TablerGridComponent,
  CustomGridComponent,
  GridComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbDropdownModule,
  NgbDatepickerModule,
  ReactiveFormsModule,
];

const PIPES: any[] = [SaveSvgPipe];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONSNTS, ...PIPES],
  exports: [...COMPONSNTS],
})
export class TGridModule {}
