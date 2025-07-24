from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Task, Department, CustomUser, SP

User = get_user_model()

class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_title', 'task_description', 'task_due_date', 'department_display')
    list_filter = ('department', )
    ordering = ('department__name',)  # Sort tasks by department name

    def department_display(self, obj):
        return obj.department.name if obj.department else ''

    department_display.short_description = 'Department'  # Custom header for the department field

admin.site.register(Task, TaskAdmin)
admin.site.register(Department)


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'id', 'email', 'department_list', 'initials')

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def department_list(self, obj):
        return ", ".join([dept.name for dept in obj.department.all()])
    department_list.short_description = 'Departments'

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(SP)