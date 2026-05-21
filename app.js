'use strict';

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. FIX DE SCROLL AL RECARGAR
    // ==========================================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================
    // 2. CURSOR CUSTOMIZADO
    // ==========================================
    const cursor = document.getElementById('cursor');

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = (e.clientX - 40) + 'px';
        cursor.style.top = (e.clientY - 40) + 'px';
    });

    // Actualizamos hoverElements para incluir close modal button
    const hoverElements = document.querySelectorAll('.a, .project-card, .contact, .project-modal-close, .project-modal-link');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.classList.add('mini');
        });
        el.addEventListener('mouseout', () => {
            cursor.classList.remove('mini');
        });
    });

    // ==========================================
    // 3. CARRUSEL DRAG-TO-SCROLL AVANZADO
    // ==========================================
    const slider = document.getElementById('slider-track');
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false; 

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false; 
            slider.style.scrollBehavior = 'auto'; 
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cursor.classList.add('mini');
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
            cursor.classList.remove('mini');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
            cursor.classList.remove('mini');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            
            if (Math.abs(walk) > 5) {
                isDragging = true;
            }
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // ==========================================
    // 4. LÓGICA DEL MODAL DE PROYECTOS (DRY)
    // ==========================================
    const projectCards = document.querySelectorAll('.project-card');
    const modalOverlay = document.getElementById('project-modal');
    const btnClose = document.getElementById('modal-close');
    
    // Elementos internos del modal a rellenar
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mStack = document.getElementById('modal-stack');
    const mLink = document.getElementById('modal-link');
    const mImg = document.getElementById('modal-img');

    // Función para abrir modal
    const openModal = (card) => {
        // Obtenemos los datos del dataset del HTML
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const stack = card.getAttribute('data-stack');
        const link = card.getAttribute('data-link');
        const img = card.getAttribute('data-img');

        // Inyectamos los datos en el modal maestro
        mTitle.textContent = title;
        mDesc.textContent = desc;
        mStack.textContent = stack;
        mImg.src = img;
        mImg.alt = title;

        // Lógica para mostrar/ocultar el botón dependiendo si hay enlace (Ej: NextAI)
        if(link && link.trim() !== "" && link !== "#") {
            mLink.style.display = 'inline-block';
            mLink.href = link;
        } else {
            mLink.style.display = 'none';
        }

        // Mostramos el modal y bloqueamos scroll en el body
        modalOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    // Función para cerrar modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        // Limpiamos la imagen después de la animación para que no se vea el proyecto anterior al abrir uno nuevo
        setTimeout(() => {
            if(!modalOverlay.classList.contains('active')) mImg.src = "";
        }, 400);
    };

    // Asignar eventos click a cada tarjeta
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevenir abrir el modal si el usuario estaba haciendo Drag/Swipe en el carrusel
            if (isDragging) {
                e.preventDefault();
                return;
            }
            openModal(card);
        });
    });

    // Cerrar modal al clickear el botón 'X'
    if(btnClose) {
        btnClose.addEventListener('click', closeModal);
    }

    // Cerrar modal al clickear en el overlay (fondo oscuro)
    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

});