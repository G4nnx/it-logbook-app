import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departmentService";

const DepartmentSettings = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<string[]>([]);
  const [editingDepartment, setEditingDepartment] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [newDepartment, setNewDepartment] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(
    null,
  );

  // Load departments from localStorage on component mount
  useEffect(() => {
    const loadedDepartments = getDepartments();
    setDepartments(loadedDepartments);
  }, []);

  const handleSaveDepartment = () => {
    if (!editingDepartment) return;

    if (!editingDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Update department and persist to localStorage
    const updatedDepartments = updateDepartment(
      editingDepartment.index,
      editingDepartment.name,
    );
    setDepartments(updatedDepartments);
    setEditingDepartment(null);

    toast({
      title: "Department updated",
      description: "The department has been successfully updated.",
    });
  };

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      toast({
        title: "Error",
        description: "Department name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Add department and persist to localStorage
    const updatedDepartments = addDepartment(newDepartment);
    setDepartments(updatedDepartments);
    setNewDepartment("");
    setShowAddDialog(false);

    toast({
      title: "Department added",
      description: "The new department has been successfully added.",
    });
  };

  const handleDeleteDepartment = () => {
    if (departmentToDelete === null) return;

    // Delete department and persist to localStorage
    const updatedDepartments = deleteDepartment(departmentToDelete);
    setDepartments(updatedDepartments);
    setDepartmentToDelete(null);

    toast({
      title: "Department deleted",
      description: "The department has been successfully deleted.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Settings</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{department}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingDepartment({ index, name: department })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setDepartmentToDelete(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Department Dialog */}
      <Dialog
        open={editingDepartment !== null}
        onOpenChange={() => setEditingDepartment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editingDepartment?.name || ""}
              onChange={(e) =>
                setEditingDepartment((prev) =>
                  prev ? { ...prev, name: e.target.value } : null,
                )
              }
              placeholder="Department name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingDepartment(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Department Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Department name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={departmentToDelete !== null}
        onOpenChange={() => setDepartmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this department? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentSettings;
