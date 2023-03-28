import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  ViewChild,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, take } from 'rxjs';
import { TablerIcon } from '../icons';

export const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export interface SelectOption {
  name: string;
  data: {
    name: string;
    value: string;
  }[];
}

export interface LookupOption {
  name: string;
  data: {
    name: string;
    value: string;
  }[];
}

export interface FieldType {
  name: string;
  type: 'label' | 'input' | 'select' | 'checkbox' | 'lookup' | 'date';
  text: string;
  data?: any;
  url?: any;
  param?: any;
}

export type BackgroundType = 'flat' | 'normal';

@Component({
  selector: 'core-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnChanges {
  @ViewChild('trView') trView: ElementRef | any;
  @ViewChild('tbodyView') tbodyView: ElementRef | any;
  @ViewChild('trEditor') trEditor: ElementRef | any;
  @ViewChild('tbodyEditor') tbodyEditor: ElementRef | any;

  @Input() dataKey?: string;
  @Input() dataSource: any[] = [];
  @Input() fieldType: FieldType[] = [];
  @Input() backgroundType?: BackgroundType = 'normal';

  public dsTable: any[] = [];
  public tableValue: { action: string }[] | any[] = [];
  public newData$: any = new Subject<any>();
  public dsIcon: any = TablerIcon;
  public selectOption: SelectOption[] = [];
  public lookupOption: LookupOption[] = [];
  public dsDropdown: {
    name: string;
    node?: any;
    action: string;
    icon: string;
    isActive: boolean;
  }[] = [
    { name: 'add', action: 'add', icon: this.dsIcon.addBefore, isActive: true },
    { name: 'edit', action: 'edit', icon: this.dsIcon.edit, isActive: true },
    {
      name: 'delete',
      action: 'delete',
      icon: this.dsIcon.delete,
      isActive: true,
    },
  ];
  public form: FormGroup;
  public rowIdx: number = -1;
  public showEditor: boolean = false;
  public statusAction!: string;

  constructor(
    private rd: Renderer2,
    private fb: FormBuilder,
    private dateAdapter: NgbDateAdapter<string>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataKey'] == undefined) this.updateRow(true);
    if (this.dataSource == null || this.dataSource.length == 0) {
      this.updateRow();
      return;
    }

    let dsFilter: any[] = [];
    let dsNewrow: any = {};

    for (let item of this.dataSource) {
      let dsObj = {};
      for (let e of this.fieldType) {
        if (this.dataKey != undefined) {
          dsObj[this.dataKey] = item[this.dataKey];
        }
        dsObj[e.name] = item[e.name];
        dsObj['isEdit'] = false;
      }
      dsFilter.push(dsObj);
      continue;
    }
    this.dsTable = dsFilter;

    this.lookupOption = this.onBuildOption('lookup');
    this.selectOption = this.onBuildOption('select');
    for (let fld of this.fieldType) {
      if (fld.type == 'checkbox') {
        dsNewrow[fld.name] = new FormControl('true');
        dsNewrow[fld.name].defaultValue = false;
      } else {
        dsNewrow[fld.name] = new FormControl('');
      }
    }
    this.form = this.fb.group(dsNewrow);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.showEditor = false;
      let formVal = this.form.value;
      let formKey = {};
      formVal['isEdit'] = false;
      let isAddTable = true;
      if (this.statusAction == 'add') {
        if (this.dataKey != undefined) {
          formKey[this.dataKey] = this.uniqueId();
          formVal = { ...formKey, ...formVal };
        }
        this.dsTable.splice(this.rowIdx, 0, formVal);
      } else {
        formKey[this.dataKey] = this.dsTable[this.rowIdx - 1][this.dataKey];
        formVal = { ...formKey, ...formVal };
        for (let i = 0; i < this.dsTable.length; i++) {
          if (this.dsTable[i][this.dataKey] == formVal[this.dataKey]) {
            this.dsTable[i] = formVal;
          }
        }
        for (let x = 0; x < this.tableValue.length; x++) {
          if (this.tableValue[x][this.dataKey] == formVal[this.dataKey]) {
            const action = this.tableValue[x]['action'];
            this.tableValue[x] = { action, ...formVal };
            isAddTable = false;
            break;
          }
        }
      }
      if (isAddTable) {
        this.tableValue.push({ action: this.statusAction, ...formVal });
      }
      this.rd.appendChild(
        this.tbodyEditor.nativeElement,
        this.trEditor.nativeElement
      );
      if (this.dsTable[0][this.dataKey] == undefined) {
        this.updateRow(true);
        this.dsTable.splice(0, 1);
      }
      return;
    }

    if (event.key == 'Escape') {
      this.showEditor = false;
      if (this.dsTable[this.rowIdx - 1] == undefined) return;
      let dataVal = this.dsTable[this.rowIdx - 1];
      dataVal['isEdit'] = !dataVal['isEdit'];
      this.rd.appendChild(
        this.tbodyEditor.nativeElement,
        this.trEditor.nativeElement
      );
      return;
    }
  }

  onFilterTbody(evnTd: any, field: any, data: any) {
    if (field.type == 'date') {
      this.dateAdapter.toModel(data[field.name]);
      return data[field.name];
    }
    if (field.type == 'select') {
      for (let opt of this.selectOption) {
        for (let op of opt.data) {
          if (op.value == data[field.name]) {
            return op.name;
          }
        }
      }
    }
    if (field.type == 'lookup') {
      for (let opt of this.lookupOption) {
        for (let op of opt.data) {
          if (op.value == data[field.name]) {
            return op.name;
          }
        }
      }
    }
    if (field.type == 'checkbox') {
      let setIcon: string;
      if (data[field.name] == true || data[field.name] == 'true') {
        setIcon = this.dsIcon.checkbox;
      } else {
        setIcon = this.dsIcon.uncheckbox;
      }
      this.rd.addClass(evnTd, 'w-1');
      return this.rd.setProperty(evnTd, 'innerHTML', setIcon);
    }
    if (
      field.type == 'label' ||
      field.type == 'input' ||
      field.type == 'lookup'
    ) {
      return data[field.name];
    }
  }

  onClickLookup(e: any, fld: any) {
    let obj = { ...this.form.value };
    obj[fld] = e.name;
    this.form.patchValue(obj);
  }

  onKeyupLookup(e: any, dsFld: any) {
    let evnKeyup = e.target.value;
    if (evnKeyup == '') {
      for (let lk of this.lookupOption) {
        if (lk.name == dsFld.name) {
          dsFld.data = lk.data;
          break;
        }
      }
    }
    if (evnKeyup.length < 3) return;
    evnKeyup = evnKeyup.toLowerCase();
    dsFld.data = this.onFilterLookup(evnKeyup, dsFld);
  }

  onTrackDs(index: number, obj: any) {
    return Object.values(obj).join('');
  }

  onDropdownClick(evnTr: any, action: string) {
    if (this.showEditor) return;
    this.onNavClick(action, { tr: evnTr });
  }

  private onNavClick(action: string, event?: { tr?: any; td?: any }) {
    this.rowIdx = event.tr.rowIndex;
    const formVal = this.dsTable[this.rowIdx - 1];

    if (action == 'add') {
      this.form.reset();
      this.showEditor = true;
      let nextSibling = this.rd.nextSibling(event.tr);
      if (nextSibling.rowIndex == undefined) {
        this.rd.appendChild(
          this.tbodyView.nativeElement,
          this.trEditor.nativeElement
        );
      } else {
        this.rd.insertBefore(
          this.tbodyView.nativeElement,
          this.trEditor.nativeElement,
          nextSibling
        );
      }
      this.inputAutoFocus();
      this.statusAction = action;
    } else if (action == 'edit') {
      this.form.reset();
      this.showEditor = true;
      this.form.patchValue(formVal);
      this.rd.insertBefore(
        this.tbodyView.nativeElement,
        this.trEditor.nativeElement,
        event.tr
      );
      this.inputAutoFocus();
      this.rd.removeChild(this.tbodyView.nativeElement, event.tr);
      this.statusAction = action;
    } else if (action == 'delete') {
      let isDeleteTable = true;
      let isCheckTv = false;
      let idx = 0;
      for (let tv of this.tableValue) {
        if (this.tableValue.length == 0) break;
        if (formVal[this.dataKey] != tv[this.dataKey]) {
          idx++;
          continue;
        }
        isCheckTv = true;
        isDeleteTable = false;
        if (!isDeleteTable) {
          for (let ds of this.dataSource) {
            if (formVal[this.dataKey] == ds[this.dataKey]) {
              isDeleteTable = true;
              isCheckTv = true;
              this.dsTable.splice(this.rowIdx - 1, 1);
              tv['action'] = action;
              tv = { ...formVal };
              break;
            }
          }
        }
        if (!isDeleteTable) {
          this.dsTable.splice(this.rowIdx - 1, 1);
          this.tableValue.splice(idx, 1);
          break;
        }
      }
      if (isDeleteTable && !isCheckTv) {
        this.dsTable.splice(this.rowIdx - 1, 1);
      }
      if (!isCheckTv) {
        this.tableValue.push({ action, ...formVal });
      }
      if (this.dsTable.length == 0) this.updateRow();
    }
  }

  private onBuildOption(fldType: string) {
    let arrOpt = [];
    for (let fld of this.fieldType) {
      if (fld.type == fldType) {
        arrOpt.push({ name: fld.name, data: fld['data'] });
      }
    }
    return arrOpt;
  }

  private onFilterLookup(srch: string, fld: any) {
    for (let lk of this.lookupOption) {
      if (lk.name == fld.name) {
        return lk.data.filter((f) => {
          return f.name.toLowerCase().indexOf(srch) > -1;
        });
      }
    }
  }

  private uniqueId() {
    return Math.floor(
      Math.random() * Math.floor(Math.random() * Date.now())
    ).toString(16);
  }

  private inputAutoFocus(idx = 0) {
    interval(0)
      .pipe(take(1))
      .subscribe((v) => {
        this.trEditor.nativeElement.children[1].children[idx].focus();
      });
  }

  private updateRow(allActive?: boolean) {
    for (let dd of this.dsDropdown) {
      if (allActive) {
        dd.isActive = true;
        continue;
      }
      if (dd.action == 'add') continue;
      dd.isActive = false;
    }
    if (allActive) return;

    let dsNewrow: any = {};
    for (let fld of this.fieldType) {
      dsNewrow[fld.name] = '';
      dsNewrow['isEdit'] = false;
    }

    if (this.dataSource == null) {
      this.dataSource = [];
      this.dsTable = [];
    }

    this.dsTable.push(dsNewrow);
    this.form = this.fb.group(dsNewrow);
    return dsNewrow;
  }
}
