const STORAGE_PREFIX = 'cct_campusmate_v2_';

const defaultState = {
    profile: {
        name: 'Ramesh Acharya',
        email: 'ramesh.acharya@cct.edu.np',
        major: 'BSc.CSIT (Bachelor of Science in Computer Science and Information Technology)',
        year: '3rd Year (6th Semester)',
        avatar: '',
        bio: 'CSIT student at Chitwan College of Technology, Bharatpur. Passionate about software development & AI.'
    },
    assignments: [
        { id: '1', title: 'Compiler Design Lab Report', course: 'CSC351', dueDate: '2026-04-18', status: 'Pending', priority: 'High', image: '' },
        { id: '2', title: 'Artificial Intelligence Neural Network Assignment', course: 'CSC354', dueDate: '2026-04-12', status: 'Completed', priority: 'Medium', image: '' },
        { id: '3', title: 'Computer Networks Socket Programming Project', course: 'CSC352', dueDate: '2026-04-22', status: 'Pending', priority: 'High', image: '' }
    ],
    notices: [
        { id: '1', title: 'CCT Annual IT Hackathon & Tech Fest 2026', category: 'Events', date: '2026-04-14', content: 'Registrations are now open for the CCT Annual Hackathon at the main college auditorium. Exciting cash prizes and internship opportunities!', image: '' },
        { id: '2', title: 'Board Exam Form Notice for BSc.CSIT & BCA', category: 'Academic', date: '2026-04-08', content: 'All regular and partial examinees are required to submit their TU board examination forms by Friday to the administration desk.', image: '' }
    ],
    lostFound: [
        { id: '1', type: 'Lost', item: 'Scientific Calculator (Casio fx-991ES Plus)', location: 'CCT CSIT Lab 2', date: '2026-04-05', contact: 'ramesh.acharya@cct.edu.np', status: 'Active', image: '' },
        { id: '2', type: 'Found', item: 'Black Dell Laptop Charger', location: 'CCT Library Reading Room', date: '2026-04-06', contact: 'frontdesk@cct.edu.np', status: 'Active', image: '' }
    ],
    planner: [
        { id: '1', title: 'Revise Automata Theory Grammars', time: '07:30 - 09:00', day: 'Monday', completed: true },
        { id: '2', title: 'CSIT Project Group Discussion', time: '14:00 - 16:00', day: 'Wednesday', completed: false }
    ],
    cafeteria: [
        { id: '1', name: 'CCT Special Nepali Thakali Khana Set', category: 'Lunch', price: 'Rs. 220', available: true, image: 'https://placehold.co/300x200/16528c/FFFAF0?text=Thakali+Khana' },
        { id: '2', name: 'Masala Chiya & Samosa', category: 'Snacks', price: 'Rs. 50', available: true, image: 'https://placehold.co/300x200/f28c18/FFFAF0?text=Chiya+Samosa' },
        { id: '3', name: 'Veg Chowmein & Cold Drink', category: 'Fast Food', price: 'Rs. 130', available: true, image: 'https://placehold.co/300x200/5AAED6/FFFAF0?text=Veg+Chowmein' }
    ],
    notifications: [
        { id: '1', title: 'Assignment Due Soon', message: 'Compiler Design Lab Report is due in 3 days.', time: '15m ago' },
        { id: '2', title: 'New Notice Posted', message: 'CCT Annual IT Hackathon announcements live.', time: '2h ago' }
    ]
};

function loadState(key) {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : defaultState[key];
}

function saveState(key, value) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

function getStudentInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'S';
}

