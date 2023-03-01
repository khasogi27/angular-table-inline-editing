import {
  Component,
  Renderer2,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DsIcons, DsIconsCheckbox, IconsCheckbox } from '../icons';

export interface FieldType {
  name: string;
  type: 'label' | 'input' | 'select' | 'checkbox';
  text: string;
}

interface FieldElem {
  id: number | string;
  name: string;
  elem: HTMLInputElement | HTMLSelectElement | any;
}

interface EditSettings {
  allowEditing: boolean;
  allowAdding: boolean;
  allowDeleting: boolean;
}

export interface SelectOption {
  name: string;
  value: string;
}

export type ToolbarItems = 'Add' | 'Save' | 'Edit' | 'Delete' | 'Cancel';

@Component({
  selector: 't-grid',
  templateUrl: './t-grid.component.html',
  styleUrls: ['./t-grid.component.css'],
})
export class TGridComponent implements OnInit {
  @ViewChild('table') table: ElementRef | any;

  @Output() actionClick = new EventEmitter<any>();

  @Input() dataSource: any[] = [];
  @Input() fieldType: FieldType[] | any[] = [];
  @Input() toolbar: any[] | ToolbarItems[] = [];
  @Input() selectOption: SelectOption[] = [];
  @Input() editSettings: EditSettings = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
  };

  private editTypeElem: FieldElem[] = [];
  private editOptionElem!: HTMLOptionElement;
  public isHover: boolean = true;

  private rowIdx!: number | any;
  private cellIdx!: number | any;

  public iconsChkbox: IconsCheckbox = DsIconsCheckbox;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    if (
      !this.editSettings.allowAdding &&
      !this.editSettings.allowEditing &&
      !this.editSettings.allowDeleting
    ) {
      this.isHover = false;
    }
    // create and insert element
    let idx = 1;
    for (let fld of this.fieldType) {
      let createObjField: any;
      if (fld.type == 'input') {
        const crtElm = this.renderer.createElement('input');
        createObjField = {
          id: idx,
          name: 'input',
          elem: crtElm,
        };
      } else if (fld.type == 'select') {
        const crtElm = this.renderer.createElement('select');
        createObjField = {
          id: idx,
          name: 'select',
          elem: crtElm,
        };
      } else if (fld.type == 'label') {
        const crtElm = this.renderer.createElement('span');
        createObjField = {
          id: idx,
          name: 'label',
          elem: crtElm,
        };
      } else if (fld.type == 'checkbox') {
        const crtElm = this.renderer.createElement('input');
        createObjField = {
          id: idx,
          name: 'checkbox',
          elem: crtElm,
        };
      }
      idx++;
      this.editTypeElem.push(createObjField);
    }

    // create toolbar
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
    console.log(action, 'action');
    let getThead: HTMLTableRowElement = this.table.nativeElement.children[0];
    let getTheadTr = getThead.children[0];
    let getTbody: HTMLTableRowElement = this.table.nativeElement.children[1];
    let getTbodyTr: Element;
    let getTrTd: Element;
    let getElem: any;
    let getNameField: string;
    let createTr: HTMLTableRowElement = this.renderer.createElement('tr');
    let createTd: HTMLTableRowElement;
    let createClass: any;
    let createChild: Element | any;
    let createData = {};
    let isAdd = this.findSelectedIdx() == false ? true : false;

    // crud
    if (action == 'add') {
      this.editTypeElem.forEach((item: FieldElem) => {
        if (item.name == 'label') {
          createTd = this.renderer.createElement('td');
          getElem = item.elem;
          getElem.value = '';
          createTd.innerHTML = '&nbsp';
          this.renderer.appendChild(createTr, createTd);
        } else if (item.name == 'input') {
          createTd = this.renderer.createElement('td');
          getElem = item.elem;
          getElem.value = '';
          this.renderer.appendChild(createTd, getElem);
          this.renderer.setAttribute(createTd, 'class', 'py-0');
          createChild = createTd.children[0];
          createClass = {
            type: 'text',
            class: 'form-control rounded-0 border-outline',
          };
          for (let key in createClass) {
            this.renderer.setAttribute(createChild, key, createClass[key]);
          }
          this.renderer.appendChild(createTr, createTd);
        } else if (item.name == 'select') {
          createTd = this.renderer.createElement('td');
          getElem = item.elem;
          getElem.value = '';
          this.renderer.appendChild(createTd, getElem);
          this.renderer.setAttribute(createTd, 'class', 'py-0 text-muted');
          for (let opt of this.selectOption) {
            this.editTypeElem = this.renderer.createElement('option');
            this.renderer.appendChild(getTrTd, this.editOptionElem);
            this.editOptionElem.value = opt.value;
            this.editOptionElem.text = opt.name;
            getElem.add(this.editOptionElem, null);
          }
          createClass = { class: 'form-select rounded-0 border-outline' };
          createChild = createTd.children[0];
          for (let key in createClass) {
            this.renderer.setAttribute(createChild, key, createClass[key]);
          }
          this.renderer.appendChild(createTr, createTd);
        } else if (item.name == 'checkbox') {
          createTd = this.renderer.createElement('td');
          getElem = item.elem;
          getElem.checked = false;
          this.renderer.appendChild(createTd, getElem);
          this.renderer.setAttribute(createTd, 'class', 'py-0');
          createChild = createTd.children[0];
          createClass = {
            type: 'checkbox',
            class: 'rounded-0 border-outline',
          };
          for (let key in createClass) {
            this.renderer.setAttribute(createChild, key, createClass[key]);
          }
          this.renderer.appendChild(createTr, createTd);
        }

      });
      getTbody.append(createTr);
      this.updateToolbar(true);
    } else if (action == 'save') {
      this.editTypeElem.forEach((item: FieldElem, idx: number) => {
        if (item.name == 'input') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentInput = getElem.parentElement;
          this.renderer.removeClass(parentInput, 'py-0');
          parentInput.children[0].remove();
          parentInput.innerHTML = getElem.value;
          if (isAdd) createData[getNameField] = parentInput.innerHTML;
          if (!isAdd) {
            this.dataSource.find((item: any, idx: number) => {
              if (this.findSelectedIdx() == idx) {
                item[getNameField] = getElem.value;
              }
            });
          }
        } else if (item.name == 'select') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentSelect = getElem.parentElement;
          let textOpt = this.selectOption.find(e => e.value = getElem.name);
          for (let i = getElem.children.length -1; i >= 0; i--) {
            getElem.children[i].remove();
          }
          parentSelect.innerHTML = textOpt.name;
          if (isAdd) createData[getNameField] = textOpt.value;
          getElem.remove();
          if (!isAdd) {
            this.dataSource.find((item: any, idx: number) => {
              if (this.findSelectedIdx() == idx) {
                item[getNameField] = textOpt.value;
              }
            });
          }
        } else if (item.name == 'checkbox') {
          getNameField = getTheadTr.children[idx].innerHTML.toLowerCase();
          getElem = item.elem;
          if (getElem == undefined) return;
          if (getElem.parentElement == null) return;
          let parentInput = getElem.parentElement;
          this.renderer.removeClass(parentInput, 'py-0');
          parentInput.children[0].remove();
          parentInput.innerHTML = getElem.checked;
          if (isAdd) createData[getNameField] = parentInput.innerHTML;
          if (!isAdd) {
            this.dataSource.find((item: any, idx: number) => {
              if (this.findSelectedIdx() == idx) {
                item[getNameField] = getElem.value;
              }
            });
          }
        }

      });
      if (isAdd && this.dataSource != undefined) {
        getTbody.children[getTbody.children.length -1].remove();
        this.dataSource.push(createData);
      }
      this.updateToolbar(true);
    } else if (action == 'edit') {

    } else if (action == 'delete') {

    } else if (action == 'cancel') {

    }
  }

  public onFilterTbody(evnTr: any, evnTd: any, fld: FieldType, item: any) {
    const keyItem = Object.keys(item);
    for (let itm of keyItem) {
      if (itm != fld.name) {
        this.renderer.setAttribute(evnTr, itm, item.id);
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
      let setIconChkbox: string;
      if (item[fld.name] == true || item[fld.name] == 'true') {
        setIconChkbox = this.iconsChkbox.checkbox;
      } else {
        setIconChkbox = this.iconsChkbox.uncheckbox;
      }
      return this.renderer.setProperty(evnTd, 'innerHTML', setIconChkbox);
    }
  }

  public mouseHover(event: any) {
    const eventChild = event.target?.children[0];
    let addClass = 'border-inline';
    let removeClass = 'border-0';
    if (eventChild == undefined) return;
    if (event.type == 'mouseenter') {
      removeClass = 'border-inline';
      addClass = 'border-0';
    } else {
      removeClass = 'border-0';
      addClass = 'border-inline';
    }
    this.renderer.removeClass(eventChild, removeClass);
    this.renderer.addClass(eventChild, addClass);
  }

  public onClickTable(event: any, evnTb: any, evnTr: any, data: any) {
    if (!this.isHover) return;
    this.rowIdx = event.target.parentNode.rowIndex;
    this.cellIdx = event.target.cellIndex;
    this.actionClick.emit(data);
    for (let tr of evnTb.children) {
      if (evnTr == tr) {
        this.renderer.addClass(evnTr, 'selected');
        continue;
      }
      this.renderer.removeClass(tr, 'selected');
    }
    if (this.rowIdx == undefined) {
      this.updateToolbar(true);
      return;
    }
    this.updateToolbar();
  }

  private updateToolbar(args?: boolean) {
    for (let bar of this.toolbar) {
      if (args) {
        if (bar.icons.name == 'add') bar.disabled = true;
        else if (bar.icons.name == 'save') bar.disabled = false;
        else if (bar.icons.name == 'edit') bar.disabled = true;
        else if (bar.icons.name == 'delete') bar.disabled = true;
        else if (bar.icons.name == 'cancel') bar.disabled = false;
      } else if (!args) {
        if (bar.icons.name == 'add') bar.disabled = false;
        else if (bar.icons.name == 'save') bar.disabled = true;
        else if (bar.icons.name == 'edit') bar.disabled = true;
        else if (bar.icons.name == 'delete') bar.disabled = true;
        else if (bar.icons.name == 'cancel') bar.disabled = true;
      } else {
        if (bar.icons.name == 'add') bar.disabled = true;
        else if (bar.icons.name == 'save') bar.disabled = true;
        else if (bar.icons.name == 'edit') bar.disabled = false;
        else if (bar.icons.name == 'cancel') bar.disabled = false;
        else if (bar.icons.name == 'delete') bar.disabled = false;
      }
    }
  }

  private findSelectedIdx() {
    const getTbody: any = this.table.nativeElement.children[1];
    for (let i = 0; i < getTbody.children.length; i++) {
      if (getTbody.children[i].className == 'selected') {
        return getTbody.children[i].rowIndex;
      }
      return false;
    }
  }
}
