import {
  Component,
  Renderer2,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { DsIcons, TablerIcon } from '../icons';

const Icons = {
  checkbox: `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
        <path d="M9 12l2 2l4 -4"></path>
      </svg>
    `,
  uncheckbox: `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
      </svg>
    `,
};

interface FieldElem {
  id: number | string;
  name: string;
  elem: HTMLInputElement | HTMLSelectElement | any;
}

export interface FieldType {
  name: string;
  type: 'label' | 'input' | 'select' | 'checkbox';
  text: string;
  data?: any;
  url?: any;
  param?: any;
}

export interface ActionEventArgs {
  requestType: string;
  data: any[] | any;
  newData: any;
}

export interface EditSettingItems {
  allowEditing: boolean;
  allowAdding: boolean;
  allowDeleting: boolean;
}

export interface SelectOption {
  name: string;
  value: string;
}

export type ToolbarItems = 'Add' | 'Save' | 'Edit' | 'Delete' | 'Cancel';
export type TableType = 'border' | 'none';

@Component({
  selector: 'tbr-grid',
  templateUrl: './tbr-grid.component.html',
  styleUrls: ['./tbr-grid.component.css'],
})
export class TbrGridComponent implements OnInit {
  @ViewChild('table') table: ElementRef | any;
  @Input() dataSource: any[] = [];
  @Input() selectOption: any[] = [];
  @Input() fieldType: FieldType[] | any[] = [];
  @Input() editSettings: any = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
  };
  @Input() toolbar: any[] | ToolbarItems[] = [];
  @Input() tableType: TableType = 'border';
  @Input() inlineEditing: boolean = false;
  @Output() actionBegin = new EventEmitter<ActionEventArgs>();
  @Output() actionClick = new EventEmitter<any>();
  @Output() actionDclick = new EventEmitter<any>();

  public icons = Icons;

  public highlightRow!: number | any;
  public isHover: boolean = true;
  public isAdd: boolean = false;
  public isSave: boolean = true;
  public isDelete: boolean = true;
  public isCancel: boolean = true;

  private editTypeElem: FieldElem[] = [];
  private rowIdx!: number | any;
  private cellIdx!: number | any;
  private editOptionElem!: HTMLOptionElement;
  private selectedRow: any;
  private idxSelect: number = 0;
  private isClick: boolean = false;

  // @HostListener('document:keydown', ['$event'])
  // onKeydownHandler(event: KeyboardEvent) {
  //   if (event.key == 'Enter') this.onNavClick('save');
  //   if (event.key == 'Escape') this.onNavClick('cancel');
  // }

  constructor(private rd: Renderer2) {}

  ngOnInit(): void {
    if (
      !this.editSettings.allowAdding &&
      !this.editSettings.allowEditing &&
      !this.editSettings.allowDeleting
    ) {
      this.isHover = false;
    }

    let idx = 1;
    for (let fld of this.fieldType) {
      let createObj: any;
      if (fld.type == 'input') {
        createObj = {
          id: idx,
          name: 'input',
          elem: this.rd.createElement('input'),
        };
      } else if (fld.type == 'select') {
        createObj = {
          id: idx,
          name: 'select',
          elem: this.rd.createElement('select'),
        };
      } else if (fld.type == 'label') {
        createObj = {
          id: idx,
          name: 'label',
          elem: this.rd.createElement('span'),
        };
      } else if (fld.type == 'checkbox') {
        createObj = {
          id: idx,
          name: 'checkbox',
          elem: this.rd.createElement('input'),
        };
      }
      idx++;
      this.editTypeElem.push(createObj);
    }

    let arrToolbar = [];
    for (let item of this.toolbar) {
      let createObj: any = { disabled: null, icons: null };
      if (item == 'Add') {
        if (!this.editSettings.allowAdding) continue;
        createObj['disabled'] = false;
      } else if (item == 'Save') {
        if (!this.editSettings.allowAdding && !this.editSettings.allowEditing)
          continue;
        createObj['disabled'] = true;
      } else if (item == 'Edit') {
        if (!this.editSettings.allowEditing) continue;
        createObj['disabled'] = true;
      } else if (item == 'Delete') {
        if (!this.editSettings.allowDeleting) continue;
        createObj['disabled'] = true;
      } else if (item == 'Cancel') {
        if (!this.isHover) continue;
        createObj['disabled'] = true;
      }

      createObj['icons'] = DsIcons.find(
        (icn) => icn.name == item.toLowerCase()
      );
      arrToolbar.push(createObj);
    }

    this.toolbar = arrToolbar;
  }

  public onNavClick(action: string) {
    let getTbody: HTMLTableRowElement = this.table.nativeElement.children[1];
    let getThead: HTMLTableRowElement = this.table.nativeElement.children[0];
    let getTheadTr = getThead.children[0];
    let getTbodyTr: Element;
    let getTrTd: Element;
    let getElem: any;
    let getNameField: string;
    let createTr: HTMLTableRowElement = this.rd.createElement('tr');
    let createTd: HTMLTableRowElement;
    let createClass: any;
    let createChild: Element | any;
    // let createData: any = { id: this.uniqueId() };
    let createData: any = {};
    let isAdd = this.selectedRow == undefined ? true : false;

    switch (action) {
      case 'add':
        this.editTypeElem.forEach((item: FieldElem) => {
          if (item.name == 'label') {
            createTd = this.rd.createElement('td');
            getElem = item.elem;
            getElem.value = '';
            createTd.innerHTML = '&nbsp';
            this.rd.appendChild(createTr, createTd);
          } else if (item.name == 'input') {
            createTd = this.rd.createElement('td');
            getElem = item.elem;
            getElem.value = '';
            this.rd.appendChild(createTd, getElem);
            this.rd.setAttribute(createTd, 'class', 'py-0');
            createChild = createTd.children[0];
            createClass = {
              type: 'text',
              class: 'form-control rounded-0 border-outline',
            };
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
            this.rd.appendChild(createTr, createTd);
          } else if (item.name == 'select') {
            createTd = this.rd.createElement('td');
            getElem = item.elem;
            getElem.value = '';
            this.rd.appendChild(createTd, getElem);
            this.rd.setAttribute(createTd, 'class', 'py-0 text-muted');
            for (let item of this.selectOption) {
              this.editOptionElem = this.rd.createElement('option');
              this.rd.appendChild(createTd, this.editOptionElem);
              this.editOptionElem.value = item.value;
              this.editOptionElem.text = item.name;
              getElem.add(this.editOptionElem, null);
            }
            createClass = { class: 'form-select rounded-0 border-outline' };
            createChild = createTd.children[0];
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
            this.rd.appendChild(createTr, createTd);
          } else if (item.name == 'checkbox') {
            createTd = this.rd.createElement('td');
            getElem = item.elem;
            getElem.checked = false;
            this.rd.appendChild(createTd, getElem);
            this.rd.setAttribute(createTd, 'class', 'py-0');
            createChild = createTd.children[0];
            createClass = {
              type: 'checkbox',
              class: 'rounded-0 border-outline',
            };
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
            this.rd.appendChild(createTr, createTd);
          }
        });

        this.autoFocus(0);
        getTbody.append(createTr);
        this.updateToolbar(true);
        break;
      case 'save':
        this.editTypeElem.forEach((item: FieldElem, idx: number) => {
          if (item.name == 'input') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            let parentInput = getElem.parentElement;
            this.rd.removeClass(parentInput, 'py-0');
            parentInput.children[0].remove();
            parentInput.innerHTML = getElem.value;
            if (isAdd) createData[getNameField] = parentInput.innerHTML;
            if (!isAdd) {
              this.dataSource.find((item) => {
                item.id == this.selectedRow.id
                  ? (item[getNameField] = getElem.value)
                  : '';
              });
            }
          } else if (item.name == 'select') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            let parentSelect = getElem.parentElement;
            let textOpt = this.selectOption.find(
              (e: any) => e.value == getElem.value
            );
            for (let i = getElem.children.length - 1; i >= 0; i--) {
              getElem.children[i].remove();
            }
            parentSelect.innerHTML = textOpt.name;
            if (isAdd) createData[getNameField] = textOpt.value;
            getElem.remove();
            if (!isAdd) {
              this.dataSource.find((item) => {
                item.id == this.selectedRow.id
                  ? (item[getNameField] = textOpt.value)
                  : '';
              });
            }
          } else if (item.name == 'checkbox') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            let parentInput = getElem.parentElement;
            this.rd.removeClass(parentInput, 'py-0');
            parentInput.children[0].remove();
            parentInput.innerHTML = getElem.checked;
            if (isAdd) createData[getNameField] = parentInput.innerHTML;
            if (!isAdd) {
              this.dataSource.find((item) => {
                item.id == this.selectedRow.id
                  ? (item[getNameField] = getElem.checked)
                  : false;
              });
            }
          }
        });

        if (isAdd && this.dataSource != undefined) {
          getTbody.children[getTbody.children.length - 1].remove();
          this.dataSource.push(createData);
        }

        this.updateToolbar(false);
        this.handleReset();
        break;
      case 'edit':
        this.editTypeElem.forEach((item, idx) => {
          if (item.name == 'label') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getTbodyTr = getTbody.children[this.rowIdx - 1];
            getTrTd = getTbodyTr.children[idx];
            getTrTd.innerHTML = this.selectedRow[getNameField];
          } else if (item.name == 'input') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getTbodyTr = getTbody.children[this.rowIdx - 1];
            getTrTd = getTbodyTr.children[idx];
            getElem = item.elem;
            getTrTd.innerHTML = '';
            this.rd.appendChild(getTrTd, getElem);
            this.rd.setAttribute(getTrTd, 'class', 'py-0');
            createChild = getTrTd.children[0];
            createClass = {
              type: 'text',
              class: 'form-control border-0 rounded-0',
            };
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
            createChild.value = this.selectedRow[getNameField];
          } else if (item.name == 'select') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getTbodyTr = getTbody.children[this.rowIdx - 1];
            getTrTd = getTbodyTr.children[idx];
            getElem = item.elem;
            getTrTd.innerHTML = '';
            this.rd.appendChild(getTrTd, getElem);
            this.rd.setAttribute(getTrTd, 'class', 'py-0 text-muted');
            for (let item of this.selectOption) {
              this.editOptionElem = this.rd.createElement('option');
              this.rd.appendChild(getTrTd, this.editOptionElem);
              this.editOptionElem.value = item.value;
              this.editOptionElem.text = item.name;
              if (this.selectedRow[getNameField] == item.value) {
                this.editOptionElem.setAttribute('selected', 'true');
              }
              getElem.add(this.editOptionElem, null);
            }
            createClass = { class: 'form-select border-0 rounded-0' };
            createChild = getTrTd.children[0];
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
          } else if (item.name == 'checkbox') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getTbodyTr = getTbody.children[this.rowIdx - 1];
            getTrTd = getTbodyTr.children[idx];
            getElem = item.elem;
            getTrTd.innerHTML = '';
            this.rd.appendChild(getTrTd, getElem);
            this.rd.setAttribute(getTrTd, 'class', 'py-0');
            createChild = getTrTd.children[0];
            createClass = { type: 'checkbox', class: 'border-0 rounded-0' };
            for (let key in createClass) {
              this.rd.setAttribute(createChild, key, createClass[key]);
            }
            createChild.checked = this.selectedRow[getNameField];
          }
        });

        this.autoFocus(this.cellIdx);
        this.updateToolbar(true);
        break;
      case 'delete':
        this.dataSource.forEach((e, idx) => {
          e.id == this.selectedRow.id ? this.dataSource.splice(idx, 1) : '';
        });
        this.updateToolbar(false);
        this.handleReset();
        break;
      case 'cancel':
        this.editTypeElem.forEach((item, idx) => {
          if (item.name == 'input') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            const parentInpElem = getElem.parentElement;
            this.rd.removeClass(parentInpElem, 'py-0');
            parentInpElem.children[0].remove();
            if (!isAdd)
              parentInpElem.innerHTML = this.selectedRow[getNameField];
          } else if (item.name == 'select') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            const parentSlcElem = getElem.parentElement;
            for (let i = getElem.children.length - 1; i >= 0; i--) {
              getElem.children[i].remove();
            }
            if (!isAdd) {
              this.selectOption.find((opt: any) => {
                opt.value == this.selectedRow[getNameField]
                  ? (parentSlcElem.innerHTML = opt.name)
                  : '';
              });
            }
            getElem.remove();
          } else if (item.name == 'checkbox') {
            getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
            getElem = item.elem;
            if (getElem == undefined) return;
            if (getElem.parentElement == null) return;
            const parentInpElem = getElem.parentElement;
            this.rd.removeClass(parentInpElem, 'py-0');
            parentInpElem.children[0].remove();
            if (!isAdd)
              parentInpElem.innerHTML = this.selectedRow[getNameField];
          }
        });

        if (isAdd) {
          getTbody.children[getTbody.children.length - 1].remove();
        }

        this.updateToolbar(false);
        this.handleReset();
        break;
    }

    this.actionBegin.emit({
      requestType: action,
      data: this.dataSource,
      newData: createData,
    });
  }

  public mouseHover(event: any) {
    const eventChild = event.target?.children[0];
    if (eventChild == undefined) return;
    if (event.type !== 'mouseenter') {
      this.rd.removeClass(eventChild, 'border-inline');
      this.rd.addClass(eventChild, 'border-0');
      return;
    }
    this.rd.removeClass(eventChild, 'border-0');
    this.rd.addClass(eventChild, 'border-inline');
  }

  public onFilterTbody(event: any, dField: FieldType, dSource: any) {
    let arrFiled: string[] = [];
    let cell = event.cellIndex;

    for (let item of this.fieldType) arrFiled.push(item.name);
    if (dField.type == 'label' || dField.type == 'input') {
      return dSource[dField.name];
    }
    if (dField.type == 'select') {
      for (let opt of this.selectOption) {
        if (opt.value == dSource[dField.name]) {
          return opt.name;
        }
      }
    }
    if (dField.type == 'checkbox' && event.className != 'py-0') {
      const nameIcon =
        dSource[dField.name] == 'true' || dSource[dField.name] == true
          ? this.icons.checkbox
          : this.icons.uncheckbox;
      // const nameIcon = this.icons.uncheckbox ;
      return this.rd.setProperty(event, 'innerHTML', nameIcon);
    }
  }

  public onClickTable(event: any, data: any, idx: number) {
    if (!this.isHover) return;
    this.rowIdx = event.target.parentNode.rowIndex;
    this.cellIdx = event.target.cellIndex;
    this.selectedRow = data;
    this.actionClick.emit({ data: this.selectedRow });
    if (this.rowIdx == undefined) {
      this.updateToolbar(true);
    } else {
      this.updateToolbar();
    }
    if (this.rowIdx == this.rowIdx) {
      this.highlightRow = idx;
      return;
    }
    this.highlightRow = undefined;
  }

  public onDclickTable(event: any, data?: any) {
    if (!this.editSettings.allowEditing) return;
    this.rowIdx = event.target.parentNode.rowIndex;
    this.cellIdx = event.target.cellIndex;
    this.selectedRow = data;
    this.actionDclick.emit({ data: this.selectedRow });
    const isEdit = this.inlineEditing ? 'edit' : 'cancel';
    this.onNavClick(isEdit);
    this.updateToolbar(true);
  }

  private updateToolbar(args?: boolean) {
    for (let bar of this.toolbar) {
      const iconName = bar.icons.name;
      switch (args) {
        case true: // add, edit, doubleclick
          if (iconName == 'add') bar.disabled = true;
          else if (iconName == 'save') bar.disabled = false;
          else if (iconName == 'edit') bar.disabled = true;
          else if (iconName == 'delete') bar.disabled = true;
          else if (iconName == 'cancel') bar.disabled = false;
          break;
        case false: // save, delete, cancel
          if (iconName == 'add') bar.disabled = false;
          else if (iconName == 'save') bar.disabled = true;
          else if (iconName == 'edit') bar.disabled = true;
          else if (iconName == 'delete') bar.disabled = true;
          else if (iconName == 'cancel') bar.disabled = true;
          break;
        default:
          // onclick
          if (iconName == 'add') bar.disabled = true;
          else if (iconName == 'save') bar.disabled = true;
          else if (iconName == 'edit') bar.disabled = false;
          else if (iconName == 'cancel') bar.disabled = false;
          else if (iconName == 'delete') bar.disabled = false;
          break;
      }
    }
  }

  private handleReset(action?: string) {
    this.isCancel = true;
    this.highlightRow = undefined;
    this.rowIdx = undefined;
    this.selectedRow = null;
    for (let item of this.editTypeElem) {
      item.elem.value = '';
    }
  }

  private uniqueId() {
    return Math.floor(
      Math.random() * Math.floor(Math.random() * Date.now())
    ).toString(16);
  }

  private autoFocus(num: number) {
    setTimeout(() => {
      this.editTypeElem[num].elem.focus();
    }, 0);
  }
}
