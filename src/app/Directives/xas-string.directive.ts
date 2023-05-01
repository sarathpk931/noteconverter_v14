//xas-string.directive 
import { Directive,Input,ElementRef,Renderer2 } from '@angular/core';

@Directive({
  selector: '[xasString]'
})
export class XasStringDirective {

  @Input('xasString') xasString : string;
  @Input() formatValues : string;

  constructor(private el : ElementRef, private renderer : Renderer2) { 

  }

  ngOnInit(){
    this.renderer.setProperty(this.el.nativeElement,'innerHTML', this.replaceString());
  }

  ngOnChanges(){
    this.renderer.setProperty(this.el.nativeElement,'innerHTML',this.replaceString());
  }

  private replaceString():string{


    let string = this.xasString;
    const matches = string.match(/\{(\d)\}/g);

    if(matches && this.formatValues){
      
      const formatString = JSON.parse(this.formatValues);
      const formatValues = Array.isArray(formatString) ? formatString : [formatString];
        

        if (matches.length !== formatString.length)
                                throw ("Format string length mismatch between " + this.xasString + " and " + this.formatValues);
debugger;
        matches.forEach((match,index) =>{ debugger;
          const fv = formatValues[index].toString().trim();
          string = string.replace(match, fv);
        });
      }
      
    return string;
  }

}