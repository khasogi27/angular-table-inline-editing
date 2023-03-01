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
import { TablerIcon } from '../icons';

const Icons = {
  checkbox: `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
        <path d="M9 12l2 2l4 -4"></path>
      </svg>
    `,
  uncheckbox: `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-uncheck" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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

export type TableType = 'border' | 'none';

@Component({
  selector: 'custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.css'],
})
export class CustomGridComponent implements OnInit {
  @ViewChild('table') table: ElementRef | any;
  @Input() dataSource: any[] = [];
  @Input() selectOption: any[] = [];
  @Input() fieldType: FieldType[] | any[] = [];
  @Input() tableType: TableType = 'border';
  @Output() actionBegin = new EventEmitter<ActionEventArgs>();
  @Output() actionClick = new EventEmitter<any>();
  @Output() actionDclick = new EventEmitter<any>();

  public localData: { action: string, data: any[] }[] = [];
  private keyId!: string;
  public icons = Icons;
  public dsIcon: any = TablerIcon;

  public dsDropdown: { name: string; node?: any, action: string; icon: string }[] = [
    { name: 'add before', action: 'add-up', icon: this.dsIcon.addBefore },
    { name: 'add after', action: 'add-down', icon: this.dsIcon.addAfter },
    { name: 'edit', action: 'edit', icon: this.dsIcon.edit },
    { name: 'delete', action: 'delete', icon: this.dsIcon.delete },
  ];

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
  public selectedRow: any;
  private idxSelect: number = 0;
  private isClick: boolean = false;
  public statusAction: string = 'cancel';

  // @HostListener('click')
  // onClickTest() {
  //   this.inside = true;
  // }

  @HostListener('document:click', ['$event'])
  onClickHandler() {
    let ofEvent = event.target as HTMLElement;
    if ((ofEvent.tagName == "DIV" || ofEvent.tagName == "svg") && 
      (this.statusAction == "edit" || this.statusAction == "add")) {
        // this.onNavClick('cancel');
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
      if (event.key == 'Enter') {
        this.onNavClick('save');
      } 
      if (event.key == 'Escape') {
        this.onNavClick('cancel');
      } 
  }

  constructor(private rd: Renderer2) {}

  ngOnInit(): void {
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
  }

  public onNavClickCopy(action: string, eventTr?: any, eventTd?: any,) {
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

    this.statusAction = action;

    if (action == 'add') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        if (idx == 0) {
          createTd = this.rd.createElement('td');
          getElem = item.elem;
          getElem.value = '';
          createTd.innerHTML = '&nbsp';
          this.rd.appendChild(createTr, createTd);
        }
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
          for (let opt of this.selectOption) {
            this.editOptionElem = this.rd.createElement('option');
            this.rd.appendChild(createTd, this.editOptionElem);
            this.editOptionElem.value = opt.value;
            this.editOptionElem.text = opt.name;
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
    } else if (action == 'save') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        idx++;
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

      this.handleReset();
    } else if (action == 'edit') {
      this.editTypeElem.forEach((item, idx) => {
        idx++;
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
          this.rd.removeClass(getTrTd, 'custom-td');
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
    } else if (action == 'delete') {
      this.dataSource.forEach((e, idx) => {
        e.id == this.selectedRow.id ? this.dataSource.splice(idx, 1) : '';
      });

      this.handleReset();
    } else if (action == 'cancel') {
      this.editTypeElem.forEach((item, idx) => {
        idx++;
        if (item.name == 'input') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          const parentInpElem = getElem.parentElement;
          this.rd.removeClass(parentInpElem, 'py-0');
          parentInpElem.children[0].remove();
          if (!isAdd) parentInpElem.innerHTML = this.selectedRow[getNameField];
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
          if (!isAdd) parentInpElem.innerHTML = this.selectedRow[getNameField];
        }
      });

      if (isAdd) {
        getTbody.children[getTbody.children.length - 1].remove();
      }

      this.handleReset();
    }

    this.actionBegin.emit({
      requestType: action,
      data: this.dataSource,
      newData: createData,
    });
  }

  public onNavClick(action: string, event?: { tr?: any, td?: any }, data?: any) {
    let getTbody: HTMLTableRowElement = this.table.nativeElement.children[1];
    let getThead: HTMLTableRowElement = this.table.nativeElement.children[0];
    let getTheadTr = getThead.children[0];
    let getTbodyTr: Element;
    let getTrTd: Element;
    let createTr: HTMLTableRowElement = this.rd.createElement('tr');
    let getNameField: string;
    let getElem: any;
    let createTd: HTMLTableRowElement;
    let createClass: any;
    let createChild: Element | any;
    let createData: any = {};
    if (action == 'add-up' || action == 'add-down') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        if (idx == 0) {
          createTd = this.rd.createElement('td');
          getElem = item.elem;
          getElem.value = '';
          createTd.innerHTML = '&nbsp';
          this.rd.appendChild(createTr, createTd);
        }
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
            class: 'form-control rounded-0 border-outline'
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
          this.rd.setAttribute(createTd, 'class', 'py-0 text-mute');
          for (let opt of this.selectOption) {
            this.editOptionElem = this.rd.createElement('option');
            this.rd.appendChild(createTd, this.editOptionElem);
            this.editOptionElem.value = opt.value;
            this.editOptionElem.text = opt.name;
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
            class: 'rounded-0 border-outline'
          };
          for (let key in createClass) {
            this.rd.setAttribute(createChild, key, createClass[key]);
          }
          this.rd.appendChild(createTr, createTd);
        }
      });

      this.autoFocus(0);
      let beforetNode: any;
      if (action == 'add-up') beforetNode = event.tr
      else if (action == 'add-down') beforetNode = this.rd.nextSibling(event.tr);
      this.rd.insertBefore(getTbody, createTr, beforetNode, false);
      this.statusAction = action;
    } else if (action == 'save') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        idx++;
        if (item.name == 'input') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentElement = getElem.parentElement;
          this.rd.removeClass(parentElement, 'py-0');
          parentElement.children[0].remove();
          parentElement.innerHTML = getElem.value;
          if (this.statusAction == 'add') {
            createData[getNameField] = parentElement.innerHTML;
          } 
          if (this.statusAction != 'add') {
          }
        } else if (item.name == 'select') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentElement = getElem.parentElement;
          let textOpt = this.selectOption.find(e => e.value == getElem.value);
          for (let i = getElem.children.length -1; i >= 0; i--) {
            getElem.children[i].remove();
          }
          parentElement.innerHTML = textOpt.name;
          if (this.statusAction == 'add') {
            createData[getNameField] = textOpt.value;
          }
          getElem.remove();
          if (this.statusAction != 'add') {
          }
        } else if (item.name == 'checkbox') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentElement = getElem.parentElement;
          this.rd.removeClass(parentElement, 'py-0');
          parentElement.children[0].remove();
          parentElement.innerHTML = getElem.checked;
          if (this.statusAction == 'add') {
            createData[getNameField] = parentElement.innerHTML;
          }
          if (this.statusAction != 'add') {
          }
        }
      });

      if (this.statusAction == 'add' && this.dataSource != undefined) {
        getTbody.children[getTbody.children.length -1].remove();
        this.dataSource.push(createData);
        this.localData.push(createData);
      }
    } else if (action == 'edit') {
      this.editTypeElem.forEach((item, idx) => {
        idx++;
        if (item.name == 'label') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getTbodyTr = event.tr;
          getTrTd = getTbodyTr.children[idx];
          getTrTd.innerHTML = data[getNameField];
        } else if (item.name == 'input') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getTbodyTr = event.tr;
          getTrTd = getTbodyTr.children[idx];
          getElem = item.elem;
          getTrTd.innerHTML = '';
          this.rd.appendChild(getTrTd, getElem);
          this.rd.setAttribute(getTrTd, 'class', 'py-0');
          this.rd.removeClass(getTrTd, 'custom-td');
          createChild = getTrTd.children[0];
          createClass = {
            type: 'text',
            class: 'form-control border-0 rounded-0'
          };
          for (let key in createClass) {
            this.rd.setAttribute(createChild, key, createClass[key]);
          }
          createChild.value = data[getNameField];
        } else if (item.name == 'select') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getTbodyTr = event.tr;
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
            if (data[getNameField] == item.value) {
              this.editOptionElem.setAttribute('select', 'true');
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
          getTbodyTr = event.tr;
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
          createChild.checked = data[getNameField];
        }
      });
    } else if (action == 'delete') {
      this.dataSource.splice(event.tr.rowIndex -1, 1);
    } else if (action == 'cancel') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        idx++;
        if (item.name == 'input') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          const parentElement = getElem.parentElement;
          this.rd.removeClass(parentElement, 'py-0');
          parentElement.children[0].remove();
          // !add
        } else if (item.name == 'select') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          const parentElement = getElem.parentElement;
          for (let i = getElem.children.length -1; i >= 0; i--) {
            getElem.children[i].remove();
          }
          // !add
          getElem.remove();
        } else if (item.name == 'checkbox') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          const parentElement = getElem.parentElement;
          this.rd.removeClass(parentElement, 'py-0');
          parentElement.children[0].remove();
          // !add
        }
      });

      const getChildren: any = getTbody.children;
      for (let item of getChildren) {
        if (item.id == '') {
          item.remove();
          break;
        }
      }
      this.statusAction = action;
    }
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

  public onFilterTbody(evnTr: any, evnTd: any, fld: FieldType, item: any) {
    const keyItem = Object.keys(item);
    for (let itm of keyItem) {
      if (itm != fld.name) {
        this.keyId = itm;
        this.rd.setAttribute(evnTr, this.keyId, item.id);
        break;
      }
    }
    if (fld.type == 'label' || fld.type == 'input') {
      return item[fld.name];
    }
    if (fld.type == 'select') {
      for (let opt of this.selectOption) {
        if (opt.value == item[fld.name]) {
          return opt.name;
        }
      }
    }
    if (fld.type == 'checkbox' && evnTd.className != 'py-0') {
      let setIcon: string;
      if (item[fld.name] == true || item[fld.name] == 'true') {
        setIcon = this.icons.checkbox;
      } else {
        setIcon = this.icons.uncheckbox;
      }
      this.rd.addClass(evnTd, 'w-1');
      return this.rd.setProperty(evnTd, 'innerHTML', setIcon);
    }
  }

  public onClickTable(event: any, data: any, idx: number) {
    // if (!this.isHover) return;
    // this.rowIdx = event.target.parentNode.rowIndex;
    // this.cellIdx = event.target.cellIndex;
    // this.selectedRow = data;
    // console.log(this.selectedRow, 'this.selectedRow');
    // this.actionClick.emit({ data: this.selectedRow });
    // if (this.rowIdx == undefined) {
    //   this.updateToolbar(true);
    // } else {
    //   this.updateToolbar();
    // }
    // if (this.rowIdx == this.rowIdx) {
    //   this.highlightRow = idx;
    //   return;
    // }
    // this.highlightRow = undefined;
  }

  public onClickTableTd(evnTd: any, data: any) {
    const evnTarget = evnTd.target
    let rowIdx: number;
    let cellIdx: number;
    let parentNode = evnTarget.parentNode
    if (this.rowIdx == undefined) {
      this.rowIdx = parentNode.rowIndex;
      this.cellIdx = evnTarget.cellIndex;
    } else {
      if (evnTarget.tagName == 'TD') {
        rowIdx = parentNode.rowIndex;
        cellIdx = evnTarget.cellIndex;
      } else {
        rowIdx = parentNode.parentNode.rowIndex;
        cellIdx = parentNode.cellIndex;
        parentNode = parentNode.parentNode;
      }
      if (this.rowIdx !== rowIdx) {
        this.onNavClick('cancel', { tr: parentNode, td: evnTarget }, data);
      }
      this.rowIdx = rowIdx;
      this.cellIdx = cellIdx;
    }
    this.selectedRow = data;
    this.onNavClick('edit', { tr: parentNode, td: evnTarget }, data);
  }

  public onClickDropdown(evnTr: any, action: string, data: any) {
    this.onNavClick(action, { tr: evnTr }, data);
  }

  public onFilterIcon(evnTr: any) {
    if (evnTr.rowIndex == this.rowIdx) {
      return this.dsIcon.arrowRight;
    }
    return this.dsIcon.moreVert;
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

  private autoFocus(num: number) {
    let idxNum: number = num;
    if (this.statusAction != 'add' && num > 0) idxNum -= 1;
    setTimeout(() => {
      this.editTypeElem[idxNum].elem.focus();
    }, 0);
  }
}
