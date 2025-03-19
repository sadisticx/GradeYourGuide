import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  text: string;
  type: "rating" | "qualitative";
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  status: "draft" | "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionnaireListProps {
  questionnaires?: Questionnaire[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

const QuestionnaireList: React.FC<QuestionnaireListProps> = ({
  questionnaires = [
    {
      id: "1",
      title: "End of Semester Evaluation",
      description: "Standard evaluation form for end of semester feedback",
      sections: [
        {
          id: "s1",
          title: "Teaching Quality",
          questions: [
            {
              id: "q1",
              text: "How would you rate the overall teaching quality?",
              type: "rating",
            },
            {
              id: "q2",
              text: "What aspects of teaching could be improved?",
              type: "qualitative",
            },
          ],
        },
        {
          id: "s2",
          title: "Course Content",
          questions: [
            {
              id: "q3",
              text: "Was the course content relevant to your learning goals?",
              type: "rating",
            },
            {
              id: "q4",
              text: "What topics would you like to see added or removed?",
              type: "qualitative",
            },
          ],
        },
      ],
      status: "active",
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 6, 1),
    },
    {
      id: "2",
      title: "Mid-Term Feedback Form",
      description: "Quick feedback collection halfway through the semester",
      sections: [
        {
          id: "s1",
          title: "Course Progress",
          questions: [
            {
              id: "q1",
              text: "How would you rate your understanding of the material so far?",
              type: "rating",
            },
            {
              id: "q2",
              text: "What areas do you need more clarification on?",
              type: "qualitative",
            },
          ],
        },
      ],
      status: "draft",
      createdAt: new Date(2023, 7, 10),
      updatedAt: new Date(2023, 7, 10),
    },
    {
      id: "3",
      title: "Teaching Assistant Evaluation",
      description: "Form for evaluating teaching assistants",
      sections: [
        {
          id: "s1",
          title: "TA Performance",
          questions: [
            {
              id: "q1",
              text: "How helpful was the TA during lab sessions?",
              type: "rating",
            },
            {
              id: "q2",
              text: "How clear were the TA's explanations?",
              type: "rating",
            },
          ],
        },
      ],
      status: "archived",
      createdAt: new Date(2023, 2, 5),
      updatedAt: new Date(2023, 5, 20),
    },
  ],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onCreate = () => {},
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);

  const handleDeleteClick = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuestionnaire) {
      onDelete(selectedQuestionnaire.id);
      setDeleteDialogOpen(false);
      setSelectedQuestionnaire(null);
    }
  };

  const getStatusBadge = (status: Questionnaire["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Questionnaires</h2>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionnaires.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No questionnaires found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              questionnaires.map((questionnaire) => {
                const totalQuestions = questionnaire.sections.reduce(
                  (sum, section) => sum + section.questions.length,
                  0,
                );

                return (
                  <TableRow key={questionnaire.id}>
                    <TableCell className="font-medium">
                      {questionnaire.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {questionnaire.description}
                    </TableCell>
                    <TableCell>{questionnaire.sections.length}</TableCell>
                    <TableCell>{totalQuestions}</TableCell>
                    <TableCell>
                      {getStatusBadge(questionnaire.status)}
                    </TableCell>
                    <TableCell>
                      {format(questionnaire.updatedAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onView(questionnaire.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(questionnaire.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(questionnaire)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the questionnaire "
              {selectedQuestionnaire?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionnaireList;
