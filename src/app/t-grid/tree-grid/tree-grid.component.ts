import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Renderer2,
} from '@angular/core';
import { TablerIcon } from '../icons';

export interface fieldType {
  name: string;
  text: string;
  data?: any;
  url?: any;
  param?: any;
}

export type BackgroundType = 'flat' | 'normal';

@Component({
  selector: 'core-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.css'],
})
export class TreeGridComponent implements OnChanges {
  @Input() dataKey?: string;
  @Input() dataSource: any[] = [];
  @Input() fieldType: fieldType[] = [];
  @Input() backgroundType: BackgroundType = 'normal';

  public dsTable: any[] = [];
  public tableValue: { action: string }[] | any[] = [];
  public dsIcon: any = TablerIcon;
  public rowIdx: number = -1;

  constructor(private rd: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataKey'] == undefined) return;
    if (this.dataSource == null || this.dataSource.length == 0) {
      this.dataSource = [];
      this.dsTable = [];
      return;
    }

    let dsFilter: any[] = [];

    for (let ds of this.dataSource) {
      let dsObj = {};
      for (let ft of this.fieldType) {
        if (this.dataKey != undefined) {
          dsObj[this.dataKey] = ds[this.dataKey];
        }
        dsObj[ft.name] = ds[ft.name];
      }
      dsFilter.push(dsObj);
      continue;
    }
    this.dsTable = dsFilter;
  }

  onRowClick(evnTr: any, data: any, index: number) {}

  onTrackDs(index: number, obj: any) {
    return Object.values(obj).join('');
  }

  onFilterTbody(evnTr: any, data: any, fld: any) {
    return data[fld.name];
  }
}
