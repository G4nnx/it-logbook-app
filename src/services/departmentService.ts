// Service for managing departments with localStorage persistence

// Get all departments from localStorage or return default departments
export const getDepartments = (): string[] => {
  try {
    const savedDepartments = localStorage.getItem("departments");
    if (savedDepartments) {
      return JSON.parse(savedDepartments);
    }
    // Default departments if none found in localStorage
    const defaultDepartments = [
      "IT Infrastructure",
      "Finance",
      "HR",
      "Marketing",
      "Sales",
      "Operations",
      "Executive",
      "Development",
      "QA",
    ];
    // Save defaults to localStorage
    localStorage.setItem("departments", JSON.stringify(defaultDepartments));
    return defaultDepartments;
  } catch (error) {
    console.error("Error loading departments from localStorage:", error);
    return [];
  }
};

// Save departments to localStorage
export const saveDepartments = (departments: string[]): void => {
  try {
    localStorage.setItem("departments", JSON.stringify(departments));
  } catch (error) {
    console.error("Error saving departments to localStorage:", error);
  }
};

// Add a new department
export const addDepartment = (department: string): string[] => {
  const departments = getDepartments();
  const updatedDepartments = [...departments, department];
  saveDepartments(updatedDepartments);
  return updatedDepartments;
};

// Update a department
export const updateDepartment = (index: number, newName: string): string[] => {
  const departments = getDepartments();
  const updatedDepartments = [...departments];
  updatedDepartments[index] = newName;
  saveDepartments(updatedDepartments);
  return updatedDepartments;
};

// Delete a department
export const deleteDepartment = (index: number): string[] => {
  const departments = getDepartments();
  const updatedDepartments = departments.filter((_, i) => i !== index);
  saveDepartments(updatedDepartments);
  return updatedDepartments;
};
