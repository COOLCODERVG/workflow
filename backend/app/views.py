from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from pymongo import MongoClient
from bson.objectid import ObjectId
from rest_framework import viewsets, permissions, status
from django.contrib.auth import get_user_model, authenticate, login, logout
import openpyxl
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, TaskSerializer, DepartmentSerializer, UserSerializer, ProgReportSerializer
from .models import CustomUser, Task, Department, Group, ProgReport,SP
from django.shortcuts import get_object_or_404
from datetime import datetime

User = get_user_model()

# 2 Is Executive
# 3 Is Management
# 4 Is Member
# 5 Is Superuser

class LoginView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Generate tokens
            refresh = RefreshToken.for_user(user)

            # Serialize department data
            departments = list(user.department.all().values_list('name', flat=True))
            team_lead = list(user.team_lead.all().values_list('name', flat=True))
            groups = list(user.groups.all().values_list('name', flat=True))

            return Response({
                'Email': username,
                'Id': user.id,
                'Departments': departments,
                'Username': user.username,
                'Initials': user.initials,
                'First Name': user.first_name,
                'Last Name': user.last_name,
                'Groups': groups,
                'Teamlead': team_lead,
                'access_token': str(refresh.access_token),
                'refresh': str(refresh),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if user.check_password(serializer.data.get('old_password')):
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_department_tasks(request):
    try:
        email = request.data.get('email')
        user = CustomUser.objects.get(email=email)
        departments = user.department.all()
        tasks = Task.objects.filter(department__in=departments)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_dept_by_id(request):
    try:
        dept_id = request.data.get('department_id')
        department = Department.objects.get(id=dept_id)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_task_by_id(request):
    try:
        task_id = request.data.get('task_id')
        task = Task.objects.get(id=task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request):
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_task_status(request):
    task_id = request.data.get('task_id')
    task_status = request.data.get('task_status')
    task = get_object_or_404(Task, id=task_id)

    task_num = {'todo': 0, 'in progress': 1, 'done': 2, 'stuck': 3, 'canceled': 4}.get(task_status.lower())

    if task_num is not None:
        task.task_status = task_num
        task.save()
        return Response('Success', status=status.HTTP_200_OK)
    return Response({'error': 'Invalid task status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_task(request):
    if request.method == 'POST':
        try:
            task_id = request.data.get('task_id')
            task = Task.objects.get(id=task_id)
            task.delete()
            return Response('Task successfully deleted', status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_task(request):
    task_id = request.data.get('task_id')
    if not task_id:
        return Response({'error': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    task = get_object_or_404(Task, id=task_id)

    assigned_users = request.data.get('assigned_users')
    task_title = request.data.get('task_title')
    task_description = request.data.get('task_description')
    created_user = request.data.get('created_user')
    department = request.data.get('department')
    task_due_date = request.data.get('task_due_date')
    task_status = request.data.get('task_status')
    priority = request.data.get('priority')

    try:
        if assigned_users is not None:
            task.assigned_users.set(assigned_users)
        if task_title is not None:
            task.task_title = task_title
        if task_description is not None:
            task.task_description = task_description
        if created_user is not None:
            task.created_user = created_user
        if department is not None:
            task.department_id = department
        if task_due_date is not None:
            task.task_due_date = task_due_date
        if task_status is not None:
            task.task_status = task_status
        if priority is not None:
            task.priority = priority

        task.save()
        return Response({'success': 'Task updated successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def your_tasks(request):
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        tasks = Task.objects.filter(assigned_users=user)
        tasks_serializer = TaskSerializer(tasks, many=True)
        return Response(tasks_serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_tasks(request):
    try:
        email = request.data.get('email')
        user = User.objects.get(email=email)
        tasks = Task.objects.filter(created_user=user)
        tasks_serializer = TaskSerializer(tasks, many=True)
        return Response(tasks_serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def get_users_by_dept(request):
    try:
        department = request.data.get('department')
        department_instance = get_object_or_404(Department, name=department)
        users = User.objects.filter(department=department_instance)
        users_list = [{'value': user.id, 'label': user.username} for user in users]
        return Response(users_list, status=status.HTTP_200_OK)
    except Department.DoesNotExist:
        return Response({'error': 'Department does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def new_tasks(request):
    try:
        # Extracting data from the request
        department_name = request.data.get('department')
        task_title = request.data.get('task_title')
        task_description = request.data.get('task_description')
        task_due_date = request.data.get('task_due_date')
        priority = request.data.get('priority')
        created_user_id = request.data.get('created_user')
        assigned_user_ids = request.data.get('assigned_users', [])

        # Validate required fields
        if not all([department_name, task_title, task_description, task_due_date, created_user_id]):
            return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the department and created user instances
        department_instance = get_object_or_404(Department, name=department_name)
        created_user = get_object_or_404(CustomUser, id=created_user_id)

        # Create the task
        task = Task.objects.create(
            created_user=created_user,
            department=department_instance,
            task_title=task_title,
            task_description=task_description,
            task_due_date=task_due_date,
            priority=priority,
        )

        # Fetch assigned users and set them
        if assigned_user_ids:
            assigned_users = CustomUser.objects.filter(id__in=[user['value'] for user in assigned_user_ids])
            task.assigned_users.set(assigned_users)

        # Return success response
        return Response({'success': 'Task created successfully.'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_task_priority(request):
    task_id = request.data.get('task_id')
    task_priority = request.data.get('task_priority')
    task = get_object_or_404(Task, id=task_id)

    task_num = {'low': 0, 'medium': 1, 'high': 2}.get(task_priority.lower())

    if task_num is not None:
        task.priority = task_num
        task.save()
        return Response('Success', status=status.HTTP_200_OK)

    return Response({'error': 'Invalid task status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_team_by_dept(request):
    try:
        departments = request.data.get('departments')
        if not departments:
            return Response({'error': 'No departments provided.'}, status=400)

        final_dict = {}
        for dept_name in departments:
            try:
                dept = Department.objects.get(name=dept_name)
                team_leads = CustomUser.objects.filter(display_team_lead=dept)
                if (dept_name != "Dyne Management"):
                    members = CustomUser.objects.filter(groups=4,department=dept)
                else:
                    members = CustomUser.objects.filter(department=dept)


                final_dict[dept.name] = {
                    "team_lead": list(team_leads.values()),
                    "members": list(members.values())
                }
            except Department.DoesNotExist:
                return Response({'error': f'Department {dept_name} does not exist.'}, status=404)

        return Response({'departments': final_dict})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_progress_report(request):
    task_id = request.data.get('task_id')
    report_title = request.data.get('title')
    report_user_email = request.data.get('user')
    report_description = request.data.get('description')
    report_hours = request.data.get('hours')
    report_url = request.data.get('url')

    if not all([task_id, report_title, report_user_email, report_description, report_hours]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    task = get_object_or_404(Task, id=task_id)
    user = get_object_or_404(CustomUser, email=report_user_email)

    prog_report = ProgReport.objects.create(
        user=user,
        task=task,
        report_title=report_title,
        report_description=report_description,
        time_spent=report_hours,
        report_url=report_url

    )

    return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_progress_reports(request):
    task_id = request.data.get('task_id')
    task_obj = get_object_or_404(Task, id=task_id)

    # Fetch all ProgReport objects associated with the task
    reports = ProgReport.objects.filter(task=task_obj)

    # Serialize the queryset with many=True to allow for multiple objects
    final_rep = ProgReportSerializer(reports, many=True)

    return Response(final_rep.data, status=status.HTTP_200_OK)


import secrets
import string
import json

def generate_password(length=20):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

@api_view(['GET'])
def create_passwords(request):
    passwords = [generate_password() for _ in range(50)]
    passwords_json = json.dumps(passwords)

    # Ensure you only have one SP instance or handle accordingly
    if SP.objects.exists():
        sp_instance = SP.objects.first()
        sp_instance.SP_dict = passwords_json
        sp_instance.save()
    else:
        SP.objects.create(SP_dict=passwords_json)

    return Response({'success'}, status=status.HTTP_200_OK)

@api_view(['POST'])  # Assuming you are sending the password in a POST request
def validate_pass(request):
    passw = request.data.get('password')

    # Retrieve the SP object
    obj = get_object_or_404(SP, id=1)

    # Load the passwords from the JSON field
    try:
        passwords = json.loads(obj.SP_dict)
    except json.JSONDecodeError:
        return Response({'error': 'Failed to decode passwords'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Check if the password exists in the list
    if passw in passwords:
        print(passw)
        # Remove the used password
        passwords.remove(passw)

        # Save the updated password list back to the database
        obj.SP_dict = json.dumps(passwords)
        obj.save()

        return Response({'Authorization Successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)


import os
from django.conf import settings
import random

@api_view(['POST'])
def signup(request):
    try:
        User = get_user_model()  # Get the user model
        print(request.data)

        dept = request.data.get('department')
        fname = request.data.get('firstName')
        lname = request.data.get('lastName')
        email = request.data.get('username')
        password = request.data.get('password')

        username = str(fname).lower() + str(lname).lower()
        initials = fname[0].upper() + lname[0].upper()

        # Retrieve or create the department instance
        department_instance, _ = Department.objects.get_or_create(name=dept)

        id = random.randint(111111, 999999)
        objects = User.objects.filter(id = id)

        while objects:
            id = random.randint(111111, 999999)
            objects = User.objects.filter(id = id)


        # Create the user instance
        custom_user = User.objects.create_user(
            username=username,
            email=email,
            first_name=fname,
            last_name=lname,
            initials=initials,
            password=password,
            id = id
        )

        # Assign the department to the user
        custom_user.department.add(department_instance)
        custom_user.save()

        return Response({'message': 'User created successfully'}, status=200)
    except Exception as e:
        print(e)
        return Response({'message': 'Error creating user'}, status=500)

from django.core.mail import send_mail, EmailMessage,EmailMultiAlternatives
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
@api_view(['POST'])
@permission_classes([AllowAny])
def bootcampregisteration(request):
    name = request.data.get('name')
    email = request.data.get('email')
    age = request.data.get('age')
    phone_number = request.data.get('phone_number')
    linkedin = request.data.get('linkedin')
    experience = request.data.get('experience')
    school = request.data.get('school')
    country = request.data.get('country')
    where = request.data.get('where')

    print(request.data)

    # Prepare plain text message
    email_plaintext_message = (
        "Name: " + str(name) + "\n" +
        "Email: " + str(email) + "\n" +
        "Age: " + str(age) + "\n" +
        "Phone Number: " + str(phone_number) + "\n" +
        "LinkedIn: " + str(linkedin) + "\n" +
        "Experience: " + str(experience) + "\n" +
        "School: " + str(school) + "\n" +
        "Country: " + str(country) + "\n" +
        "Where: " + str(where) + "\n"
    )

    # Prepare HTML message
    html_message = render_to_string('email.html', {
        'name': name,
        'email': email,
        'age': age,
        'phone_number': phone_number,
        'linkedin': linkedin,
        'experience': experience,
        'school': school,
        'country': country,
        'where': where,
    })

    try:
        # Send plain text email
        plain_email = EmailMessage(
            "Bootcamp Signup Submission - " + str(name),
            email_plaintext_message,
            "dyneresearch@gmail.com",
            ["varshith.gudeus@gmail.com","sasidhar.jasty@gmail.com", "dyneresearch@gmail.com"],  # Recipients for plain text
        )
        plain_email.send()
        print("normal sent")

        # Send HTML email
        email_message = EmailMessage(
            subject="Dyne Bootcamp Signup Submission Received - Next Steps",
            body=html_message,  # Use HTML message as the body
            from_email="dyneresearch@gmail.com",
            to=["sasidhar.jasty@gmail.com", "dyneresearch@gmail.com", "varshith.gudeus@gmail.com"],
            # Blind Carbon Copy to the email address submitted by the user
            bcc=[email]
        )
        # Set the content type to HTML
        email_message.content_subtype = "html"

        # Send the email
        email_message.send()
        print("Html sent")

    except Exception as e:
        print(f"Error sending email: {e}")
        return Response({'message': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'Submission successful'}, status=status.HTTP_200_OK)