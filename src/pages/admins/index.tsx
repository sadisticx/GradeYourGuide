import React, { useState, useEffect } from "react";
import { fetchData, insertData, updateData, deleteData } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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
import BackButton from "@/components/ui/back-button";

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [admins, setAdmins] = useState<Admin[]>([]);

  // Fetch admins from Supabase
  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData("admins");

        // Format the data
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role || "Viewer",
          status: item.status || "active",
          lastLogin: item.last_login || new Date().toISOString(),
          permissions: item.permissions || [],
        }));

        setAdmins(formattedData);

        toast({
          title: "Success",
          description: "Admin accounts loaded successfully",
        });
      } catch (error) {
        console.error("Error loading admins:", error);
        toast({
          title: "Error",
          description:
            "Failed to load admin accounts. Using sample data instead.",
          variant: "destructive",
        });

        // Set default admins for demo if loading fails
        setAdmins([
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
            permissions: [
              "manage_questionnaires",
              "manage_forms",
              "view_analytics",
            ],
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
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, [toast]);

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

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Extract permissions from form data
      const permissions = Object.entries(data.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      const adminData = {
        name: data.name,
        email: data.email,
        role: data.role,
        permissions,
      };

      if (selectedAdmin) {
        // Update existing admin
        await updateData("admins", selectedAdmin.id, adminData);

        setAdmins(
          admins.map((admin) => {
            if (admin.id === selectedAdmin.id) {
              return {
                ...admin,
                name: data.name,
                email: data.email,
                role: data.role,
                permissions,
              };
            }
            return admin;
          }),
        );

        toast({
          title: "Success",
          description: "Admin account updated successfully",
        });
      } else {
        // Create new admin
        const result = await insertData("admins", {
          ...adminData,
          status: "active",
          last_login: new Date().toISOString(),
        });

        if (result && result.length > 0) {
          const newAdmin: Admin = {
            id: result[0].id,
            name: data.name,
            email: data.email,
            role: data.role,
            status: "active",
            lastLogin: new Date().toISOString(),
            permissions,
          };

          setAdmins([...admins, newAdmin]);

          toast({
            title: "Success",
            description: "New admin account created successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast({
        title: "Error",
        description: "Failed to save admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsFormOpen(false);
      // Force a re-render
      setTimeout(() => {
        setSelectedAdmin(null);
      }, 100);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    try {
      await deleteData("admins", admin.id);

      // Update local state
      setAdmins(admins.filter((a) => a.id !== admin.id));

      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = (admin: Admin) => {
    setResetPasswordEmail(admin.email);
    setIsResetPasswordModalOpen(true);
  };

  const handleDeactivateAdmin = async (admin: Admin) => {
    try {
      const newStatus = admin.status === "active" ? "inactive" : "active";
      await updateData("admins", admin.id, { status: newStatus });

      // Update local state
      setAdmins(
        admins.map((a) => {
          if (a.id === admin.id) {
            return {
              ...a,
              status: newStatus,
            };
          }
          return a;
        }),
      );

      toast({
        title: "Success",
        description: `Admin account ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update admin account status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <BackButton toDashboard className="mb-4" />
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
            isLoading={isLoading}
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
