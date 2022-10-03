import { Component, OnInit } from '@angular/core';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryImageSize,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { SliderService } from './slider.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  constructor(private sliderService: SliderService) {}

  ngOnInit(): void {
    this.galleryOptions = this.sliderService.getSliderOptions();
    this.galleryImages = this.sliderService.getSliderImages();
  }
}
