emailjs.init('fhC9dhkDtzCchQN8p');

function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#3c3836',
        color: '#d4be98',
        border: '2px solid #7c6f64',
        padding: '14px 28px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: '9999',
        opacity: '1',
        transition: 'opacity 0.3s ease',
        boxShadow: '5px 5px 0 #7c6f64',
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showAlert(errors) {
    const existing = document.querySelector('.alert-popup-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'alert-popup-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000',
        fontFamily: '"JetBrains Mono", monospace',
    });

    const popup = document.createElement('div');
    Object.assign(popup.style, {
        backgroundColor: '#3c3836',
        border: '2px solid #ea6962',
        padding: '32px',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '8px 8px 0 rgba(0,0,0,0.4)',
        position: 'relative',
    });

    const closeDot = document.createElement('span');
    closeDot.textContent = '•';
    Object.assign(closeDot.style, {
        position: 'absolute',
        top: '8px',
        right: '12px',
        color: '#ea6962',
        fontSize: '33px',
        cursor: 'pointer',
        lineHeight: '1',
    });
    closeDot.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    });

    const list = document.createElement('div');
    list.style.cssText = 'text-align:left;';

    errors.forEach(msg => {
        const item = document.createElement('div');
        item.style.cssText = 'color:#ea6962;font-size:13px;padding:4px 0;';
        item.textContent = '• ' + msg;
        list.appendChild(item);
    });

    popup.appendChild(closeDot);
    popup.appendChild(list);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease';
    requestAnimationFrame(() => overlay.style.opacity = '1');

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    }, 10000);
}

function clearErrors(form) {
    form.querySelectorAll('.error-input').forEach(el => {
        el.classList.remove('error-input');
        el.style.borderColor = '';
    });
}

function markError(input) {
    input.classList.add('error-input');
    input.style.borderColor = '#ea6962';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(form) {
    clearErrors(form);
    const errors = [];
    const fields = form.querySelectorAll('[name]');

    fields.forEach(field => {
        const val = field.value.trim();
        const name = field.getAttribute('name');

        if (!val && name !== 'objective') {
            errors.push(name.charAt(0).toUpperCase() + name.slice(1) + ' is required.');
            markError(field);
        } else if (name === 'email' && val && !isValidEmail(val)) {
            errors.push('Please enter a valid email address.');
            markError(field);
        } else if (name === 'name' && val && !/^[a-zA-ZÀ-ÿ\s'.-]+$/.test(val)) {
            errors.push('Name can only contain letters, spaces, hyphens, and apostrophes.');
            markError(field);
        } else if (name === 'objective' && !val) {
            const trigger = field.closest('.custom-select').querySelector('.custom-select-trigger');
            errors.push('Please select an objective.');
            markError(trigger);
        }
    });

    if (errors.length) {
        showAlert(errors);
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.custom-select');

    selects.forEach(el => {
        const trigger = el.querySelector('.custom-select-trigger');
        const options = el.querySelector('.custom-select-options');
        const hidden = el.querySelector('input[type="hidden"]');

        trigger.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = !options.classList.contains('hidden');
            closeAll();
            if (!isOpen) options.classList.remove('hidden');
        });

        options.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const span = trigger.querySelector('span');
                span.textContent = li.textContent;
                span.style.color = li.dataset.value ? 'var(--text)' : 'var(--border)';
                if (hidden) hidden.value = li.dataset.value;
                options.classList.add('hidden');
                trigger.classList.remove('error-input');
                trigger.style.borderColor = '';
            });
        });
    });

    function closeAll() {
        document.querySelectorAll('.custom-select-options').forEach(el => el.classList.add('hidden'));
    }

    document.addEventListener('click', closeAll);

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!validateForm(contactForm)) return;
            emailjs.sendForm('service_pj0d08d', 'template_lertr58', contactForm)
                .then(() => {
                    contactForm.reset();
                    showToast('Message sent successfully!');
                })
                .catch(() => showToast('Something went wrong. Please try again.'));
        });
    }

    const homeForm = document.getElementById('home-form');
    if (homeForm) {
        homeForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!validateForm(homeForm)) return;
            emailjs.sendForm('service_pj0d08d', 'template_sv27npw', homeForm)
                .then(() => {
                    homeForm.reset();
                    const select = homeForm.querySelector('.custom-select');
                    if (select) {
                        const trigger = select.querySelector('.custom-select-trigger span');
                        const hidden = select.querySelector('input[type="hidden"]');
                        trigger.textContent = 'Select an objective';
                        trigger.style.color = 'var(--border)';
                        trigger.style.borderColor = '';
                        trigger.classList.remove('error-input');
                        if (hidden) hidden.value = '';
                    }
                    showToast('Request submitted successfully!');
                })
                .catch(() => showToast('Something went wrong. Please try again.'));
        });
    }
});
