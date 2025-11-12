document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('hobby-form');
    const nameInput = document.getElementById('hobby-name');
    const goalInput = document.getElementById('hobby-goal');
    const scheduleSelect = document.getElementById('hobby-schedule');
    const hobbyList = document.getElementById('hobby-items');
    const emptyState = document.getElementById('empty-state');
    const clearButton = document.getElementById('clear-hobbies');

    const STORAGE_KEY = 'myDIY:hobbies';

    const renderHobbies = hobbies => {
        hobbyList.innerHTML = '';

        if (!hobbies.length) {
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;

        hobbies.forEach(hobby => {
            const item = document.createElement('li');
            item.className = `hobby-item${hobby.completed ? ' hobby-item--completed' : ''}`;

            const title = document.createElement('h4');
            title.textContent = hobby.name;

            const meta = document.createElement('div');
            meta.className = 'hobby-item__meta';
            meta.innerHTML = `<span>Goal: ${hobby.goal}</span><span>Cadence: ${hobby.schedule}</span>`;

            const actions = document.createElement('div');
            actions.className = 'hobby-item__actions';

            const toggleButton = document.createElement('button');
            toggleButton.textContent = hobby.completed ? 'Mark In Progress' : 'Mark Complete';
            toggleButton.classList.toggle('complete', !hobby.completed);
            toggleButton.addEventListener('click', () => {
                hobby.completed = !hobby.completed;
                toggleButton.textContent = hobby.completed ? 'Mark In Progress' : 'Mark Complete';
                toggleButton.classList.toggle('complete', !hobby.completed);
                item.classList.toggle('hobby-item--completed', hobby.completed);
                saveHobbies(hobbies);
                renderHobbies(hobbies);
            });

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                const updated = hobbies.filter(h => h.id !== hobby.id);
                saveHobbies(updated);
                renderHobbies(updated);
            });

            actions.append(toggleButton, removeButton);
            item.append(title, meta, actions);
            hobbyList.appendChild(item);
        });
    };

    const loadHobbies = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Failed to parse stored hobbies', error);
            return [];
        }
    };

    const saveHobbies = hobbies => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hobbies));
    };

    const currentHobbies = loadHobbies();
    renderHobbies(currentHobbies);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const newHobby = {
            id: crypto.randomUUID(),
            name: nameInput.value.trim(),
            goal: goalInput.value.trim(),
            schedule: scheduleSelect.value,
            completed: false
        };

        if (!newHobby.name || !newHobby.goal) {
            return;
        }

        const updated = [...loadHobbies(), newHobby];
        saveHobbies(updated);
        renderHobbies(updated);
        form.reset();
        nameInput.focus();
    });

    clearButton.addEventListener('click', () => {
        if (!confirm('Clear all hobbies?')) {
            return;
        }
        saveHobbies([]);
        renderHobbies([]);
    });
});
