import React, { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Link,
  Copy,
  Edit,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormData {
  id: string;
  title: string;
  questionnaire: string;
  section: string;
  status: "active" | "inactive";
  responses: number;
  createdAt: Date;
  expiresAt: Date;
}

interface FormsListProps {
  forms?: FormData[];
  onActivateForm?: (id: string) => void;
  onDeactivateForm?: (id: string) => void;
  onDeleteForm?: (id: string) => void;
  onEditForm?: (id: string) => void;
  onViewForm?: (id: string) => void;
  onCopyLink?: (id: string) => void;
}

const FormsList = ({
  forms = [
    {
      id: "1",
      title: "End of Semester Evaluation",
      questionnaire: "Standard Faculty Evaluation",
      section: "CS101-A",
      status: "active",
      responses: 24,
      createdAt: new Date("2023-09-01"),
      expiresAt: new Date("2023-12-15"),
    },
    {
      id: "2",
      title: "Mid-term Feedback",
      questionnaire: "Quick Feedback Form",
      section: "MATH202-B",
      status: "inactive",
      responses: 18,
      createdAt: new Date("2023-08-15"),
      expiresAt: new Date("2023-10-01"),
    },
    {
      id: "3",
      title: "Teaching Assistant Evaluation",
      questionnaire: "TA Performance Review",
      section: "PHYS303-C",
      status: "active",
      responses: 12,
      createdAt: new Date("2023-09-10"),
      expiresAt: new Date("2023-11-30"),
    },
  ] as FormData[],
  onActivateForm = () => {},
  onDeactivateForm = () => {},
  onDeleteForm = () => {},
  onEditForm = () => {},
  onViewForm = () => {},
  onCopyLink = () => {},
}: FormsListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleStatusChange = (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    // Find the form and update its status locally
    const updatedForms = forms.map((form) => {
      if (form.id === id) {
        return {
          ...form,
          status: currentStatus === "active" ? "inactive" : "active",
        };
      }
      return form;
    });

    // Call the appropriate callback
    if (currentStatus === "active") {
      onDeactivateForm(id);
    } else {
      onActivateForm(id);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFormId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFormId) {
      onDeleteForm(selectedFormId);
      setDeleteDialogOpen(false);
      setSelectedFormId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Evaluation Forms</h2>
          <Button>Create New Form</Button>
        </div>

        <Table>
          <TableCaption>List of all evaluation forms</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Questionnaire</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.title}</TableCell>
                <TableCell>{form.questionnaire}</TableCell>
                <TableCell>{form.section}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={form.status === "active"}
                      onCheckedChange={() =>
                        handleStatusChange(form.id, form.status)
                      }
                    />
                    <Badge
                      variant={
                        form.status === "active" ? "default" : "secondary"
                      }
                    >
                      {form.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{form.responses}</TableCell>
                <TableCell>{format(form.createdAt, "MMM d, yyyy")}</TableCell>
                <TableCell>{format(form.expiresAt, "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewForm(form.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCopyLink(form.id)}>
                        <Link className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditForm(form.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {form.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(form.id, form.status)
                          }
                        >
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(form.id, form.status)
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(form.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this evaluation form? This action
              cannot be undone.
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

export default FormsList;
