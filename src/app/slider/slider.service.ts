import { Injectable } from '@angular/core';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';

@Injectable({ providedIn: 'root' })
export class SliderService {
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  getSliderOptions(): NgxGalleryOptions[] {
    this.galleryOptions = [
      {
        width: '1527px',
        height: '628px',
        imageAutoPlay: true,
        imageAutoPlayInterval: 3600,
        imageAutoPlayPauseOnHover: true,
        preview: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: false,
        arrowPrevIcon: 'fa fa-chevron-left',
        arrowNextIcon: 'fa fa-chevron-right',
        imageBullets: true,
        imageArrowsAutoHide: true,
        imageInfinityMove: true,
        imageSwipe: true,
      },
      {
        breakpoint: 1550,
        width: '90%',
        imagePercent: 100,
      },
      {
        breakpoint: 1360,
        height: '528px',
      },
      {
        breakpoint: 1150,
        height: '428px',
      },
      {
        breakpoint: 950,
        width: '100%',
        height: '328px',
        imageArrowsAutoHide: false,
      },
      {
        breakpoint: 700,
        height: '278px',
      },
      {
        breakpoint: 500,
        height: '228px',
      },
      {
        breakpoint: 400,
        height: '158px',
      },
    ];
    return this.galleryOptions;
  }

  getSliderImages(): NgxGalleryImage[] {
    this.galleryImages = [
      {
        small: 'assets/FirstImage.jpg',
        medium: 'assets/FirstImage.jpg',
        big: 'assets/FirstImage.jpg',
      },
      {
        small: 'assets/SecondImage.jpg',
        medium: 'assets/SecondImage.jpg',
        big: 'assets/SecondImage.jpg',
      },
      {
        small: 'assets/ThirdImage.jpg',
        medium: 'assets/ThirdImage.jpg',
        big: 'assets/ThirdImage.jpg',
      },
      {
        small: 'assets/FourthImage.jpg',
        medium: 'assets/FourthImage.jpg',
        big: 'assets/FourthImage.jpg',
      },
    ];
    return this.galleryImages;
  }
}
