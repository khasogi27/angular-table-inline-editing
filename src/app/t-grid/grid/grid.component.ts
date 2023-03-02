import {
  Component,
  Input,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  HostListener,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { TablerIcon } from '../icons';

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

interface tableValue {
  action: string;
  data: any[];
}

@Component({
  selector: 'core-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  @ViewChild('trView') trView: ElementRef | any;
  @ViewChild('tbodyView') tbodyView: ElementRef | any;
  @ViewChild('trEditor') trEditor: ElementRef | any;
  @ViewChild('tbodyEditor') tbodyEditor: ElementRef | any;

  @Input() dataSource: any[] = [];
  @Input() fieldType: FieldType[] = [];

  private keyId!: string;
  public tableValue: { action: string; data: any[] }[] = [];
  public newData$: any = new Subject<tableValue>();
  public dsIcon: any = TablerIcon;
  public selectOption: SelectOption[] = [];
  public lookupOption: LookupOption[] = [];
  public dsDropdown: {
    name: string;
    node?: any;
    action: string;
    icon: string;
  }[] = [
    // { name: 'add before', action: 'add-up', icon: this.dsIcon.addBefore },
    // { name: 'add after', action: 'add-down', icon: this.dsIcon.addAfter },
    { name: 'add', action: 'add', icon: this.dsIcon.addBefore },
    { name: 'edit', action: 'edit', icon: this.dsIcon.edit },
    { name: 'delete', action: 'delete', icon: this.dsIcon.delete },
  ];
  public form: FormGroup;
  private createTr: HTMLTableRowElement = this.rd.createElement('tr');
  public rowIdx: number = -1;
  public showEditor: boolean = false;
  public statusAction!: string;

  constructor(private rd: Renderer2, private fb: FormBuilder) {}

  ngOnInit(): void {
    let dsFilter = [];
    let dsNewrow = {};
    if (this.dataSource == null || this.dataSource.length == 0) {
      for (let fld of this.fieldType) {
        dsNewrow[fld.name] = '';
        dsNewrow['isEdit'] = false;
      }
      if (this.dataSource == null) {
        this.dataSource = [];
      }
      this.dataSource.push(dsNewrow);
      this.form = this.fb.group(dsNewrow);
      return;
    }
    for (let item of this.dataSource) {
      let dsObj = {};
      for (let e of this.fieldType) {
        dsObj[e.name] = item[e.name];
        dsObj['isEdit'] = false;
      }
      dsFilter.push(dsObj);
      continue;
    }
    this.dataSource = dsFilter;

    this.lookupOption = this.onBuildOption('lookup');
    this.selectOption = this.onBuildOption('select');
    for (let fld of this.fieldType) {
      dsNewrow[fld.name] = new FormControl('');
    }
    this.form = this.fb.group(dsNewrow);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key == 'Enter') this.onNavClick('save');
    if (event.key == 'Escape') this.onNavClick('cancel');
  }

  onFilterTbody(evnTd: any, field: any, data: any) {
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
    if (field.type == 'input' || field.type == 'lookup') {
      return data[field.name];
    }
  }

  onFilterIcon() {
    return this.dsIcon.moreVert;
  }

  onClickLookup(e: any, fld: any) {
    let obj = { ...this.form.value };
    obj[fld] = e.name;
    this.form.patchValue(obj);
  }

  onDropdownClick(evnTr: any, action: string, data: any) {
    if (this.showEditor) return;
    this.onNavClick(action, { tr: evnTr });
  }

  onKeyup(e: any, dsFld: any) {
    let evnKeyup = e.target.value;
    if (evnKeyup == '') {
      for (let lk of this.lookupOption) {
        if (lk.name == dsFld.name) {
          dsFld.data = lk.data;
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

  private onFilterLookup(srch: string, fld: any) {
    for (let lk of this.lookupOption) {
      if (lk.name == fld.name) {
        return lk.data.filter((f) => {
          return f.name.toLowerCase().indexOf(srch) > -1;
        });
      }
    }
  }

  private onNavClick(action: string, event?: { tr?: any; td?: any }) {
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
      this.statusAction = action;
    } else if (action == 'edit') {
      this.form.reset();
      this.showEditor = true;
      this.rowIdx = event.tr.rowIndex;
      const dataVal = this.dataSource[this.rowIdx - 1];
      this.form.patchValue(dataVal);
      this.rd.insertBefore(
        this.tbodyView.nativeElement,
        this.trEditor.nativeElement,
        event.tr
      );
      this.rd.removeChild(this.tbodyView.nativeElement, event.tr);
      this.statusAction = action;
    } else if (action == 'save') {
      this.showEditor = false;
      let formVal = this.form.value;
      formVal['isEdit'] = false;
      this.newData$.next({ action: this.statusAction, data: formVal });
      if (this.statusAction == 'add') {
        this.dataSource.push(formVal);
      } else {
        this.dataSource[this.rowIdx - 1] = formVal;
      }
      this.rd.appendChild(
        this.tbodyEditor.nativeElement,
        this.trEditor.nativeElement
      );
      this.tableValue.push({ action: this.statusAction, data: formVal });
      this.statusAction = action;
    } else if (action == 'delete') {
      this.rowIdx = event.tr.rowIndex;
      const dataVal = this.dataSource[this.rowIdx - 1];
      this.dataSource.find((ds, idx) => {
        ds == dataVal ? this.dataSource.splice(idx, 1) : '';
      });
      this.tableValue.push({ action: action, data: dataVal });
    } else if (action == 'cancel') {
      this.showEditor = false;
      if (this.rowIdx > 1) {
        let dataVal = this.dataSource[this.rowIdx - 1];
        dataVal['isEdit'] = !dataVal['isEdit'];
      }
      this.rd.appendChild(
        this.tbodyEditor.nativeElement,
        this.trEditor.nativeElement
      );
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
}
