
export enum Role {
  STUDENT = 'student',
  COUNSELLOR = 'counsellor',
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  counsellorId: string;
  counsellorName: string;
  dateTime: Date;
  status: AppointmentStatus;
  notes: string;
}

export interface JournalEntry {
  id: string;
  studentId: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant1: User;
  participant2: User;
  messages: Message[];
}

export interface Resource {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
}
