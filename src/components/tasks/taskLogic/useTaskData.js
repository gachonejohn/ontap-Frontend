import React, { useState, useEffect } from "react";
import { useGetTaskCommentsQuery } from "../../../store/services/tasks/tasksService";
import { useGetEmployeesQuery } from "../../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../../store/services/companies/departmentsService";
import { formatDateForInput } from "../taskFunctions/dateFormatters";

export const useTaskData = (task, isEditingMode) => {
  const [formData, setFormData] = useState({
    progressValue: 0,
    titleValue: "",
    descriptionValue: "",
    dueDateValue: "",
    assigneeValue: "",
    departmentValue: ""
  });

  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = 
    useGetTaskCommentsQuery(task?.id || null, {
      skip: !task?.id,
      refetchOnMountOrArgChange: true
    });

  const comments = commentsData?.results || [];

  
  const { data: employeesData } = useGetEmployeesQuery({});
  const employees = employeesData?.results || [];

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const departments = departmentsData || [];

  // Sync task values only when task changes AND not in editing mode
  useEffect(() => {
    if (!isEditingMode && task) {
      console.log('=== useTaskData DEBUG ===');
      console.log('Task assignee:', task.assignee); 
      console.log('Task assignee_detail:', task.assignee_detail);
      console.log('=== END DEBUG ===');
      
      setFormData({
        progressValue: task.progress_percentage || task.progressPercentage || 0,
        titleValue: task.title || "",
        descriptionValue: task.description || "",
        dueDateValue: formatDateForInput(task.due_date || task.dueDate),
        
        assigneeValue: task.assignee || "", 
        departmentValue: task.department || ""
      });
    }
  }, [task, isEditingMode]);

  
  useEffect(() => {
    if (task && employees?.length) {
      
      const assigneeOption = employees.find(e => 
        
        e.user?.id === task.assignee || e.id === task.assignee
      );
      
      
      console.log('=== EMPLOYEE MATCHING DEBUG ===');
      console.log('Looking for assignee with user ID:', task.assignee);
      console.log('Available employees:', employees.map(e => ({ id: e.id, userId: e.user?.id, name: e.first_name })));
      console.log('Found assignee option:', assigneeOption);
      console.log('=== END DEBUG ===');
      
      
      if (assigneeOption && assigneeOption.user?.id === task.assignee) {
        
        setFormData(prev => ({ 
          ...prev, 
          assigneeValue: task.assignee 
        }));
      }
      
    }
    
    if (task && departments?.length) {
      const deptOption = departments.find(d => d.id === task.department);
      if (deptOption) {
        setFormData(prev => ({ ...prev, departmentValue: deptOption.id }));
      }
    }
  }, [employees, departments, task]);

  const updateFormData = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateFormData,
    comments,
    commentsLoading,
    refetchComments,
    employees,
    departments
  };
};