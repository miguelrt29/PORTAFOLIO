import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.css',
})
export class Portafolio implements AfterViewChecked {
  name = 'Miguel Angel Reyes Torres';
  currentYear = new Date().getFullYear();
  mobileMenuOpen = false;
  showScrollToBottom = false;

  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;
  private shouldScroll = false;
  private userScrolledUp = false;

  // Contacto
  contactData = { name: '', email: '', message: '' };
  contactStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  contactMessage = '';

  // Chat IA
  chatOpen = false;
  chatInput = '';
  chatLoading = false;
  chatMessages: { role: 'user' | 'ai'; text: string }[] = [
    { role: 'ai', text: '¡Hola! Soy el asistente de Miguel. Puedes preguntarme sobre su experiencia, habilidades o proyectos.' }
  ];



  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.shouldScroll = true;
      this.userScrolledUp = false;
    }
  }

  onChatScroll() {
    if (this.chatMessagesContainer) {
      const el = this.chatMessagesContainer.nativeElement;
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      this.userScrolledUp = distanceToBottom > 50;
    }
  }

  ngAfterViewChecked() {
    if (this.chatMessagesContainer) {
      const el = this.chatMessagesContainer.nativeElement;
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      this.showScrollToBottom = this.userScrolledUp && distanceToBottom > 50;

      if (this.shouldScroll) {
        el.scrollTop = el.scrollHeight;
        this.shouldScroll = false;
      }
    }
  }

  scrollToBottom() {
    if (this.chatMessagesContainer) {
      this.userScrolledUp = false;
      this.shouldScroll = true;
    }
  }

  async sendChatMessage() {
    const input = this.chatInput.trim();
    if (!input || this.chatLoading) return;

    this.chatMessages.push({ role: 'user', text: input });
    this.chatInput = '';
    this.chatLoading = true;
    this.shouldScroll = true;
    this.userScrolledUp = false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${environment.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const reply = result.reply || 'No pude responder, intenta de nuevo.';

      this.shouldScroll = true;
      this.zone.run(() => {
        this.chatMessages.push({ role: 'ai', text: reply });
        this.chatLoading = false;
        this.cdr.detectChanges();
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.zone.run(() => {
        const errorMsg = error.name === 'AbortError' ? 'Tiempo de espera agotado' : error.message;
        this.chatMessages.push({ role: 'ai', text: `Error: ${errorMsg}. Intenta de nuevo.` });
        this.chatLoading = false;
        this.cdr.detectChanges();
      });
    }
  }

  onChatKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendChatMessage();
    }
  }

  onSubmitContact() {
    this.contactStatus = 'sending';
    this.contactMessage = '';
    this.cdr.detectChanges();

    const params = {
      from_name: this.contactData.name,
      from_email: this.contactData.email,
      message: this.contactData.message,
    };

    let resolved = false;

    const done = (ok: boolean) => {
      if (resolved) return;
      resolved = true;
      if (ok) {
        this.contactStatus = 'success';
        this.contactMessage = 'Mensaje enviado correctamente';
        this.contactData = { name: '', email: '', message: '' };
      } else {
        this.contactStatus = 'error';
        this.contactMessage = 'Error al enviar el mensaje. Intenta más tarde.';
      }
      this.cdr.detectChanges();
    };

    import('@emailjs/browser')
      .then(emailjs => emailjs.send(environment.emailjs.serviceId, environment.emailjs.templateId, params, environment.emailjs.publicKey))
      .then(() => done(true))
      .catch((error: any) => {
        console.error('EmailJS error:', JSON.stringify(error));
        done(false);
      });

    setTimeout(() => done(true), 5000);
  }
}