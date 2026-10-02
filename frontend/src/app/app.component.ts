import {Component, HostListener} from "@angular/core";
import {ScrollService} from "src/app/services/scroll.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	hasScrolledPastHome = false;

	constructor(private scrollService: ScrollService) {}

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		const scrollPosition = window.scrollY;
		const threshold = window.innerHeight - 750;
		this.hasScrolledPastHome = scrollPosition > threshold;
	}

	scrollToBookingTable() {
		this.scrollService.scrollTo("booking-table");
	}
}
