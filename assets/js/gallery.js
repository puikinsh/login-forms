// Progressive enhancement: screenshots, demo links, and ZIP downloads work without JS.
(() => {
    const tools = document.querySelector('.gallery-tools');
    const search = document.getElementById('form-search');
    const category = document.getElementById('category-filter');
    const clear = document.getElementById('clear-filters');
    const collection = document.getElementById('collection-filter');
    const compareFavorites = document.getElementById('compare-favorites');
    const shareFavorites = document.getElementById('share-favorites');
    const saveShortlist = document.getElementById('save-shortlist');
    const favoritesStatus = document.getElementById('favorites-status');
    const shortlistFallback = document.getElementById('shortlist-share-fallback');
    const shortlistLink = document.getElementById('shortlist-link');
    const results = document.getElementById('gallery-results');
    const empty = document.getElementById('empty-state');
    const sections = [...document.querySelectorAll('.category')];
    const cards = [...document.querySelectorAll('.form-card')].map(element => ({
        element,
        slug: element.dataset.slug,
        name: element.querySelector('.form-title').textContent,
        category: element.closest('.category').dataset.category,
        text: [...element.querySelectorAll('.form-title, .form-description, .form-features')]
            .map(node => node.textContent).join(' ').toLocaleLowerCase(),
    }));

    const listSelect = document.getElementById('saved-list');
    const listEditor = document.getElementById('list-editor');
    const listName = document.getElementById('list-name');
    const listError = document.getElementById('list-name-error');
    const deleteConfirm = document.getElementById('list-delete-confirm');
    const listsKey = 'login-forms:lists:v1';
    let lists = [];
    let activeListId = '';
    let sharedName = '';
    let editorMode = 'create';
    let editorTarget = '';
    let editorSource = [];
    let editorOpener;
    const activeList = () => lists.find(list => list.id === activeListId);
    const cleanName = name => typeof name === 'string' ? name.trim().slice(0, 60) : '';
    function readLists(raw) {
        try {
            const data = JSON.parse(raw || '{}');
            const ids = new Set();
            const names = new Set();
            const valid = (Array.isArray(data.lists) ? data.lists : []).filter(list => {
                if (!list || typeof list.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(list.id)) return false;
                const name = cleanName(list.name).toLocaleLowerCase();
                if (!name || ids.has(list.id) || names.has(name)) return false;
                ids.add(list.id); names.add(name);
                return true;
            }).map(list => ({ id: list.id, name: cleanName(list.name), forms: [...sanitize(list.forms)] }));
            return { lists: valid, selected: valid.some(list => list.id === data.selected) ? data.selected : '' };
        } catch { return { lists: [], selected: '' }; }
    }

    const storageKey = 'login-forms:favorites:v1';
    const known = new Set(cards.map(card => card.slug));
    const sanitize = values => new Set(Array.isArray(values) ? values.filter(value => known.has(value)) : []);
    let favorites = new Set();
    let sharedShortlist = new Set();
    let refreshChoices = () => {};
    try { favorites = sanitize(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { /* Storage may be blocked or malformed. */ }
    try {
        const stored = readLists(localStorage.getItem(listsKey));
        lists = stored.lists;
        activeListId = stored.selected;
    } catch { /* Named lists also work for this visit when storage is blocked. */ }
    const selectedShortlist = () => collection.value === 'saved' ? new Set(activeList()?.forms || [])
        : collection.value === 'shortlist' ? sharedShortlist : favorites;
    const ordered = selected => cards.filter(card => selected.has(card.slug)).map(card => card.slug);

    function updateFavorites() {
        for (const card of cards) {
            const saved = favorites.has(card.slug);
            card.favorite.setAttribute('aria-pressed', String(saved));
            card.favorite.textContent = saved ? '★ Favorited' : '☆ Favorite';
        }
        document.getElementById('favorites-count').textContent = `${favorites.size} ${favorites.size === 1 ? 'favorite' : 'favorites'}`;
        const selected = activeList();
        const options = [new Option('Choose a list', ''), ...lists.map(list => new Option(list.name, list.id))];
        listSelect.replaceChildren(...options);
        listSelect.value = selected?.id || '';
        listSelect.parentElement.hidden = lists.length === 0;
        collection.querySelector('[value="saved"]').disabled = !selected;
        if (collection.value === 'saved' && !selected) collection.value = 'all';
        for (const id of ['rename-list', 'delete-list', 'browse-list']) {
            document.getElementById(id).disabled = !selected;
            document.getElementById(id).hidden = lists.length === 0;
        }
        for (const card of cards) {
            card.listButton.hidden = !selected;
            const included = selected?.forms.includes(card.slug) || false;
            card.listButton.textContent = `${included ? 'Remove from' : 'Add to'} ${selected?.name || 'list'}`;
            card.listButton.setAttribute('aria-label', `${included ? 'Remove' : 'Add'} ${card.name} ${included ? 'from' : 'to'} ${selected?.name || 'list'}`);
            card.listButton.setAttribute('aria-pressed', String(included));
        }
        const shared = collection.value === 'shortlist';
        const named = collection.value === 'saved';
        const sharedLabel = document.getElementById('shared-list-label');
        sharedLabel.hidden = !shared || !sharedName;
        sharedLabel.textContent = `Shared shortlist: ${sharedName}. Use New list to save a named copy.`;
        document.getElementById('named-list-help').textContent = selected
            ? `${selected.name}: ${selected.forms.length} forms. Use Add forms to browse the full gallery and change this list.`
            : 'Create a list from your current favorites or shared shortlist, then use Add forms to edit its collection.';
        compareFavorites.textContent = named ? 'Compare list' : shared ? 'Compare shortlist' : 'Compare favorites';
        shareFavorites.textContent = named ? 'Share list' : shared ? 'Share shortlist' : 'Share favorites';
        compareFavorites.disabled = selectedShortlist().size < 2;
        shareFavorites.disabled = selectedShortlist().size === 0;
        saveShortlist.hidden = !shared;
        saveShortlist.disabled = [...sharedShortlist].every(slug => favorites.has(slug));
        refreshChoices();
    }

    function persistFavorites() {
        let saved = true;
        try { localStorage.setItem(storageKey, JSON.stringify(ordered(favorites))); } catch { saved = false; }
        favoritesStatus.textContent = saved ? 'Favorites saved in this browser.' : 'Browser storage is unavailable. Favorites last for this visit; share a link to keep them.';
        shortlistFallback.hidden = true;
        updateFavorites();
        filter();
    }

    for (const card of cards) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary favorite-toggle';
        button.setAttribute('aria-label', `Favorite ${card.name}`);
        button.addEventListener('click', () => {
            if (favorites.has(card.slug)) favorites.delete(card.slug);
            else favorites.add(card.slug);
            persistFavorites();
            // Removing the focused card from a filtered list must not lose keyboard focus.
            if (card.element.hidden) collection.focus();
        });
        const listButton = document.createElement('button');
        listButton.type = 'button';
        listButton.className = 'btn btn-secondary list-toggle';
        listButton.hidden = true;
        listButton.addEventListener('click', () => {
            const list = activeList();
            if (!list) return;
            const members = new Set(list.forms);
            if (members.has(card.slug)) members.delete(card.slug);
            else members.add(card.slug);
            list.forms = ordered(members);
            persistLists();
            if (card.element.hidden) collection.focus();
        });
        card.listButton = listButton;
        card.element.querySelector('.form-actions').appendChild(listButton);
        card.favorite = button;
        card.element.querySelector('.form-actions').appendChild(button);
    }

    for (const section of sections) {
        category.add(new Option(section.dataset.label, section.dataset.category));
    }

    function filter(updateURL = true) {
        const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
        let count = 0;
        for (const card of cards) {
            const matches = (collection.value === 'all' || selectedShortlist().has(card.slug))
                && (category.value === 'all' || category.value === card.category)
                && words.every(word => card.text.includes(word));
            card.element.hidden = !matches;
            if (matches) count++;
        }
        for (const section of sections) {
            section.hidden = !section.querySelector('.form-card:not([hidden])');
        }
        results.textContent = `${count} ${count === 1 ? 'form' : 'forms'}${count === cards.length ? '' : ` of ${cards.length}`}`;
        empty.hidden = count !== 0;
        clear.disabled = !search.value && category.value === 'all' && collection.value === 'all';
        if (updateURL) {
            const url = new URL(location.href);
            if (search.value.trim()) url.searchParams.set('q', search.value.trim());
            else url.searchParams.delete('q');
            if (category.value !== 'all') url.searchParams.set('category', category.value);
            else url.searchParams.delete('category');
            if (collection.value !== 'all') url.searchParams.set('collection', collection.value);
            else url.searchParams.delete('collection');
            if (activeList() && collection.value === 'saved') url.searchParams.set('list', activeListId);
            else url.searchParams.delete('list');
            // Some file viewers disallow History API updates; filtering still works.
            try { history.replaceState(null, '', url); } catch { /* Keep local-file browsing functional. */ }
        }
    }

    function restoreFilters() {
        const params = new URLSearchParams(location.search);
        search.value = params.get('q') || '';
        const selected = params.get('category');
        category.value = sections.some(section => section.dataset.category === selected) ? selected : 'all';
        sharedShortlist = sanitize((params.get('shortlist') || '').split(','));
        collection.querySelector('[value="shortlist"]').disabled = sharedShortlist.size === 0;
        sharedName = cleanName(params.get('name'));
        const requestedList = params.get('list');
        if (lists.some(list => list.id === requestedList)) activeListId = requestedList;
        const view = params.get('collection');
        collection.value = view === 'favorites' || (view === 'saved' && activeList()) || (view === 'shortlist' && sharedShortlist.size) ? view : 'all';
        updateFavorites();
        filter(false);
    }

    function persistLists(message = 'Named lists saved in this browser.') {
        try { localStorage.setItem(listsKey, JSON.stringify({ lists, selected: activeListId })); }
        catch { message = 'Browser storage is unavailable. Named lists last for this visit; share a link to keep them.'; }
        favoritesStatus.textContent = message;
        shortlistFallback.hidden = true;
        updateFavorites();
        filter();
    }

    function closeEditor(restoreFocus = true) {
        listEditor.hidden = true;
        deleteConfirm.hidden = true;
        listError.textContent = '';
        listName.removeAttribute('aria-invalid');
        if (restoreFocus) (editorOpener?.disabled ? document.getElementById('new-list') : editorOpener)?.focus();
    }

    function editList(mode, opener) {
        closeEditor(false);
        editorOpener = opener;
        editorMode = mode;
        editorTarget = activeListId;
        editorSource = ordered(selectedShortlist());
        listName.value = mode === 'rename' ? activeList().name : collection.value === 'shortlist' ? sharedName : '';
        document.getElementById('save-list-name').textContent = mode === 'rename' ? 'Save name' : 'Create list';
        listEditor.hidden = false;
        listName.focus();
    }
    document.getElementById('new-list').addEventListener('click', event => editList('create', event.currentTarget));
    document.getElementById('rename-list').addEventListener('click', event => editList('rename', event.currentTarget));
    document.getElementById('cancel-list-editor').addEventListener('click', () => closeEditor());
    listEditor.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closeEditor(); }
    });
    listEditor.addEventListener('submit', event => {
        event.preventDefault();
        const name = cleanName(listName.value);
        const target = lists.find(list => list.id === editorTarget);
        let error = !name ? 'Enter a list name.' : '';
        if (lists.some(list => list.name.toLocaleLowerCase() === name.toLocaleLowerCase() && (editorMode === 'create' || list.id !== editorTarget))) error = 'Choose a different name; a list already uses this name.';
        if (editorMode === 'rename' && !target) error = 'This list was deleted in another tab. Cancel and choose another list.';
        if (error) {
            listError.textContent = error;
            listName.setAttribute('aria-invalid', 'true');
            listName.focus();
            return;
        }
        if (editorMode === 'rename') target.name = name;
        else {
            activeListId = `list-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
            lists.push({ id: activeListId, name, forms: editorSource });
        }
        collection.querySelector('[value="saved"]').disabled = false;
        collection.value = 'saved';
        search.value = ''; category.value = 'all';
        closeEditor(false);
        persistLists();
        listSelect.focus();
    });
    document.getElementById('delete-list').addEventListener('click', event => {
        closeEditor(false);
        editorOpener = event.currentTarget;
        editorTarget = activeListId;
        document.getElementById('delete-list-name').textContent = activeList().name;
        deleteConfirm.hidden = false;
        document.getElementById('cancel-delete-list').focus();
    });
    document.getElementById('cancel-delete-list').addEventListener('click', () => closeEditor());
    document.getElementById('confirm-delete-list').addEventListener('click', () => {
        lists = lists.filter(list => list.id !== editorTarget);
        if (activeListId === editorTarget) activeListId = '';
        closeEditor(false);
        persistLists('Named list deleted.');
        (lists.length ? listSelect : document.getElementById('new-list')).focus();
    });
    listSelect.addEventListener('change', () => {
        closeEditor(false);
        activeListId = listSelect.value;
        collection.querySelector('[value="saved"]').disabled = !activeList();
        collection.value = activeList() ? 'saved' : 'all';
        search.value = ''; category.value = 'all';
        persistLists();
    });
    document.getElementById('browse-list').addEventListener('click', () => {
        collection.value = 'all'; search.value = ''; category.value = 'all';
        updateFavorites(); filter(); search.focus();
    });

    search.addEventListener('input', () => filter());
    category.addEventListener('change', () => filter());
    collection.addEventListener('change', () => {
        shortlistFallback.hidden = true;
        updateFavorites();
        filter();
    });
    saveShortlist.addEventListener('click', () => {
        for (const slug of sharedShortlist) favorites.add(slug);
        persistFavorites();
    });
    window.addEventListener('storage', event => {
        if (event.key === listsKey || event.key === null) {
            const stored = readLists(event.key === null ? null : event.newValue);
            lists = stored.lists;
            if (!activeList()) activeListId = '';
            updateFavorites(); filter();
        }
        if (event.key !== storageKey && event.key !== null) return;
        try { favorites = sanitize(JSON.parse(event.newValue || '[]')); } catch { favorites = new Set(); }
        updateFavorites();
        filter(false);
    });
    shareFavorites.addEventListener('click', async () => {
        const url = new URL(location.href);
        url.searchParams.set('shortlist', ordered(selectedShortlist()).join(','));
        url.searchParams.set('collection', 'shortlist');
        url.searchParams.delete('list');
        const name = collection.value === 'saved' ? activeList()?.name : collection.value === 'shortlist' ? sharedName : '';
        if (name) url.searchParams.set('name', name);
        else url.searchParams.delete('name');
        url.searchParams.delete('q');
        url.searchParams.delete('category');
        try {
            await navigator.clipboard.writeText(url.href);
            shortlistFallback.hidden = true;
            favoritesStatus.textContent = 'Shortlist link copied.';
        } catch {
            shortlistLink.value = url.href;
            shortlistFallback.hidden = false;
            shortlistLink.focus();
            shortlistLink.select();
            favoritesStatus.textContent = 'Copy the selected shortlist link.';
        }
    });
    clear.addEventListener('click', () => {
        search.value = '';
        category.value = 'all';
        collection.value = 'all';
        updateFavorites();
        filter();
        search.focus();
    });
    window.addEventListener('popstate', restoreFilters);
    restoreFilters();
    tools.hidden = false;

    const dialog = document.getElementById('form-preview-dialog');
    if (typeof dialog.showModal !== 'function') {
        compareFavorites.hidden = true;
        return;
    }
    const stage = dialog.querySelector('.preview-stage');
    const panes = dialog.querySelector('.preview-panes');
    const title = document.getElementById('preview-title');
    const download = document.getElementById('preview-download');
    const copy = document.getElementById('copy-preview-link');
    const shareFallback = document.getElementById('preview-share-fallback');
    const shareLink = document.getElementById('preview-link');
    const devices = [...dialog.querySelectorAll('[data-device]')];
    const screen = document.getElementById('preview-screen');
    const firstForm = document.getElementById('preview-form');
    const secondForm = document.getElementById('compare-form');
    const status = document.getElementById('preview-status');
    const screens = new Map([
        ['signin', 'index.html'], ['signup', 'sign-up.html'],
        ['request-reset', 'reset-password.html'], ['new-password', 'new-password.html'],
    ]);
    const previewButtons = [...document.querySelectorAll('[data-preview]')];
    const choices = previewButtons.map(button => {
        const card = button.closest('.form-card');
        return { button, slug: button.dataset.preview, name: card.querySelector('.form-title').textContent,
            base: new URL('.', card.querySelector('.form-links a').href), zip: card.querySelector('[download]').href };
    });
    const find = slug => choices.find(choice => choice.slug === slug);
    refreshChoices = () => {
        for (const select of [firstForm, secondForm]) {
            const selected = select.value;
            select.replaceChildren();
            if (select === secondForm) select.add(new Option('No comparison', ''));
            const preferred = new Set([...selectedShortlist(), ...favorites, ...sharedShortlist]);
            const groups = [
                ['Favorites / shortlist', choices.filter(choice => preferred.has(choice.slug))],
                ...sections.map(section => [section.dataset.label, choices.filter(choice =>
                    !preferred.has(choice.slug) && choice.button.closest('.category') === section)]),
            ];
            for (const [label, items] of groups) {
                if (!items.length) continue;
                const group = document.createElement('optgroup');
                group.label = label;
                for (const choice of items) group.appendChild(new Option(choice.name, choice.slug));
                select.appendChild(group);
            }
            select.value = selected;
        }
        for (const option of secondForm.options) option.disabled = option.value === firstForm.value && !!option.value;
    };
    refreshChoices();
    const slots = ['primary', 'secondary'].map((name, index) => ({
        pane: document.getElementById(`${name}-preview-pane`),
        heading: document.getElementById(`${name}-pane-title`),
        download: document.getElementById(`${name}-pane-download`),
        canvas: document.getElementById(`${name}-preview-pane`).querySelector('.preview-canvas'),
        frame: index === 0 ? document.getElementById('preview-frame') : null,
        choice: null, ready: false, target: null,
    }));
    let device = window.innerWidth < 768 ? 'mobile' : 'desktop';
    let opener;
    const active = () => slots.filter(slot => slot.choice);
    const comparing = () => !!slots[1].choice;

    function previewURL() {
        const url = new URL(location.href);
        for (const key of ['preview', 'compare', 'screen', 'device']) url.searchParams.delete(key);
        if (dialog.open && slots[0].choice) {
            url.searchParams.set('preview', slots[0].choice.slug);
            if (comparing()) url.searchParams.set('compare', slots[1].choice.slug);
            url.searchParams.set('screen', screen.value);
            url.searchParams.set('device', device);
        }
        return url;
    }

    function shareablePreviewURL() {
        const url = previewURL();
        if (collection.value === 'saved' && activeList()) {
            url.searchParams.set('shortlist', activeList().forms.join(','));
            url.searchParams.set('name', activeList().name);
            url.searchParams.set('collection', 'shortlist');
            url.searchParams.delete('list');
            url.searchParams.delete('q');
            url.searchParams.delete('category');
        }
        return url;
    }

    function syncURL(push = false) {
        const url = previewURL();
        try {
            if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url);
        } catch { /* Keep sharing usable in local file viewers without History API access. */ }
        shareLink.value = shareablePreviewURL().href;
    }

    function resetShareFeedback() { shareFallback.hidden = true; }

    function describeScreen() {
        const loading = active().some(slot => !slot.ready);
        const label = screen.selectedOptions[0].textContent;
        for (const slot of active()) slot.frame.title = `${slot.choice.name} — ${label} live preview`;
        stage.setAttribute('aria-busy', String(loading));
        const mode = comparing() ? 'comparison' : 'preview';
        status.textContent = loading ? `Loading ${label.toLowerCase()} ${mode}…` : `${label} ${mode} ready.`;
        if (!shareFallback.hidden) status.textContent = 'Copy the selected preview link.';
    }

    function dispose(slot, keepFrame = false) {
        if (slot.frame) {
            // Detach before clearing src so closing a preview preserves Forward history.
            slot.frame.remove();
            slot.frame.removeAttribute('src');
            if (keepFrame) slot.canvas.appendChild(slot.frame);
            else slot.frame = null;
        }
        slot.ready = false;
        slot.target = null;
    }

    function bindFrame(slot) {
        slot.frame.addEventListener('load', () => {
            if (!dialog.open || !slot.choice) return;
            try {
                if (slot.frame.contentWindow.location.href !== slot.target) return;
                slot.ready = true;
                describeScreen();
                syncURL();
                const doc = slot.frame.contentDocument;
                doc.addEventListener('click', event => {
                    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    const link = event.target.closest('a[href]');
                    if (!link || link.target || link.hasAttribute('download')) return;
                    const destination = [...screens].find(([, file]) => new URL(file, slot.choice.base).href === link.href);
                    if (!destination) return;
                    event.preventDefault();
                    screen.value = destination[0];
                    loadScreens();
                }, { capture: true });
                doc.addEventListener('keydown', event => {
                    if (event.key !== 'Escape') return;
                    event.preventDefault();
                    event.stopPropagation();
                    dialog.close();
                }, { capture: true });
            } catch { /* Custom external destinations cannot expose their document. */ }
        });
    }
    bindFrame(slots[0]);

    function loadScreens() {
        resetShareFeedback();
        for (const slot of active()) {
            if (!slot.frame) {
                slot.frame = document.createElement('iframe');
                slot.frame.id = 'compare-frame';
                slot.canvas.appendChild(slot.frame);
                bindFrame(slot);
            }
            const target = new URL(screens.get(screen.value), slot.choice.base).href;
            // Resizing/reselecting a screen retains values in each independent document.
            try { if (slot.ready && slot.frame.contentWindow.location.href === target) continue; } catch { /* Recover from external destinations. */ }
            stage.scrollTop = 0;
            slot.target = target;
            slot.ready = false;
            if (slot.frame.hasAttribute('src')) {
                try {
                    slot.frame.contentWindow.location.replace(target);
                    continue;
                } catch { /* Fall back to a new iframe navigation. */ }
            }
            slot.frame.src = target;
        }
        describeScreen();
        syncURL();
        resizePreview();
    }

    function resizePreview() {
        if (!dialog.open) return;
        const headers = active().map(slot => slot.pane.querySelector('.preview-pane-header'));
        for (const header of headers) header.style.minHeight = '';
        if (comparing()) {
            const height = Math.max(...headers.map(header => header.getBoundingClientRect().height));
            for (const header of headers) header.style.minHeight = `${height}px`;
        }
        const width = device === 'mobile' ? 375 : 1100;
        const height = device === 'mobile' ? 812 : 800;
        for (const slot of active()) {
            if (!slot.frame) continue;
            const scale = Math.min(1, Math.max(1, slot.pane.clientWidth) / width);
            Object.assign(slot.frame.style, { width: `${width}px`, height: `${height}px`, transform: `scale(${scale})` });
            Object.assign(slot.canvas.style, { width: `${width * scale}px`, height: `${height * scale}px` });
        }
        document.getElementById('preview-dimensions').textContent = `${width} × ${height}`;
        for (const button of devices) button.setAttribute('aria-pressed', String(button.dataset.device === device));
    }

    function openPreview(choice, selectedScreen = 'signin', selectedDevice = device, push = true, peer = null) {
        opener = choice.button;
        screen.value = selectedScreen;
        device = selectedDevice;
        if (peer?.slug === choice.slug) peer = null;
        for (const [index, next] of [choice, peer].entries()) {
            const slot = slots[index];
            if (slot.choice?.slug !== next?.slug) {
                if (index === 1 && !next) dispose(slot);
                slot.ready = false;
            }
            slot.choice = next;
            slot.pane.hidden = !next;
            if (next) {
                slot.heading.textContent = next.name;
                slot.download.href = next.zip;
                slot.download.setAttribute('aria-label', `Download ${next.name} ZIP`);
            }
        }
        firstForm.value = choice.slug;
        secondForm.value = peer?.slug || '';
        for (const option of secondForm.options) option.disabled = option.value === choice.slug;
        panes.classList.toggle('is-comparing', comparing());
        for (const slot of slots) slot.pane.querySelector('.preview-pane-header').hidden = !comparing();
        title.textContent = comparing() ? 'Compare forms' : `${choice.name} preview`;
        download.hidden = comparing();
        download.href = choice.zip;
        download.setAttribute('aria-label', `Download ${choice.name} ZIP`);
        document.getElementById('comparison-help').hidden = !comparing();
        stage.setAttribute('aria-label', comparing() ? 'Side-by-side form previews; scroll horizontally on narrow screens' : 'Preview screen');
        if (!dialog.open) dialog.showModal();
        document.body.classList.add('preview-open');
        syncURL(push);
        loadScreens();
        title.focus();
    }

    function restorePreview() {
        const params = new URLSearchParams(location.search);
        const choice = find(params.get('preview'));
        if (!choice) {
            if (dialog.open) dialog.close();
            return;
        }
        const selectedScreen = screens.has(params.get('screen')) ? params.get('screen') : 'signin';
        const selectedDevice = ['desktop', 'mobile'].includes(params.get('device'))
            ? params.get('device') : window.innerWidth < 768 ? 'mobile' : 'desktop';
        openPreview(choice, selectedScreen, selectedDevice, false, find(params.get('compare')));
    }

    for (const choice of choices) {
        choice.button.hidden = false;
        choice.button.addEventListener('click', () => openPreview(choice));
    }
    compareFavorites.addEventListener('click', () => {
        const [first, second] = ordered(selectedShortlist()).map(find);
        if (first && second) openPreview(first, 'signin', device, true, second);
    });
    firstForm.addEventListener('change', () => {
        const choice = find(firstForm.value);
        const peer = slots[1].choice?.slug === choice.slug ? slots[0].choice : slots[1].choice;
        openPreview(choice, screen.value, device, false, peer);
        firstForm.focus();
    });
    secondForm.addEventListener('change', () => {
        openPreview(slots[0].choice, screen.value, device, false, find(secondForm.value));
        secondForm.focus();
    });
    screen.addEventListener('change', loadScreens);
    for (const button of devices) button.addEventListener('click', () => {
        device = button.dataset.device;
        resetShareFeedback();
        describeScreen();
        syncURL();
        resizePreview();
    });
    copy.addEventListener('click', async () => {
        const url = shareablePreviewURL().href;
        try {
            await navigator.clipboard.writeText(url);
            if (dialog.open && shareablePreviewURL().href === url) {
                resetShareFeedback();
                status.textContent = 'Preview link copied.';
            }
        } catch {
            if (!dialog.open || shareablePreviewURL().href !== url) return;
            shareLink.value = url;
            shareFallback.hidden = false;
            shareLink.focus();
            shareLink.select();
            status.textContent = 'Copy the selected preview link.';
        }
    });
    document.getElementById('close-preview').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
        if (dialog.open) return;
        syncURL();
        resetShareFeedback();
        for (const [index, slot] of slots.entries()) {
            dispose(slot, index === 0);
            slot.choice = null;
        }
        status.textContent = '';
        stage.removeAttribute('aria-busy');
        document.body.classList.remove('preview-open');
        (opener?.getClientRects().length ? opener : search).focus();
    });
    new ResizeObserver(resizePreview).observe(stage);
    window.addEventListener('popstate', restorePreview);
    restorePreview();
})();
