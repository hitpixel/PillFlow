import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Save, Trash2 } from "lucide-react";
import { database } from "../lib/database";

interface Note {
  id: string;
  content: string;
  is_completed: boolean;
  created_at: string;
}

interface CustomerNotesProps {
  customerId?: string;
}

const CustomerNotes = ({ customerId }: CustomerNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      loadNotes();
    }
  }, [customerId]);

  const loadNotes = async () => {
    try {
      const data = await database.notes.getByCustomerId(customerId!);
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !customerId) return;

    try {
      setLoading(true);
      const note = await database.notes.create({
        customer_id: customerId,
        content: newNote.trim(),
        is_completed: false,
      });

      setNotes((prev) => [note, ...prev]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (noteId: string) => {
    try {
      const noteToUpdate = notes.find((n) => n.id === noteId);
      if (!noteToUpdate) return;

      const updatedNote = await database.notes.update(noteId, {
        is_completed: !noteToUpdate.is_completed,
      });

      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? updatedNote : note)),
      );
    } catch (err) {
      console.error("Failed to toggle note:", err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await database.notes.delete(noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <Card className="w-full h-[600px] bg-white p-6">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Customer Notes</h2>

        <div className="flex gap-2 mb-4">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleAddNote}
            disabled={loading || !newNote.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start gap-2 p-3 border rounded-lg"
              >
                <Checkbox
                  checked={note.is_completed}
                  onCheckedChange={() => handleToggleComplete(note.id)}
                />
                <p
                  className={`flex-1 text-sm ${note.is_completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {note.content}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No notes yet</p>
                <p className="text-sm">Add a note to get started</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default CustomerNotes;
