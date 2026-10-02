import { Component, OnInit, ViewChild } from "@angular/core";
import { CarouselComponent, CarouselConfig } from "ngx-bootstrap/carousel";
import { AdminService } from "../services/admin.service";

@Component({
  selector: "card-carousel",
  templateUrl: "./card-carousel.component.html",
  providers: [
    {
      provide: CarouselConfig,
      useValue: { showIndicators: false, showControls: false },
    },
  ],
  styleUrls: ["./card-carousel.component.css"],
})
export class CardCarouselComponent implements OnInit {
  competitions: any[] = []; // <-- On récupère des compétitions maintenant
  carouselItems: any[] = [];
  interval: any;

  @ViewChild("carousel", { static: true }) carousel!: CarouselComponent;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCompetitions();
  }

  loadCompetitions() {
    this.adminService.getAllCompetitions().subscribe(
      (data) => {
        this.competitions = data; // <-- Récupération des compétitions
        this.initializeCarousel();
      },
      (error) => {
        console.error('Error loading competitions:', error);
      }
    );
  }

  initializeCarousel() {
    if (this.competitions.length > 0) {
      this.carouselItems = this.competitions.slice(0, 4);
      this.startAutoplay();
    }
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      this.slideNext();
    }, 3000);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  slideNext() {
    const shiftedCompetition = this.competitions.shift();
    if (shiftedCompetition) {
      this.competitions.push(shiftedCompetition);
    }
    this.carouselItems = this.competitions.slice(0, 4);
  }

  slidePrev() {
    const poppedCompetition = this.competitions.pop();
    if (poppedCompetition) {
      this.competitions.unshift(poppedCompetition);
    }
    this.carouselItems = this.competitions.slice(0, 4);
  }
}