function getStudentAvatar(profile, size = 150) {
    if (profile && profile.avatar && !profile.avatar.startsWith('https://placehold.co/')) {
        return profile.avatar;
    }
    const initials = encodeURIComponent(getStudentInitials(profile?.name));
    return `https://placehold.co/${size}x${size}/16528c/FFFAF0?text=${initials}`;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium animate-fade-in transition-all ${
        type === 'success' ? 'bg-cctBlue border border-lightBlue' : 'bg-red-600'
    }`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-circle'}" class="w-5 h-5 shrink-0"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function handleImageUpload(fileInputId, callback) {
    const fileInput = document.getElementById(fileInputId);
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        callback('');
    }
}

class Router {
    constructor() {
        this.currentRoute = 'dashboard';
        window.addEventListener('hashchange', () => this.handleHash());
    }

    navigate(route) {
        window.location.hash = route;
    }

    handleHash() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        this.currentRoute = hash;
        this.render();
        this.updateActiveNav();
    }

    updateActiveNav() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const route = btn.getAttribute('data-route');
            if (route === this.currentRoute) {
                btn.className = 'nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all bg-cctBlue text-creamWhite shadow-md';
            } else {
                btn.className = 'nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-700 hover:bg-softBlue hover:text-cctBlue';
            }
        });
    }

    render() {
        const container = document.getElementById('app-view');
        container.innerHTML = '';
        
        switch(this.currentRoute) {
            case 'dashboard': renderDashboard(container); break;
            case 'planner': renderPlanner(container); break;
            case 'assignments': renderAssignments(container); break;
            case 'notices': renderNotices(container); break;
            case 'lostfound': renderLostFound(container); break;
            case 'finder': renderCampusFinder(container); break;
            case 'cafeteria': renderCafeteria(container); break;
            case 'ai': renderCampusAI(container); break;
            case 'help': renderQuickHelp(container); break;
            case 'profile': renderProfile(container); break;
            default: renderDashboard(container); break;
        }
        lucide.createIcons();
        updateSidebarHeader();
    }
}

const router = new Router();

function updateSidebarHeader() {
    const profile = loadState('profile');
    document.getElementById('sidebar-username').innerText = profile.name;
    document.getElementById('sidebar-avatar').src = getStudentAvatar(profile, 40);
    document.getElementById('header-greeting').innerText = `Welcome, ${profile.name.split(' ')[0]}!`;
}

function renderDashboard(container) {
    const assignments = loadState('assignments');
    const notices = loadState('notices');
    const planner = loadState('planner');
    const profile = loadState('profile');

    const pendingAssignments = assignments.filter(a => a.status === 'Pending');

    container.innerHTML = `
        <div class="space-y-6 max-w-7xl mx-auto animate-fade-in">
            <div class="bg-gradient-to-r from-cctBlue via-[#1d64a6] to-lightBlue rounded-3xl p-6 md:p-8 text-creamWhite shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                    <svg class="w-72 h-72" viewBox="0 0 100 100" fill="none">
                        <text x="5" y="72" font-family="Inter, sans-serif" font-weight="800" font-size="64" fill="#FFFFFF">C</text>
                        <text x="45" y="72" font-family="Inter, sans-serif" font-weight="800" font-size="64" fill="#FFFFFF">C</text>
                    </svg>
                </div>
                <div class="space-y-2 text-center md:text-left z-10">
                    <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-creamWhite mb-1">
                        <span class="w-2 h-2 rounded-full bg-cctOrange animate-pulse"></span> Chitwan College of Technology (CCT), Bharatpur
                    </div>
                    <h2 class="text-2xl md:text-3xl font-extrabold">Namaste, ${profile.name}! 🙏</h2>
                    <p class="text-softBlue text-sm md:text-base max-w-xl">You have <span class="font-bold underline text-cctOrange">${pendingAssignments.length} pending assignments</span> this week in your <span class="font-medium">${profile.major.split('(')[0]}</span> program.</p>
                    <div class="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                        <button onclick="router.navigate('planner')" class="bg-cctOrange text-creamWhite px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#e07d12] transition-all flex items-center gap-2">
                            <i data-lucide="calendar-check" class="w-4 h-4"></i> Open Smart Planner
                        </button>
                        <button onclick="router.navigate('ai')" class="bg-white/20 backdrop-blur-md text-creamWhite px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2">
                            <i data-lucide="bot" class="w-4 h-4"></i> Ask CCT AI
                        </button>
                    </div>
                </div>
                <img src="${getStudentAvatar(profile, 150)}" class="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-creamWhite/50 shadow-2xl shrink-0 z-10" alt="Avatar">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex items-center gap-4 hover:border-cctBlue transition-all">
                    <div class="w-12 h-12 rounded-xl bg-softBlue text-cctBlue flex items-center justify-center font-bold">
                        <i data-lucide="book-open" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Pending Assignments</p>
                        <h3 class="text-2xl font-bold text-cctBlue">${pendingAssignments.length}</h3>
                    </div>
                </div>
                <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex items-center gap-4 hover:border-cctBlue transition-all">
                    <div class="w-12 h-12 rounded-xl bg-softBlue text-cctBlue flex items-center justify-center font-bold">
                        <i data-lucide="bell" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">CCT Notices</p>
                        <h3 class="text-2xl font-bold text-cctBlue">${notices.length}</h3>
                    </div>
                </div>
                <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex items-center gap-4 hover:border-cctBlue transition-all">
                    <div class="w-12 h-12 rounded-xl bg-softBlue text-cctBlue flex items-center justify-center font-bold">
                        <i data-lucide="calendar-check" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Planner Tasks</p>
                        <h3 class="text-2xl font-bold text-cctBlue">${planner.length}</h3>
                    </div>
                </div>
                <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex items-center gap-4 hover:border-cctBlue transition-all">
                    <div class="w-12 h-12 rounded-xl bg-cctOrange/15 text-cctOrange flex items-center justify-center font-bold">
                        <i data-lucide="shield-check" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Campus Status</p>
                        <h3 class="text-base font-bold text-emerald-600">Active & Open</h3>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-cctBlue text-lg flex items-center gap-2">
                            <i data-lucide="clock" class="w-5 h-5 text-cctOrange"></i> Upcoming Assignments
                        </h3>
                        <button onclick="router.navigate('assignments')" class="text-xs text-cctBlue font-semibold hover:underline">View All</button>
                    </div>
                    <div class="space-y-3">
                        ${pendingAssignments.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">No pending assignments!</p>' :
                            pendingAssignments.slice(0, 3).map(a => `
                                <div class="flex items-center justify-between p-3.5 rounded-xl bg-softBlue/40 border border-lightBlue/20">
                                    <div>
                                        <h4 class="font-semibold text-sm text-gray-800">${a.title}</h4>
                                        <p class="text-xs text-gray-500">${a.course} • Due ${a.dueDate}</p>
                                    </div>
                                    <span class="text-xs px-2.5 py-1 rounded-full bg-cctBlue text-creamWhite font-medium">${a.priority}</span>
                                </div>
                            `).join('')}
                    </div>
                </div>

                <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-cctBlue text-lg flex items-center gap-2">
                            <i data-lucide="megaphone" class="w-5 h-5 text-cctOrange"></i> Latest CCT Notices
                        </h3>
                        <button onclick="router.navigate('notices')" class="text-xs text-cctBlue font-semibold hover:underline">View All</button>
                    </div>
                    <div class="space-y-3">
                        ${notices.slice(0, 3).map(n => `
                            <div class="p-3.5 rounded-xl bg-softBlue/40 border border-lightBlue/20">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-bold text-cctBlue bg-softBlue px-2 py-0.5 rounded">${n.category}</span>
                                    <span class="text-xs text-gray-400">${n.date}</span>
                                </div>
                                <h4 class="font-semibold text-sm text-gray-800">${n.title}</h4>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPlanner(container) {
    const planner = loadState('planner');

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <div>
                    <h2 class="text-2xl font-bold text-cctBlue">Smart Study Planner</h2>
                    <p class="text-xs text-gray-500">Organize your weekly CCT lectures, lab sessions, and study milestones</p>
                </div>
                <button onclick="openPlannerModal()" class="bg-cctOrange text-creamWhite px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#e07d12] transition-all flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Study Task
                </button>
            </div>

            <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <div class="space-y-3" id="planner-list">
                    ${planner.length === 0 ? '<p class="text-sm text-gray-400 text-center py-8">No tasks scheduled yet. Add one above!</p>' :
                        planner.map(task => `
                            <div class="flex items-center justify-between p-4 rounded-xl bg-softBlue/30 border border-lightBlue/20 hover:border-cctBlue transition-all">
                                <div class="flex items-center gap-3">
                                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="togglePlannerTask('${task.id}')" class="w-5 h-5 rounded text-cctBlue focus:ring-cctBlue cursor-pointer">
                                    <div>
                                        <h4 class="font-semibold text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}">${task.title}</h4>
                                        <p class="text-xs text-gray-500">${task.day} •${task.time}</p>
                                    </div>
                                </div>
                                <button onclick="deletePlannerTask('${task.id}')" class="text-red-500 hover:text-red-700 p-2">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>

        <div id="planner-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-lightBlue/30 p-6 animate-fade-in">
                <h3 class="text-lg font-bold text-cctBlue mb-4">Add Study Task</h3>
                <form onsubmit="handleCreatePlanner(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Task Title</label>
                        <input type="text" id="p-title" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Day of Week</label>
                        <select id="p-day" class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                            <option>Sunday</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Time Slot</label>
                        <input type="text" id="p-time" placeholder="e.g. 10:00 - 11:30" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" onclick="closePlannerModal()" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 rounded-xl text-sm font-semibold text-creamWhite bg-cctBlue hover:bg-[#1d64a6]">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openPlannerModal() { document.getElementById('planner-modal').classList.remove('hidden'); }
function closePlannerModal() { document.getElementById('planner-modal').classList.add('hidden'); }

function handleCreatePlanner(e) {
    e.preventDefault();
    const planner = loadState('planner');
    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('p-title').value,
        day: document.getElementById('p-day').value,
        time: document.getElementById('p-time').value,
        completed: false
    };
    planner.push(newTask);
    saveState('planner', planner);
    closePlannerModal();
    router.render();
    showToast('Study task added successfully!');
}

function togglePlannerTask(id) {
    const planner = loadState('planner');
    const task = planner.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveState('planner', planner);
        router.render();
    }
}

function deletePlannerTask(id) {
    let planner = loadState('planner');
    planner = planner.filter(t => t.id !== id);
    saveState('planner', planner);
    router.render();
    showToast('Task removed', 'error');
}

function renderAssignments(container) {
    const assignments = loadState('assignments');

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <div>
                    <h2 class="text-2xl font-bold text-cctBlue">CCT Assignments Hub</h2>
                    <p class="text-xs text-gray-500">Track and submit CSIT/BCA coursework, lab reports, and projects</p>
                </div>
                <button onclick="openAssignmentModal()" class="bg-cctOrange text-creamWhite px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#e07d12] transition-all flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Assignment
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${assignments.map(a => `
                    <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex flex-col justify-between space-y-4 hover:border-cctBlue transition-all">
                        ${a.image ? `<img src="${a.image}" class="w-full h-36 object-cover rounded-xl border border-lightBlue/20" alt="Assignment attachment">` : ''}
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-cctBlue bg-softBlue px-2.5 py-1 rounded-full">${a.course}</span>
                                <span class="text-xs px-2.5 py-1 rounded-full font-medium ${a.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${a.status}</span>
                            </div>
                            <h3 class="font-bold text-base text-gray-800">${a.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">Due: ${a.dueDate} • Priority: <span class="font-semibold">${a.priority}</span></p>
                        </div>
                        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                            <button onclick="toggleAssignmentStatus('${a.id}')" class="text-xs font-semibold text-cctBlue hover:underline flex items-center gap-1">
                                <i data-lucide="check-circle" class="w-4 h-4"></i> ${a.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                            </button>
                            <button onclick="deleteAssignment('${a.id}')" class="text-red-500 hover:text-red-700">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="assignment-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-lightBlue/30 p-6 animate-fade-in">
                <h3 class="text-lg font-bold text-cctBlue mb-4">Add New Assignment</h3>
                <form onsubmit="handleCreateAssignment(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                        <input type="text" id="a-title" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Course Code</label>
                        <input type="text" id="a-course" placeholder="e.g. CSC351" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Due Date</label>
                        <input type="date" id="a-date" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                        <select id="a-priority" class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                            <option>High</option><option>Medium</option><option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Attachment Photo / Document Screenshot</label>
                        <input type="file" id="a-image" accept="image/*" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-softBlue file:text-cctBlue hover:file:bg-lightBlue/20">
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" onclick="closeAssignmentModal()" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 rounded-xl text-sm font-semibold text-creamWhite bg-cctBlue hover:bg-[#1d64a6]">Create</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openAssignmentModal() { document.getElementById('assignment-modal').classList.remove('hidden'); }
function closeAssignmentModal() { document.getElementById('assignment-modal').classList.add('hidden'); }

function handleCreateAssignment(e) {
    e.preventDefault();
    handleImageUpload('a-image', (imageData) => {
        const assignments = loadState('assignments');
        const newAssignment = {
            id: Date.now().toString(),
            title: document.getElementById('a-title').value,
            course: document.getElementById('a-course').value,
            dueDate: document.getElementById('a-date').value,
            status: 'Pending',
            priority: document.getElementById('a-priority').value,
            image: imageData
        };
        assignments.push(newAssignment);
        saveState('assignments', assignments);
        closeAssignmentModal();
        router.render();
        showToast('Assignment added successfully!');
    });
}

function toggleAssignmentStatus(id) {
    const assignments = loadState('assignments');
    const a = assignments.find(item => item.id === id);
    if (a) {
        a.status = a.status === 'Completed' ? 'Pending' : 'Completed';
        saveState('assignments', assignments);
        router.render();
        showToast('Assignment status updated!');
    }
}

function deleteAssignment(id) {
    let assignments = loadState('assignments');
    assignments = assignments.filter(a => a.id !== id);
    saveState('assignments', assignments);
    router.render();
    showToast('Assignment deleted', 'error');
}

function renderNotices(container) {
    const notices = loadState('notices');

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <div>
                    <h2 class="text-2xl font-bold text-cctBlue">CCT Official Notices & Bulletins</h2>
                    <p class="text-xs text-gray-500">Official updates from faculty, TU exam department, and administration</p>
                </div>
                <button onclick="openNoticeModal()" class="bg-cctOrange text-creamWhite px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#e07d12] transition-all flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> Post Notice
                </button>
            </div>

            <div class="space-y-4">
                ${notices.map(n => `
                    <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-cctBlue bg-softBlue px-3 py-1 rounded-full">${n.category}</span>
                            <span class="text-xs text-gray-400">${n.date}</span>
                        </div>
                        <h3 class="font-bold text-lg text-gray-800">${n.title}</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">${n.content}</p>${n.image ? `<img src="${n.image}" class="w-full max-h-64 object-cover rounded-xl border border-lightBlue/20" alt="Notice attachment">` : ''}
                        <div class="flex justify-end pt-2">
                            <button onclick="deleteNotice('${n.id}')" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                <i data-lucide="trash-2" class="w-4 h-4"></i> Delete Notice
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="notice-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-lightBlue/30 p-6 animate-fade-in">
                <h3 class="text-lg font-bold text-cctBlue mb-4">Post CCT Notice</h3>
                <form onsubmit="handleCreateNotice(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                        <input type="text" id="n-title" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                        <select id="n-cat" class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                            <option>Events</option><option>Academic</option><option>Examination</option><option>Administrative</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Content</label>
                        <textarea id="n-content" rows="3" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Notice Banner / Photo (Optional)</label>
                        <input type="file" id="n-image" accept="image/*" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-softBlue file:text-cctBlue hover:file:bg-lightBlue/20">
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" onclick="closeNoticeModal()" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 rounded-xl text-sm font-semibold text-creamWhite bg-cctBlue hover:bg-[#1d64a6]">Post</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openNoticeModal() { document.getElementById('notice-modal').classList.remove('hidden'); }
function closeNoticeModal() { document.getElementById('notice-modal').classList.add('hidden'); }

function handleCreateNotice(e) {
    e.preventDefault();
    handleImageUpload('n-image', (imageData) => {
        const notices = loadState('notices');
        const newNotice = {
            id: Date.now().toString(),
            title: document.getElementById('n-title').value,
            category: document.getElementById('n-cat').value,
            date: new Date().toISOString().split('T')[0],
            content: document.getElementById('n-content').value,
            image: imageData
        };
        notices.unshift(newNotice);
        saveState('notices', notices);
        closeNoticeModal();
        router.render();
        showToast('CCT notice posted successfully!');
    });
}

function deleteNotice(id) {
    let notices = loadState('notices');
    notices = notices.filter(n => n.id !== id);
    saveState('notices', notices);
    router.render();
    showToast('Notice deleted', 'error');
}

function renderLostFound(container) {
    const lostFound = loadState('lostFound');

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <div>
                    <h2 class="text-2xl font-bold text-cctBlue">CCT Lost & Found Desk</h2>
                    <p class="text-xs text-gray-500">Report missing belongings around campus or list items you found</p>
                </div>
                <button onclick="openLostModal()" class="bg-cctOrange text-creamWhite px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#e07d12] transition-all flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> Report Item
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${lostFound.map(item => `
                    <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm flex flex-col justify-between space-y-4">
                        ${item.image ? `<img src="${item.image}" class="w-full h-36 object-cover rounded-xl border border-lightBlue/20" alt="Item photo">` : ''}
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold px-2.5 py-1 rounded-full ${item.type === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">${item.type}</span>
                                <span class="text-xs text-gray-400">${item.date}</span>
                            </div>
                            <h3 class="font-bold text-base text-gray-800">${item.item}</h3>
                            <p class="text-xs text-gray-500 mt-1"><i data-lucide="map-pin" class="w-3 h-3 inline"></i> ${item.location}</p>
                            <p class="text-xs text-cctBlue font-medium mt-1">Contact: ${item.contact}</p>
                        </div>
                        <div class="flex justify-end pt-2 border-t border-gray-100">
                            <button onclick="deleteLostItem('${item.id}')" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                <i data-lucide="trash-2" class="w-4 h-4"></i> Remove
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="lost-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-lightBlue/30 p-6 animate-fade-in">
                <h3 class="text-lg font-bold text-cctBlue mb-4">Report Lost or Found Item</h3>
                <form onsubmit="handleCreateLost(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Report Type</label>
                        <select id="lf-type" class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                            <option>Lost</option><option>Found</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Item Name</label>
                        <input type="text" id="lf-item" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Location on Campus</label>
                        <input type="text" id="lf-loc" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Contact Email / Phone</label>
                        <input type="text" id="lf-contact" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cctBlue">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Item Photo (Optional)</label>
                        <input type="file" id="lf-image" accept="image/*" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-softBlue file:text-cctBlue hover:file:bg-lightBlue/20">
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" onclick="closeLostModal()" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 rounded-xl text-sm font-semibold text-creamWhite bg-cctBlue hover:bg-[#1d64a6]">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openLostModal() { document.getElementById('lost-modal').classList.remove('hidden'); }
function closeLostModal() { document.getElementById('lost-modal').classList.add('hidden'); }

function handleCreateLost(e) {
    e.preventDefault();
    handleImageUpload('lf-image', (imageData) => {
        const lostFound = loadState('lostFound');
        const newItem = {
            id: Date.now().toString(),
            type: document.getElementById('lf-type').value,
            item: document.getElementById('lf-item').value,
            location: document.getElementById('lf-loc').value,
            date: new Date().toISOString().split('T')[0],
            contact: document.getElementById('lf-contact').value,
            status: 'Active',
            image: imageData
        };
        lostFound.unshift(newItem);
        saveState('lostFound', lostFound);
        closeLostModal();
        router.render();
        showToast('Item reported successfully!');
    });
}

function deleteLostItem(id) {
    let lostFound = loadState('lostFound');
    lostFound = lostFound.filter(i => i.id !== id);
    saveState('lostFound', lostFound);
    router.render();
    showToast('Item report removed', 'error');
}

function renderCampusFinder(container) {
    const places = [
        { name: 'CCT Central Library & Reading Hall', category: 'Study', hours: '07:00 - 20:00', building: 'Main Block, Ground Floor', desc: 'Extensive collection of CSIT, BCA, BBS textbooks, journals, and quiet individual reading desks.' },
        { name: 'Advanced Computer & IT Labs', category: 'Academic', hours: '08:00 - 18:00', building: 'IT Wing, 2nd Floor', desc: 'High-performance workstations configured for programming, networking, and database labs.' },
        { name: 'CCT Auditorium & Seminar Hall', category: 'Events', hours: '09:00 - 17:00', building: 'Block B, 3rd Floor', desc: 'Venue for workshops, guest lectures, hackathons, and cultural programs.' },
        { name: 'Administration & Account Desk', category: 'Services', hours: '10:00 - 16:00', building: 'Main Entrance Block', desc: 'Fee payments, TU registration, ID cards, and scholarship inquiries.' },
        { name: 'CCT Sports Ground & Canteen', category: 'Recreation', hours: '06:00 - 18:00', building: 'North Campus Grounds', desc: 'Basketball court, football practice area, and hygienic student cafeteria.' }
    ];

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm">
                <h2 class="text-2xl font-bold text-cctBlue mb-1">CCT Campus Map & Building Directory</h2>
                <p class="text-xs text-gray-500">Locate academic blocks, labs, and administrative offices at Chitwan College of Technology, Bharatpur</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${places.map(p => `
                    <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm space-y-3 hover:border-cctBlue transition-all">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-cctBlue bg-softBlue px-3 py-1 rounded-full">${p.category}</span>
                            <span class="text-xs text-emerald-600 font-semibold">${p.hours}</span>
                        </div>
                        <h3 class="font-bold text-lg text-gray-800">${p.name}</h3>
                        <p class="text-xs text-gray-500 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-4 h-4 text-cctOrange"></i> ${p.building}</p>
                        <p class="text-sm text-gray-600">${p.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCafeteria(container) {
    const cafeteria = loadState('cafeteria');

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-cctBlue">CCT Student Canteen Menu</h2>
                    <p class="text-xs text-gray-500">Fresh and hygienic meals, snacks, and refreshments available daily</p>
                </div>
                <span class="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-full">Canteen Open Now</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${cafeteria.map(item => `
                    <div class="bg-surface p-5 rounded-2xl border border-lightBlue/20 shadow-sm space-y-3">
                        <img src="${item.image}" class="w-full h-40 object-cover rounded-xl border border-lightBlue/20" alt="${item.name}" onerror="this.src='https://placehold.co/300x200/16528c/FFFAF0?text=CCT+Canteen'">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-cctBlue bg-softBlue px-2.5 py-1 rounded-full">${item.category}</span>
                            <span class="font-bold text-cctOrange text-base">${item.price}</span>
                        </div>
                        <h3 class="font-bold text-base text-gray-800">${item.name}</h3>
                        <p class="text-xs text-emerald-600 font-medium">✓ Available Today</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCampusAI(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-surface rounded-2xl border border-lightBlue/20 shadow-sm overflow-hidden animate-fade-in">
            <div class="p-4 bg-softBlue/50 border-b border-lightBlue/20 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cctBlue text-creamWhite flex items-center justify-center font-bold">
                    <i data-lucide="bot" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="font-bold text-cctBlue text-base">CCT Assistant AI</h3>
                    <p class="text-xs text-gray-500">Ask anything about CCT courses, TU board exams, faculty, or campus life</p>
                </div>
            </div>

            <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-cctBlue text-creamWhite flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                    <div class="bg-softBlue/60 text-gray-800 p-3.5 rounded-2xl rounded-tl-none text-sm max-w-xl">
                        Namaste! I am your CCT AI guide. How can I help you with your CSIT, BCA, or BBS studies today?
                    </div>
                </div>
            </div>

            <div class="p-4 border-t border-lightBlue/20 bg-surface">
                <form onsubmit="handleAISubmit(event)" class="flex gap-2">
                    <input type="text" id="ai-input" placeholder="Ask about CCT courses, exams, library..." required class="flex-1 bg-softBlue/40 border border-lightBlue/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cctBlue">
                    <button type="submit" class="bg-cctOrange text-creamWhite px-5 py-3 rounded-xl font-bold text-sm shadow hover:bg-[#e07d12] transition-all flex items-center gap-2">
                        <i data-lucide="send" class="w-4 h-4"></i> Send
                    </button>
                </form>
            </div>
        </div>
    `;
}

function handleAISubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    if (!message) return;

    const chatContainer = document.getElementById('ai-chat-messages');
    
    chatContainer.innerHTML += `
        <div class="flex items-start gap-3 justify-end">
            <div class="bg-cctBlue text-creamWhite p-3.5 rounded-2xl rounded-tr-none text-sm max-w-xl">
                ${message}
            </div>
        </div>
    `;
    input.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
        let response = "That's a great question regarding CCT. Please feel free to visit the college front desk or check the official notice board for precise updates.";
        const lower = message.toLowerCase();
        if (lower.includes('library')) response = "The CCT Central Library is located in the Main Block and is open daily from 07:00 to 20:00.";
        else if (lower.includes('exam') || lower.includes('tu')) response = "Tribhuvan University (TU) board examination forms are managed through the CCT administration department. Please ensure timely submission.";
        else if (lower.includes('csit') || lower.includes('bca')) response = "CCT offers premier BSc.CSIT and BCA programs with state-of-the-art computer labs and experienced faculty.";

        chatContainer.innerHTML += `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-cctBlue text-creamWhite flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                <div class="bg-softBlue/60 text-gray-800 p-3.5 rounded-2xl rounded-tl-none text-sm max-w-xl">
                    ${response}
                </div>
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        lucide.createIcons();
    }, 800);
}

function renderQuickHelp(container) {
    const contacts = [
        { name: 'CCT Administration & Security Desk', number: '+977-56-591234', desc: '24/7 campus security and administrative assistance at Bharatpur.' },
        { name: 'CCT Student Health & First Aid', number: '+977-56-591555', desc: 'Immediate medical assistance and first aid support on campus.' },
        { name: 'Tribhuvan University Examination Cell', number: '+977-56-591888', desc: 'Inquiries regarding TU board exams, marksheets, and transcripts.' },
        { name: 'CCT IT Infrastructure & Lab Support', number: '+977-56-591999', desc: 'Wi-Fi connectivity, student portal login, and lab assistance.' }
    ];

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div class="bg-gradient-to-r from-red-600 to-cctOrange rounded-3xl p-6 md:p-8 text-creamWhite shadow-xl flex items-center justify-between gap-6">
                <div>
                    <h2 class="text-2xl font-bold flex items-center gap-2"><i data-lucide="shield-alert" class="w-7 h-7"></i> CCT Emergency & SOS Directory</h2>
                    <p class="text-white/90 text-sm mt-1">If you require immediate assistance on campus, please reach out to the contacts below instantly.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${contacts.map(c => `
                    <div class="bg-surface p-6 rounded-2xl border border-lightBlue/20 shadow-sm space-y-3">
                        <h3 class="font-bold text-lg text-cctBlue">${c.name}</h3>
                        <p class="text-sm text-gray-600">${c.desc}</p>
                        <div class="pt-2 flex items-center justify-between border-t border-gray-100">
                            <span class="font-mono font-bold text-gray-800 text-sm">${c.number}</span>
                            <a href="tel:${c.number}" class="bg-cctOrange text-creamWhite px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-[#e07d12] transition-all flex items-center gap-1.5">
                                <i data-lucide="phone-call" class="w-3.5 h-3.5"></i> Call Now
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProfile(container) {
    const profile = loadState('profile');

    container.innerHTML = `
        <div class="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div class="bg-surface p-8 rounded-3xl border border-lightBlue/20 shadow-sm">
                <h2 class="text-2xl font-bold text-cctBlue mb-6">CCT Student Profile Settings</h2>
                <form onsubmit="handleProfileUpdate(event)" class="space-y-5">
                    <div class="flex items-center gap-6">
                        <img id="profile-preview" src="${getStudentAvatar(profile, 150)}" class="w-24 h-24 rounded-2xl object-cover border-2 border-cctBlue shadow-md" alt="Avatar">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-2">Profile Photo</label>
                            <input type="file" id="p-avatar-file" accept="image/*" class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-softBlue file:text-cctBlue hover:file:bg-lightBlue/20">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                            <input type="text" id="p-name" value="${profile.name}" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cctBlue">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                            <input type="email" id="p-email" value="${profile.email}" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cctBlue">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Program / Faculty</label>
                            <input type="text" id="p-major" value="${profile.major}" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cctBlue">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1">Academic Year / Semester</label>
                            <input type="text" id="p-year" value="${profile.year}" required class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cctBlue">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
                        <textarea id="p-bio" rows="3" class="w-full bg-softBlue/50 border border-lightBlue/30 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cctBlue">${profile.bio}</textarea>
                    </div>
                    <div class="flex justify-end pt-4">
                        <button type="submit" class="bg-cctBlue text-creamWhite px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-[#1d64a6] transition-all">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    handleImageUpload('p-avatar-file', (imageData) => {
        const profile = loadState('profile');
        profile.name = document.getElementById('p-name').value;
        profile.email = document.getElementById('p-email').value;
        profile.major = document.getElementById('p-major').value;
        profile.year = document.getElementById('p-year').value;
        profile.bio = document.getElementById('p-bio').value;
        if (imageData) profile.avatar = imageData;

        saveState('profile', profile);
        updateSidebarHeader();
        router.render();
        showToast('Profile updated successfully!');
    });
}

function openSearchModal() {
    document.getElementById('search-modal').classList.remove('hidden');
    document.getElementById('global-search-input').focus();
}

function closeSearchModal() {
    document.getElementById('search-modal').classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
    }
    if (e.key === 'Escape') {
        closeSearchModal();
        closeNotifications();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const resultsContainer = document.getElementById('search-results');
            if (!query) {
                resultsContainer.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">Type to search across all CCT campus modules...</p>';
                return;
            }

            const assignments = loadState('assignments').filter(a => a.title.toLowerCase().includes(query) || a.course.toLowerCase().includes(query));
            const notices = loadState('notices').filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
            const lostFound = loadState('lostFound').filter(lf => lf.item.toLowerCase().includes(query) || lf.location.toLowerCase().includes(query));

            let html = '';
            if (assignments.length > 0) {
                html += '<p class="text-xs font-bold text-cctBlue px-2 py-1">Assignments</p>';
                assignments.forEach(a => {
                    html += `<div onclick="router.navigate('assignments'); closeSearchModal();" class="p-2.5 rounded-xl hover:bg-softBlue/60 cursor-pointer text-sm font-medium text-gray-800">${a.title} (${a.course})</div>`;
                });
            }
            if (notices.length > 0) {
                html += '<p class="text-xs font-bold text-cctBlue px-2.5 py-1 mt-2">Notices</p>';
                notices.forEach(n => {
                    html += `<div onclick="router.navigate('notices'); closeSearchModal();" class="p-2.5 rounded-xl hover:bg-softBlue/60 cursor-pointer text-sm font-medium text-gray-800">${n.title}</div>`;
                });
            }
            if (lostFound.length > 0) {
                html += '<p class="text-xs font-bold text-cctBlue px-2.5 py-1 mt-2">Lost & Found</p>';
                lostFound.forEach(lf => {
                    html += `<div onclick="router.navigate('lostfound'); closeSearchModal();" class="p-2.5 rounded-xl hover:bg-softBlue/60 cursor-pointer text-sm font-medium text-gray-800">${lf.item} - ${lf.type}</div>`;
                });
            }

            if (!html) {
                html = '<p class="text-sm text-gray-400 text-center py-6">No matching results found.</p>';
            }
            resultsContainer.innerHTML = html;
        });
    }
});

const searchModalEl = document.getElementById('search-modal');
if (searchModalEl) {
    searchModalEl.addEventListener('click', (e) => {
        if (e.target === searchModalEl) closeSearchModal();
    });
}

function toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.classList.toggle('hidden');
    renderNotificationsList();
}

function closeNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden') && !dropdown.parentElement.contains(e.target)) {
        closeNotifications();
    }
});

function renderNotificationsList() {
    const notifications = loadState('notifications');
    const list = document.getElementById('notifications-list');
    const badge = document.getElementById('notification-badge');
    if (!list || !badge) return;

    if (notifications.length > 0) {
        badge.classList.remove('hidden');
        list.innerHTML = notifications.map(n => `
            <div class="p-3 hover:bg-softBlue/40 transition-all">
                <h4 class="font-semibold text-xs text-cctBlue">${n.title}</h4>
                <p class="text-xs text-gray-600 mt-0.5">${n.message}</p>
                <span class="text-[10px] text-gray-400 mt-1 block">${n.time}</span>
            </div>
        `).join('');
    } else {
        badge.classList.add('hidden');
        list.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">No new notifications</p>';
    }
}

function clearNotifications() {
    saveState('notifications', []);
    renderNotificationsList();
    closeNotifications();
    showToast('Notifications cleared');
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 767px)').matches) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });
    }
    const mobileToggle = document.getElementById('mobile-toggle');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
    const mobileClose = document.getElementById('mobile-close');
    if (mobileClose && sidebar) {
        mobileClose.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }

    router.handleHash();
    updateSidebarHeader();
    renderNotificationsList();
});