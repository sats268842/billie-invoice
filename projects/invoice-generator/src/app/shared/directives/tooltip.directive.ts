import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  tooltip: HTMLElement;
  @Input('tooltip') tooltipTitle: string;
  delay = 500;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseover') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    console.log('mouseleave');
    this.renderer.removeClass(this.tooltip, 'tooltip_show');
    this.renderer.setStyle(this.tooltip, 'display', `none`);
    this.renderer.removeClass(this.tooltip, 'tooltip');
    // this.renderer.setStyle(this.tooltip, "opacity", `0`);
  }
  @HostListener('mouseclick') onMouseClick() {
    this.renderer.removeClass(this.tooltip, 'tooltip_show');
    this.renderer.setStyle(this.tooltip, 'opacity', `0`);
    this.renderer.setStyle(this.tooltip, 'display', `none`);
  }

  showTooltip() {
    this.tooltip = this.renderer.createElement('span');
    // creating a span
    this.tooltip.appendChild(this.renderer.createElement('span'));
    // appending a span to the tooltip

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
      // adding the tooltip text into the tooltip span
    );
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    // getting the hight width and positions of the target element
    let top, left;

    top = hostPos.bottom;
    left = hostPos.left + hostPos.width / 2;
    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    //adding a top positions value for the tooltip
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'display', `block`);
    // adding the left value
    this.renderer.appendChild(document.body, this.tooltip);
    // appending to the document
    this.renderer.addClass(this.tooltip, 'tooltip');
    this.renderer.addClass(this.tooltip, 'transition-all');
    this.renderer.addClass(this.tooltip, 'duration-1000');
    this.renderer.addClass(this.tooltip, 'ease-in-out');
    this.renderer.addClass(this.tooltip, 'font-semibold');
    this.renderer.addClass(this.tooltip, 'tooltip_show');
    // adding the tooltip styles
  }
}
