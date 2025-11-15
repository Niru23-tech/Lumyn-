import { Role, AppointmentStatus, User, Appointment, JournalEntry, Message, Conversation, Resource } from '../types';

// --- MOCK DATABASE (in-memory) ---

let mockUsers: User[] = [
  // Students
  { id: 'student1', name: 'Alice Smith', email: 'alice@example.com', role: Role.STUDENT, avatarUrl: 'https://i.pravatar.cc/150?u=student1' },
  { id: 'student2', name: 'Bob Johnson', email: 'bob@example.com', role: Role.STUDENT, avatarUrl: 'https://i.pravatar.cc/150?u=student2' },
  // Counsellors
  { id: 'counsellor1', name: 'Dr. Carol White', email: 'carol@example.com', role: Role.COUNSELLOR, avatarUrl: 'https://i.pravatar.cc/150?u=counsellor1' },
  { id: 'counsellor2', name: 'Dr. David Green', email: 'david@example.com', role: Role.COUNSELLOR, avatarUrl: 'https://i.pravatar.cc/150?u=counsellor2' },
];

let mockAppointments: Appointment[] = [
  { id: 'app1', studentId: 'student1', studentName: 'Alice Smith', counsellorId: 'counsellor1', counsellorName: 'Dr. Carol White', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)), status: AppointmentStatus.CONFIRMED, notes: 'Discussing exam stress.' },
  { id: 'app2', studentId: 'student2', studentName: 'Bob Johnson', counsellorId: 'counsellor1', counsellorName: 'Dr. Carol White', dateTime: new Date(new Date().setDate(new Date().getDate() + 3)), status: AppointmentStatus.PENDING, notes: 'General check-in.' },
  { id: 'app3', studentId: 'student1', studentName: 'Alice Smith', counsellorId: 'counsellor2', counsellorName: 'Dr. David Green', dateTime: new Date(new Date().setDate(new Date().getDate() - 5)), status: AppointmentStatus.COMPLETED, notes: 'Follow-up on study habits.' },
  { id: 'app4', studentId: 'student2', studentName: 'Bob Johnson', counsellorId: 'counsellor2', counsellorName: 'Dr. David Green', dateTime: new Date(new Date().setDate(new Date().getDate() + 4)), status: AppointmentStatus.REJECTED, notes: 'Counsellor unavailable.' },
];

let mockJournalEntries: JournalEntry[] = [
  { id: 'j1', studentId: 'student1', title: 'Feeling Overwhelmed', content: 'The upcoming exams are really stressful. I need to find a better way to manage my time.', createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
  { id: 'j2', studentId: 'student1', title: 'A Good Day', content: 'Today felt productive. I managed to finish my assignment and even had time to relax.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
];

let mockMessages: Message[] = [
    { id: 'm1', senderId: 'student1', receiverId: 'counsellor1', text: 'Hi Dr. White, looking forward to our session.', timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), status: 'read' },
    { id: 'm2', senderId: 'counsellor1', receiverId: 'student1', text: 'Hi Alice, me too. Please come prepared with any questions you have.', timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 23), status: 'read' },
    { id: 'm3', senderId: 'student2', receiverId: 'counsellor1', text: 'Hello, I have a quick question about my appointment.', timestamp: new Date(new Date().getTime() - 1000 * 60 * 5), status: 'delivered' },
];

let mockResources: Resource[] = [
  { id: 'res1', title: 'Managing Exam Stress', summary: 'Learn effective techniques to handle pressure during exam season.', content: 'Exam stress is common, but manageable. Techniques include time management, mindfulness, regular breaks, and proper nutrition. Create a study schedule, practice deep breathing exercises, and ensure you get enough sleep. Physical activity also helps reduce stress levels.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800' },
  { id: 'res2', title: 'The Importance of Sleep for Students', summary: 'Discover why a good night\'s sleep is crucial for academic success.', content: 'Sleep is vital for cognitive functions like memory consolidation and learning. Lack of sleep can impair concentration, and problem-solving skills. Aim for 7-9 hours of quality sleep per night. Establish a regular sleep schedule and create a relaxing bedtime routine to improve sleep quality.', imageUrl: 'https://images.unsplash.com/photo-1495197359-3233b378a56b?q=80&w=800' },
  { id: 'res3', title: 'Effective Communication Skills', summary: 'Improve your personal and professional relationships with better communication.', content: 'Effective communication involves active listening, clarity, and empathy. Practice expressing your thoughts and feelings clearly and respectfully. Pay attention to non-verbal cues. Good communication skills are essential for building strong relationships with peers, family, and professionals.', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800' },
];

// --- API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Auth
export const getMockUserById = async (userId: string): Promise<User | undefined> => {
  await delay(300);
  return mockUsers.find(u => u.id === userId);
};

export const mockLogin = async (email: string, password_unused: string): Promise<string | null> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    return user ? user.id : null;
};

