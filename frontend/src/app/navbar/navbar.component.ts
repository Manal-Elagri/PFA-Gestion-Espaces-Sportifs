import {Component, HostListener , ViewChild } from "@angular/core";
import { MonEspacePopupComponent } from '../mon-espace-popup/mon-espace-popup.component'; // adapte selon ton projet


@Component({
	selector: "navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
	@ViewChild(MonEspacePopupComponent) monEspacePopup!: MonEspacePopupComponent;

	showMenu = false;
	isSmallScreen = window.innerWidth <= 992;
	isTransparentBg = true;
	activeSection: string | null = null;

	menuItems = [
		{ label: "ACCUEIL", link: "#home" },
		{ label: "About", link: "#about-us" },
		{ label: "Competition", link: "#menu" },
		{ label: "Terrain", link: "#terrain" },
		{ label: "CONTACT", link: "#contacts" },
		{ label: 'Mon Espace', link: '#monespace' }, // <- important

	];
  
	 // Gestion du clic sur le bouton "Mon Espace"
	 onMenuItemClick(event: Event, item: any) {
		if (item.label === 'Mon Espace') {
		  event.preventDefault();  // Empêche la navigation vers une autre page
		  this.monEspacePopup.openPopup();  // Ouvre la popup
		}
	  }


	toggleMenu() {
		this.showMenu = !this.showMenu;
	}

	closeMenu() {
		this.showMenu = false;
	}

	@HostListener("window:resize", ["$event"])
	onResize(event: any) {
		this.isSmallScreen = event.target.innerWidth <= 992;
		// Hide the menu when resizing from large to small screen
		if (this.isSmallScreen) {
			this.showMenu = false;
		}
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		// Determine the active section based on scrolling
		const sections = ["about-us", "chefs", "menu", "gallery", "contacts"];
		const scrollPosition = window.scrollY;
		let activeSection: string | null = null;

		for (const section of sections) {
			const element = document.getElementById(section);
			if (element) {
				const offsetTop = element.offsetTop;
				if (scrollPosition >= offsetTop - 120) {
				activeSection = section;
				}
			}
		}

		this.activeSection = activeSection;

		// Check if the user has scrolled and remove the transparent background class
		this.isTransparentBg = window.scrollY < 90;
	}

	constructor() {
		// Trigger the initial check for screen size
		this.onResize({target: {innerWidth: window.innerWidth}});
	}
}
