import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'; // Assure-toi que ce chemin est correct
import { Router } from '@angular/router';



interface Terrain {
  id?: number;
  nom: string;
  mesure: string;
  categorieTerrain: string;
  estDisponible: boolean;
  imageURL?: string;
}

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['../app.component.css', './team.component.css']
})


export class TeamComponent implements OnInit {

  terrains: Terrain[] = [];
  visibleTerrains: Terrain[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 3;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTerrains();
  }

  loadTerrains(): void {
    this.adminService.getAllTerrain().subscribe(data => {
      this.terrains = data;
      this.updateVisibleTerrains();
    });
  }

  updateVisibleTerrains(): void {
    const start = this.currentIndex * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.visibleTerrains = this.terrains.slice(start, end);
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleTerrains();
    }
  }

  nextSlide(): void {
    if ((this.currentIndex + 1) * this.itemsPerPage < this.terrains.length) {
      this.currentIndex++;
      this.updateVisibleTerrains();
    }
  }
}
