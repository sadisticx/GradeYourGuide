import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminList from "@/components/admins/AdminList";
import AdminForm from "@/components/admins/AdminForm";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
}

const AdminsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "2023-06-15T10:30:00",
      permissions: [
        "manage_questionnaires",
        "manage_forms",
        "view_analytics",
        "manage_admins",
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Department Admin",
      status: "active",
      lastLogin: "2023-06-14T14:45:00",
      permissions: ["manage_questionnaires", "manage_forms", "view_analytics"],
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Viewer",
      status: "inactive",
      lastLogin: "2023-05-20T09:15:00",
      permissions: ["view_analytics"],
    },
  ]);

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsFormOpen(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedAdmin) {
      // Update existing admin
      setAdmins(
        admins.map((admin) => {
          if (admin.id === selectedAdmin.id) {
            return {
              ...admin,
              name: data.name,
              email: data.email,
              role: data.role,
              permissions: Object.entries(data.permissions)
                .filter(([_, value]) => value === true)
                .map(([key]) => key),
            };
          }
          return admin;
        }),
      );
    } else {
      // Create new admin
      const newAdmin: Admin = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        status: "active",
        lastLogin: new Date().toISOString(),
        permissions: Object.entries(data.permissions)
          .filter(([_, value]) => value === true)
          .map(([key]) => key),
      };
      setAdmins([...admins, newAdmin]);
    }
    setIsFormOpen(false);
    // Force a re-render
    setTimeout(() => {
      setSelectedAdmin(null);
    }, 100);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleDeleteAdmin = (admin: Admin) => {
    setAdmins(admins.filter((a) => a.id !== admin.id));
  };

  const handleResetPassword = (admin: Admin) => {
    setResetPasswordEmail(admin.email);
    setIsResetPasswordModalOpen(true);
  };

  const handleDeactivateAdmin = (admin: Admin) => {
    setAdmins(
      admins.map((a) => {
        if (a.id === admin.id) {
          return {
            ...a,
            status: a.status === "active" ? "inactive" : "active",
          };
        }
        return a;
      }),
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Administrator Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage administrator accounts and their permissions in the system.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddAdmin}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-0">
            <AdminForm
              adminId={selectedAdmin?.id}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>System Administrators</CardTitle>
            <CardDescription>
              View and manage all administrator accounts in the Faculty
              Evaluation System.
            </CardDescription>
          </CardHeader>
          <AdminList
            admins={admins}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteAdmin}
            onResetPassword={handleResetPassword}
            onDeactivate={handleDeactivateAdmin}
          />

          {/* Reset Password Modal */}
          <Dialog
            open={isResetPasswordModalOpen}
            onOpenChange={setIsResetPasswordModalOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  A password reset link will be sent to the following email
                  address.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={resetPasswordEmail}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Simulate sending reset password email
                    alert(`Password reset link sent to ${resetPasswordEmail}`);
                    setIsResetPasswordModalOpen(false);
                  }}
                >
                  Send Reset Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
};

export default AdminsPage;
