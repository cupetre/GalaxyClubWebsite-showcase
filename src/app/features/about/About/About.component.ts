import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-About',
  imports: [CommonModule],
  templateUrl: './About.component.html',
  styleUrls: ['./About.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  currentSlide = 0;

  galleryImages: GalleryImage[] = [
    {
      src: 'https://galaxyclub.nbg1.your-objectstorage.com/Screenshot_1.jpg',
      alt: 'Premium billiard table at Galaxy Billiard'
    },
    {
      src: 'https://galaxyclub-gallery.fsn1.your-objectstorage.com/about/coffee-1.jpg',
      alt: 'Coffee and lounge area at Galaxy Billiard'
    },
    {
      src: 'https://galaxyclub-gallery.fsn1.your-objectstorage.com/about/tournament-1.jpg',
      alt: 'Tournament atmosphere at Galaxy Billiard'
    },
    {
      src: 'https://galaxyclub-gallery.fsn1.your-objectstorage.com/about/lounge-1.jpg',
      alt: 'Players enjoying the club lounge'
    },
    {
      src: 'https://galaxyclub-gallery.fsn1.your-objectstorage.com/about/atmosphere-1.jpg',
      alt: 'Warm interior atmosphere of Galaxy Billiard'
    }
  ];

  moveGallery(direction: number): void {
    const total = this.galleryImages.length;
    this.currentSlide = (this.currentSlide + direction + total) % total;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

}
