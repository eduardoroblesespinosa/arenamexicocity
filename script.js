document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const modal = document.getElementById('ticket-modal');
    const closeModalButton = document.querySelector('.close-button');
    const totalPriceEl = modal.querySelector('#total-price-modal');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    let currentEvent = null;
    let paypalButtons = null;

    const concerts = [
        {
            artist: "Fuego Primordial",
            date: "15 de Mayo, 2026",
            time: "20:00",
            venue: "Activación de la voluntad, identidad y energía masculina sagrada Arena Ciudad de México",
            prices: { general: 65.00, vip: 150.00 },
            image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
        },
        {
            artist: "Agua Solar",
            date: "22 de Junio, 2026",
            time: "21:00",
            venue: "Apertura del corazón, emoción colectiva y energía femenina elevada Arena Ciudad de México",
            prices: { general: 55.00, vip: 130.00 },
            image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
        },
        {
            artist: "Espejo Cósmico",
            date: "18 de Julio, 2026",
            time: "20:30",
            venue: "Reflexión espiritual, despertar masivo y alineación con el Yo Superior Arena Ciudad de México",
            prices: { general: 70.00, vip: 165.00 },
            image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800'
        },
        {
            artist: "Raíz de la Tierra",
            date: "05 de Agosto, 2026",
            time: "19:00",
            venue: "Reconexión con el cuerpo, la abundancia y la vida encarnada Arena Ciudad de México",
            prices: { general: 50.00, vip: 120.00 },
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
        },
        {
            artist: "Ascensión de la Luz",
            date: "10 de Septiembre, 2026",
            time: "21:00",
            venue: "Integración de todas las energías, activación colectiva planetaria Arena Ciudad de México",
            prices: { general: 75.00, vip: 180.00 },
            image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
        }
    ];

    function renderEvents() {
        eventsContainer.innerHTML = '';
        concerts.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <img src="${event.image}" alt="Concierto de ${event.artist}" class="event-image">
                <div class="event-info">
                    <h3 class="event-artist">${event.artist}</h3>
                    <p class="event-date">${event.date} - ${event.time}</p>
                    <p class="event-venue">${event.venue}</p>
                    <button class="buy-tickets-btn" data-event-index="${index}">Comprar Boletos</button>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }
    
    function openModal(eventIndex) {
        currentEvent = concerts[eventIndex];
        
        document.getElementById('modal-artist-name').textContent = currentEvent.artist;
        document.getElementById('modal-event-details').textContent = `${currentEvent.date} - ${currentEvent.time} | ${currentEvent.venue}`;
        
        const generalPriceEl = document.getElementById('modal-general-price');
        const vipPriceEl = document.getElementById('modal-vip-price');
        generalPriceEl.textContent = `$${currentEvent.prices.general.toFixed(2)}`;
        vipPriceEl.textContent = `$${currentEvent.prices.vip.toFixed(2)}`;
        
        const quantityInputs = modal.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => input.value = 0);
        
        updateTotalPrice();
        
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('visible'), 10);
    }
    
    function closeModal() {
        modal.classList.remove('visible');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    function updateTotalPrice() {
        if (!currentEvent) return;
        
        let total = 0;
        const quantityInputs = modal.querySelectorAll('.quantity-input');
        
        quantityInputs.forEach(input => {
            const ticketType = input.dataset.ticketType;
            const price = currentEvent.prices[ticketType];
            const quantity = parseInt(input.value) || 0;
            total += price * quantity;
        });
        
        totalPriceEl.textContent = total.toFixed(2);
        
        renderPayPalButton(total);
    }

    function renderPayPalButton(total) {
        paypalButtonContainer.innerHTML = '';
        if (total > 0 && typeof paypal !== 'undefined') {
             paypalButtons = paypal.Buttons({
                createOrder: function(data, actions) {
                    const quantityInputs = modal.querySelectorAll('.quantity-input');
                    const generalQty = parseInt(quantityInputs[0].value) || 0;
                    const vipQty = parseInt(quantityInputs[1].value) || 0;

                    const items = [];
                    if (generalQty > 0) {
                        items.push({
                            name: `Boleto General - ${currentEvent.artist}`,
                            unit_amount: { value: currentEvent.prices.general.toFixed(2), currency_code: 'USD' },
                            quantity: generalQty.toString()
                        });
                    }
                    if (vipQty > 0) {
                         items.push({
                            name: `Boleto VIP - ${currentEvent.artist}`,
                            unit_amount: { value: currentEvent.prices.vip.toFixed(2), currency_code: 'USD' },
                            quantity: vipQty.toString()
                        });
                    }

                    return actions.order.create({
                        purchase_units: [{
                            description: `Boletos para ${currentEvent.artist}`,
                            amount: {
                                value: total.toFixed(2),
                                currency_code: 'USD',
                                breakdown: {
                                    item_total: {
                                        value: total.toFixed(2),
                                        currency_code: 'USD'
                                    }
                                }
                            },
                            items: items
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        const total = details.purchase_units[0].amount.value;
                        alert(`¡Gracias por tu compra para ${currentEvent.artist}! Tu pago de $${total} ha sido procesado.\nID de transacción: ${details.id}`);
                        closeModal();
                    });
                },
                onError: function(err) {
                    console.error('Ocurrió un error en el proceso de pago de PayPal:', err);
                    alert('Ocurrió un error con el pago. Por favor, inténtalo de nuevo.');
                },
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay'
                }
            });
            if (paypalButtons.isEligible()) {
                 paypalButtons.render('#paypal-button-container');
            } else {
                paypalButtonContainer.innerHTML = "PayPal no está disponible.";
            }
        }
    }
    
    // Event Listeners
    eventsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-tickets-btn')) {
            const eventIndex = e.target.dataset.eventIndex;
            openModal(eventIndex);
        }
    });

    closeModalButton.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modal.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('quantity-btn')) {
            const input = target.classList.contains('plus')
                ? target.previousElementSibling
                : target.nextElementSibling;
            let value = parseInt(input.value);

            if (target.classList.contains('plus')) {
                value++;
            } else if (value > 0) {
                value--;
            }
            input.value = value;
            updateTotalPrice();
        }
    });
    
    modal.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            if (parseInt(e.target.value) < 0 || e.target.value === '') {
                e.target.value = 0;
            }
            updateTotalPrice();
        }
    });

    modal.querySelector('#buy-btn').addEventListener('click', () => {
        const total = parseFloat(modal.querySelector('#total-price').textContent);
        if (total > 0) {
            alert(`¡Gracias por tu compra para ${currentEvent.artist}! Total: $${total.toFixed(2)}`);
            closeModal();
        } else {
            alert('Por favor, selecciona al menos un boleto.');
        }
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const subject = `Mensaje de ${name} (${email}) desde el sitio web`;
            
            // The user provided email had a space, which is invalid. It has been removed.
            const recipientEmail = 'eduardoroblesespinosa@hotmail.com';
            
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            
            window.location.href = mailtoLink;

            // Optionally, reset the form after submission attempt
            contactForm.reset();
        });
    }

    renderEvents();
});
