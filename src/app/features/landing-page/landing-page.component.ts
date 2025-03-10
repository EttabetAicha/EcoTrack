import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'landing-page',
  imports: [CommonModule,RouterModule],
  templateUrl: './landing-page.component.html',

  animations: [
    trigger('fadeOutLeft', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-30px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('1s ease-out'))
    ]),
    trigger('zoomUpDown', [
      state('start', style({ transform: 'scale(1) translateY(0)' })),
      state('end', style({ transform: 'scale(1.1) translateY(-10px)' })),
      transition('start <=> end', animate('2s ease-in-out')),
    ]),
    trigger('fadeOutUp', [
      state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
      transition(':enter', [
        animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('normal <=> hover', animate('200ms ease-in-out'))
    ]),
    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.1)' })),
      transition('normal <=> hover', animate('200ms ease-in-out'))
    ]),
    trigger('parallax', [
      state('normal', style({ transform: 'translateY(0)' })),
      state('scrolled', style({ transform: 'translateY(-50px)' })),
      transition('normal <=> scrolled', animate('700ms ease-in-out'))
    ])
  ]
})
export class LandingPage implements OnInit {
  animationState = 'start';
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
  testimonials = [
  {
    name: "Alice Dupont",
    quote: "Cette plateforme a changé ma façon de recycler!",
    image: "https://plus.unsplash.com/premium_photo-1689629870780-5d0e655383e6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Marc Leclerc",
    quote: "Super facile à utiliser et très intuitif.",
    image: "https://plus.unsplash.com/premium_photo-1689565611422-b2156cc65e47?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Sophie Lemoine",
    quote: "Un impact réel sur l'environnement, bravo!",
    image: "https://plus.unsplash.com/premium_photo-1689531953275-a5cfcc458931?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Jean-Pierre Martin",
    quote: "Cette plateforme a révolutionné ma manière de gérer mes déchets!",
    image: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];


  features = [
    {
      icon: 'M4 4v16h16M4 20l6-6 4 4 6-6',
      title: 'Suivi en Temps Réel',
      description: 'Suivez vos collectes et points de recyclage en temps réel.',
      image: 'https://plus.unsplash.com/premium_photo-1683133531613-6a7db8847c72?fm=jpg&q=60&w=3000'
    },
    {
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
      title: 'Communauté Engagée',
      description: 'Rejoignez une communauté active de recyclage et contribuez à un avenir plus vert.',
      image: 'https://plus.unsplash.com/premium_photo-1683063005230-ec93739b6dd8?fm=jpg&q=60&w=3000'
    },
    {
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      title: 'Impact Écologique',
      description: 'Mesurez et améliorez votre impact environnemental.',
      image: 'https://plus.unsplash.com/premium_photo-1683072005067-455d56d323b4?fm=jpg&q=60&w=3000'
    }
  ];

  heroImages = [

    'https://plus.unsplash.com/premium_photo-1663039947303-0fad26f737b8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1614201991207-765637dd6183?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1663091375659-94b729df2491?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1613166093303-e0dfaa9442b4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1663040117567-ab8441cb7b04?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1663100085963-5261629872e7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  currentHeroImage = this.heroImages[0];
  currentFeatureState = 'normal';
  parallaxState = 'normal';
  currentImageIndex = 0;

  ngOnInit() {
    this.rotateHeroImages();
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.startDynamicCounters();
    setInterval(() => {
      this.toggleAnimation();
    }, 2000);
  }

  rotateHeroImages() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
      this.currentHeroImage = this.heroImages[this.currentImageIndex];
    }, 5000);
  }

  toggleFeatureState(state: string) {
    this.currentFeatureState = state;
  }

  handleScroll() {
    const scrollPosition = window.scrollY;
    this.parallaxState = scrollPosition > 50 ? 'scrolled' : 'normal';
  }
  toggleAnimation() {
    this.animationState = this.animationState === 'start' ? 'end' : 'start';
  }

  startDynamicCounters() {
    const stats: { [key: string]: number } = {
      "recycled-tons": 1200,
      "community-members": 5000,
      "collectors": 300,
    };
    Object.keys(stats).forEach(id => {
      let count = 0;
      const target = stats[id as keyof typeof stats];
      const interval = setInterval(() => {
        count += Math.ceil(target / 50);
        const element = document.getElementById(id);
        if (element) {
          element.textContent = count.toString();
        }
        if (count >= target) clearInterval(interval);
      }, 50);
    });
  }

  onSubmitContactForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    console.log('Contact Form Submitted:', { name, email, message });
  }
}
