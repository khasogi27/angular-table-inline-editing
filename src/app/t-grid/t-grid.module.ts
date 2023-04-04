import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveSvgPipe } from './save-svg.pipe';
import { GridComponent } from './grid/grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from './custom-date.service';
import { TreeGridComponent } from './tree-grid/tree-grid.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

const COMPONSNTS: any[] = [GridComponent, TreeGridComponent, TreeViewComponent];

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
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class TGridModule {}
