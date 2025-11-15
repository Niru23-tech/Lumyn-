
import React, { useState, useEffect, useMemo } from 'react';
import { JournalEntry } from '../../types';
import { getStudentJournal, addJournalEntry } from '../../services/mockApi';

interface JournalSectionProps {
  studentId: string;
}

const JournalSection: React.FC<JournalSectionProps> = ({ studentId }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    getStudentJournal(studentId).then(setEntries);
  }, [studentId]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    const newEntry = await addJournalEntry(studentId, newTitle, newContent);
    setEntries([newEntry, ...entries]);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    const lowercasedTerm = searchTerm.toLowerCase();
    return entries.filter(entry =>
      entry.title.toLowerCase().includes(lowercasedTerm) ||
      entry.content.toLowerCase().includes(lowercasedTerm) ||
      entry.createdAt.toLocaleDateString().includes(lowercasedTerm)
    );
  }, [searchTerm, entries]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">My Journal</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md md:w-64 dark:bg-gray-700 dark:border-gray-600"
          />
          <button onClick={() => setIsCreating(true)} className="flex-shrink-0 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            New Entry
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold">New Journal Entry</h3>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={5}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredEntries.length > 0 ? filteredEntries.map(entry => (
          <div key={entry.id} className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{entry.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{entry.createdAt.toLocaleDateString()}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{entry.content}</p>
          </div>
        )) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No entries match your search.' : 'No journal entries yet. Create one to get started!'}
            </p>
        )}
      </div>
    </div>
  );
};

export default JournalSection;
