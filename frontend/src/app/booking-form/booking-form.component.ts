import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MockBackendService} from "../services/mock-backend.service"; // Import the MockBackendService

@Component({
	selector: "booking-form",
	templateUrl: "./booking-form.component.html",
	styleUrls: ["../app.component.css", "./booking-form.component.css"],
})
export class BookingFormComponent {
	reservationForm: FormGroup;
	displayResultMessage: boolean = false;
	resultMessage: string = "";

	constructor(
		private formBuilder: FormBuilder,
		private mockBackendService: MockBackendService, // Inject the MockBackendService
	) {
		this.reservationForm = this.formBuilder.group({
			name: ["", Validators.required],
			lastname: ["", Validators.required],
			phone: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			date: ["", Validators.required],
			time: ["", Validators.required],
		});

		this.reservationForm.valueChanges.subscribe(() => {
			if (this.reservationForm.valid) {
				this.resultMessage = "";
				this.displayResultMessage = false;
			}
		});
	}

	submitForm() {
		if (!this.reservationForm.valid) {
			this.resultMessage = "Remplissez tous les champs, s'il vous plaît.";
			this.displayResultMessage = true;
		} else {
			this.mockBackendService
				.submitForm(this.reservationForm.value) 
				.subscribe((response) => {
					this.resultMessage =
						"Merci pour la réservation. Nous vous contacterons bientôt.";
					this.displayResultMessage = true;
					this.reservationForm.reset();

					setTimeout(() => {
						this.resultMessage = "";
						this.displayResultMessage = false;
					}, 5000);
				});
		}
	}
}
