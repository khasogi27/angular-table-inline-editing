import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'saveSvg'
})
export class SaveSvgPipe implements PipeTransform {

  constructor(private domS: DomSanitizer) {}

  transform(value: any, args?: any): any {
    return this.domS.bypassSecurityTrustHtml(value);
  }

}