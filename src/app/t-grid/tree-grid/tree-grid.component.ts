import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TablerIcon } from '../icons';

export interface FieldType {
  name: string;
  text: string;
  type: 'label' | 'select';
  data?: any;
  url?: any;
  param?: any;
}

export interface SelectOption {
  name: string;
  data: {
    name: string;
    value: string;
  }[];
}

export type BackgroundType = 'flat' | 'normal';

@Component({
  selector: 'core-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.css'],
})
export class TreeGridComponent implements OnChanges {
  @ViewChild('tbodyView') tbodyView: ElementRef | any;

  @Input() dataKey?: string;
  @Input() dataSource: any[] = [];
  @Input() fieldType: FieldType[] = [];
  @Input() backgroundType: BackgroundType = 'normal';

  public dsTable: any[] = [];
  public tableValue: { action: string }[] | any[] = [];
  public dsIcon: any = TablerIcon;
  public selectOption: SelectOption[] = [];
  public rowIdx: number = -1;
  public rowNode: number = 0;
  public countNode: number = 0;

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
      if (ds['children']) dsObj['children'] = ds['children'];
      dsFilter.push(dsObj);
      continue;
    }
    this.dsTable = dsFilter;

    let arrOpt = [];
    for (let fld of this.fieldType) {
      if (fld.type == 'select') {
        arrOpt.push({ name: fld.name, data: fld['data'] });
      }
    }
    this.selectOption = arrOpt;
  }

  onRowClick(evnTr: any, data: any, index: number) {
    this.rowIdx = index;
    let nextSibling = this.rd.nextSibling(evnTr);
    let crtTr = this.rd.createElement('tr');

    crtTr.addEventListener('click', (e) => {
      nextSibling = this.rd.nextSibling(crtTr);
      this.onRowClick(crtTr, data, index);
    });

    let crtIcon = this.rd.createElement('td');
    crtIcon.innerHTML = this.dsIcon.chevronRight;
    this.rd.appendChild(crtTr, crtIcon);
    this.rowNode++;
    this.findChildren(crtTr, nextSibling, data);
    this.findCountChld(data);
  }

  private findCountChld(data: any) {
    if (data.children != null) {
      for (let i = 0; i < data.children.length; i++) {
        this.countNode++;
        this.findCountChld(data.children[i]);
      }
    }
  }

  private findChildren(crtTr: any, nextSibling: any, data: any, node = 1) {
    if (data.children != null) {
      for (let i = 0; i < data.children.length; i++) {
        if (node == this.rowNode) {
          let result = data.children[i];
          let crtTd = this.rd.createElement('td');
          let treeSpace = this.rowNode * 2 + 'rem';
          this.rd.setStyle(crtTd, 'padding-left', treeSpace);
          for (let rs in result) {
            if (Array.isArray(result[rs])) break;
            crtTd.innerHTML = result[rs];
            this.rd.appendChild(crtTr, crtTd);
            crtTd = this.rd.createElement('td');
          }
          this.rd.insertBefore(
            this.tbodyView.nativeElement,
            crtTr,
            nextSibling
          );
          return;
        }
        this.findChildren(crtTr, nextSibling, data.children[i], this.rowNode);
      }
    }
  }

  onTrackDs(index: number, obj: any) {
    return Object.values(obj).join('');
  }

  onFilterTbody(evnTr: any, data: any, fld: any) {
    if (fld.type == 'select') {
      for (let opt of this.selectOption) {
        for (let op of opt.data) {
          if (op.value == data[fld.name]) {
            return op.name;
          }
        }
      }
    }
    if (fld.type == 'label') {
      return data[fld.name];
    }
  }
}
