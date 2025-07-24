from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task, Department,ProgReport
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'initials', 'department', 'first_name', 'last_name', 'email', 'pfp', 'username', 'groups')

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assigned_users = UserSerializer(many=True)
    created_user = UserSerializer()
    department = DepartmentSerializer()

    class Meta:
        model = Task
        fields = ('id', 'assigned_users', 'department','created_user', 'department', 'task_title', 'task_description', 'task_due_date', 'task_status', 'priority')

class ProgReportSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    task = TaskSerializer()
    formatted_date_submitted = serializers.DateTimeField(
        source='date_submitted',
        format='%m/%d/%y',
        read_only=True
    )

    class Meta:
        model = ProgReport
        fields = ['user', 'task', 'report_title', 'report_description', 'report_url', 'time_spent', 'formatted_date_submitted']

class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)