public with sharing class TaskManagerController {

    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks() {
        try {
            return [SELECT Id, Subject, Status, Priority, ActivityDate FROM Task WHERE OwnerId = :UserInfo.getUserId() ORDER BY ActivityDate ASC];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching tasks: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static Task createTask(String subject, String priority, Date dueDate) {
        try {
            Task newTask = new Task(Subject = subject, Status = 'Not Started', Priority = priority, ActivityDate = dueDate, OwnerId = UserInfo.getUserId());
            insert newTask;
            return newTask;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating task: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateTaskStatus(Id taskId, String status) {
        try {
            Task t = [SELECT Id, Status FROM Task WHERE Id = :taskId LIMIT 1];
            t.Status = status;
            update t;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating task status: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTask(Id taskId) {
        try {
            Task t = [SELECT Id FROM Task WHERE Id = :taskId LIMIT 1];
            delete t;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting task: ' + e.getMessage());
        }
    }
}
