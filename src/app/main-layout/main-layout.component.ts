import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/Navbar/Navbar.component";
import { HomeComponent } from "../features/home/Home/Home.component";
import { AboutComponent } from "../features/about/About/About.component";
import { StatsComponent } from "../features/stats/Stats/Stats.component";
import { ReserveComponent } from "../features/reserve/Reserve/Reserve.component";
import { ContactComponent } from "../features/contact/Contact/Contact.component";
import { FooterComponent } from "../shared/Footer/Footer.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [NavbarComponent, HomeComponent, AboutComponent, StatsComponent, ReserveComponent, ContactComponent, FooterComponent]
})
export class MainLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