export const mockSignup = async (name: string, email: string, password_unused: string, role: Role): Promise<string | null> => {
    await delay(500);
    if (mockUsers.some(u => u.email === email)) {
        throw new Error('User with this email already exists.');
    }
    const newUser: User = {
        id: `user${mockUsers.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://i.pravatar.cc/150?u=user${mockUsers.length + 1}`
    };
    mockUsers.push(newUser);
    return newUser.id;
};

// Users
export const getUsers = async (role?: Role): Promise<User[]> => {
    await delay(300);
    if (role) {
        return mockUsers.filter(u => u.role === role);
    }
    return mockUsers;
};

export const getCounsellors = async (): Promise<User[]> => {
    return getUsers(Role.COUNSELLOR);
}

// Appointments
export const getStudentAppointments = async (studentId: string): Promise<Appointment[]> => {
    await delay(500);
    return mockAppointments.filter(a => a.studentId === studentId).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());
};

export const getCounsellorAppointments = async (counsellorId: string): Promise<Appointment[]> => {
    await delay(500);
    return mockAppointments.filter(a => a.counsellorId === counsellorId).sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime());
};

export const bookAppointment = async (studentId: string, counsellorId: string, dateTime: Date): Promise<Appointment> => {
    await delay(500);
    const student = await getMockUserById(studentId);
    const counsellor = await getMockUserById(counsellorId);
    if (!student || !counsellor) throw new Error('Invalid user ID');

    const newAppointment: Appointment = {
        id: `app${mockAppointments.length + 1}`,
        studentId,
        studentName: student.name,
        counsellorId,
        counsellorName: counsellor.name,
        dateTime,
        status: AppointmentStatus.PENDING,
        notes: ''
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
};

export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus): Promise<Appointment> => {
    await delay(300);
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    appointment.status = status;
    return appointment;
};

// Journal
export const getStudentJournal = async (studentId: string): Promise<JournalEntry[]> => {
    await delay(400);
    return mockJournalEntries.filter(j => j.studentId === studentId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const addJournalEntry = async (studentId: string, title: string, content: string): Promise<JournalEntry> => {
    await delay(300);
    const newEntry: JournalEntry = {
        id: `j${mockJournalEntries.length + 1}`,
        studentId,
        title,
        content,
        createdAt: new Date(),
    };
    mockJournalEntries.push(newEntry);
    return newEntry;
};

// Chat
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    await delay(400);
    const conversations: { [key: string]: Conversation } = {};
    const userMessages = mockMessages.filter(m => m.senderId === userId || m.receiverId === userId);

    for (const message of userMessages) {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
        if (!conversations[otherUserId]) {
            const otherUser = await getMockUserById(otherUserId);
            const currentUser = await getMockUserById(userId);
            if(otherUser && currentUser) {
                conversations[otherUserId] = {
                    id: `${userId}-${otherUserId}`,
                    participant1: currentUser,
                    participant2: otherUser,
                    messages: []
                };
            }
        }
        if(conversations[otherUserId]) {
           conversations[otherUserId].messages.push(message);
        }
    }
    Object.values(conversations).forEach(convo => {
        convo.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });
    return Object.values(conversations);
};

export const sendMessage = async (senderId: string, receiverId: string, text: string): Promise<Message> => {
    await delay(200);
    const newMessage: Message = {
        id: `m${mockMessages.length + 1}`,
        senderId,
        receiverId,
        text,
        timestamp: new Date(),
        status: 'sent',
    };
    mockMessages.push(newMessage);
    
    // Simulate delivery and read status
    setTimeout(() => { newMessage.status = 'delivered'; }, 500);
    setTimeout(() => { newMessage.status = 'read'; }, 2000);

    return newMessage;
};

// Resources
export const getResources = async (): Promise<Resource[]> => {
    await delay(300);
    return mockResources;
};
