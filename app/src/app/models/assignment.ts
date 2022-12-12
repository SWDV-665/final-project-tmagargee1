export interface AssignmentBase {
    _id: string | undefined;
    name: string;
    description: string;
    isDueDateUncertain: boolean;
    isCompleted: boolean;
    categoryId: string;
}

export interface AssignmentDto extends AssignmentBase {
    dueDate?: Date;
}
