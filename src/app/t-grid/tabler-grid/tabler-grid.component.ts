import { Component, Input, OnInit } from '@angular/core';
import { TablerIcon } from '../icons';

export interface FieldType {
  name: string;
  type: 'label' | 'input' | 'select' | 'checkbox';
  text: string;
}

@Component({
  selector: 'app-tabler-grid',
  templateUrl: './tabler-grid.component.html',
  styleUrls: ['./tabler-grid.component.css']
})
export class TablerGridComponent implements OnInit {

  @Input() dataSource: any[] = [];
  @Input() fieldType: FieldType[] | any[] = [];

  public dsIcon: any = TablerIcon;

  constructor() { }

  ngOnInit() {
  }

  onFilterTbody(field: any, data: any) {
    return data[field.name];
  }

  onClickTable(data: any) {
    console.log(data, '<<<');
  }

}