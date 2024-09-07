import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskManagerController.getTasks';
import createTask from '@salesforce/apex/TaskManagerController.createTask';
import updateTaskStatus from '@salesforce/apex/TaskManagerController.updateTaskStatus';
import deleteTask from '@salesforce/apex/TaskManagerController.deleteTask';

export default class TaskManager extends LightningElement {
    @track tasks = [];
    @track error;
    @track newTask = { subject: '', priority: 'Normal', dueDate: '' };

    get showNoTasksMessage() {
        return this.tasks.length === 0 && !this.error;
    }

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
            this.error = undefined;
        } else if (error) {
            this.tasks = [];
            this.error = error.body ? error.body.message : 'Unknown error';
        }
    }

    handleInputChange(event) {
        const field = event.target.name;
        this.newTask[field] = event.target.value;
    }

    handleCreateTask() {
        const { subject, priority, dueDate } = this.newTask;
        if (subject && dueDate) {
            createTask({ subject, priority, dueDate })
                .then(() => {
                    return refreshApex(this.wiredTasks);  // Refresh the task list
                })
                .catch(error => {
                    this.error = error.body ? error.body.message : 'Creating task';
                });
        } else {
            this.error = 'Please fill all required fields.';
        }
    }

    handleCompleteTask(event) {
        const taskId = event.target.dataset.id;
        updateTaskStatus({ taskId, status: 'Completed' })
            .then(() => {
                return refreshApex(this.wiredTasks);  // Refresh task list
            })
            .catch(error => {
                this.error = error.body ? error.body.message : 'Updating task status';
            });
    }

    handleDeleteTask(event) {
        const taskId = event.target.dataset.id;
        deleteTask({ taskId })
            .then(() => {
                return refreshApex(this.wiredTasks);  // Refresh task list
            })
            .catch(error => {
                this.error = error.body ? error.body.message : 'Deleting task';
            });
    }
    // Add this in your JavaScript file
priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' }
];

}
